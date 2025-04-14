import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { RedisStore } from 'connect-redis';import { createClient } from 'redis';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { validateRequest } from './middleware/validateRequest';
import { cacheMiddleware } from './middleware/cache';
import { defaultRateLimiter, authRateLimiter } from './middleware/rateLimiter';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Redis setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Session store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'status-page:',
});

// Security middleware
app.use(helmet());
app.use(compression() as express.RequestHandler);
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Session configuration
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiting
app.use(defaultRateLimiter);
app.use('/api/auth', authRateLimiter);

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: { email: profile.emails?.[0].value },
          update: {
            name: profile.displayName,
            updatedAt: new Date(),
          },
          create: {
            email: profile.emails?.[0].value || '',
            name: profile.displayName,
            password: '', // OAuth users don't need password
            organization: {
              create: {
                name: `${profile.displayName}'s Organization`,
                slug: profile.id,
              },
            },
          },
        });
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: '/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.upsert({
          where: { email: profile.emails?.[0].value },
          update: {
            name: profile.displayName,
            updatedAt: new Date(),
          },
          create: {
            email: profile.emails?.[0].value || '',
            name: profile.displayName,
            password: '', // OAuth users don't need password
            organization: {
              create: {
                name: `${profile.displayName}'s Organization`,
                slug: profile.id,
              },
            },
          },
        });
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Auth routes
app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// API Routes with caching and validation
app.get('/api/services', cacheMiddleware, async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { organizationId: (req.user as any)?.organizationId },
      include: { metrics: { orderBy: { timestamp: 'desc' }, take: 1 } },
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
});
app.post('/api/services', validateRequest, async (req, res, next) => {
  try {
    const service = await prisma.service.create({
      data: {
        ...req.body,
        organizationId: req.user?.organizationId,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

app.get('/api/incidents', cacheMiddleware, async (req, res, next) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { organizationId: (req.user as any)?.organizationId },
      include: { updates: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    next(error);
  }
});

app.post('/api/incidents', validateRequest, async (req, res, next) => {
  try {
    const incident = await prisma.incident.create({
      data: {
        ...req.body,
        organizationId: req.user?.organizationId,
      },
    });
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
});

app.get('/api/system-status', cacheMiddleware, async (req, res, next) => {
  try {
    const [services, incidents] = await Promise.all([
      prisma.service.findMany({
        where: { organizationId: (req.user as any)?.organizationId },
      }),
      prisma.incident.findMany({
        where: {
          organizationId: (req.user as any)?.organizationId,
          status: { not: 'RESOLVED' },
        },
      }),
    ]);

    const systemStatus = {
      overallStatus: incidents.length > 0 ? 'DEGRADED' : 'OPERATIONAL',
      activeIncidents: incidents.length,
      services: services.map(service => ({
        name: service.name,
        status: service.status,
      })),
    };

    res.json(systemStatus);
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 