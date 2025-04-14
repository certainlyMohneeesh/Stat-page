import { Request, Response, NextFunction } from 'express';

const cache: { [key: string]: any } = {};

// Cache middleware
export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl; // Use the request URL as the cache key

  if (cache[key]) {
    // If the response is cached, return it
    return res.status(200).json(cache[key]);
  }

  // Store the original send method
  const originalSend = res.send.bind(res);

  // Override the send method to cache the response
  res.send = (body: any) => {
    cache[key] = body; // Cache the response
    return originalSend(body); // Call the original send method
  };

  next(); // Proceed to the next middleware or route handler
};