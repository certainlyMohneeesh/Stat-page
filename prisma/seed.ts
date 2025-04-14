import { PrismaClient, IncidentStatus, ImpactLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Default Organization',
      slug: 'default-org',
    },
  });

  // Create some services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'API Service',
        description: 'Main API endpoint for all client requests',
        status: 'OPERATIONAL',
        organizationId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Database',
        description: 'Primary database service',
        status: 'OPERATIONAL',
        organizationId: organization.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Web Server',
        description: 'Main web server hosting the application',
        status: 'OPERATIONAL',
        organizationId: organization.id,
      },
    }),
  ]);

  // Create some incidents
  await Promise.all([
    prisma.incident.create({
      data: {
        title: 'Database Connection Issues',
        description: 'Temporary database connection issues affecting API performance',
        status: IncidentStatus.RESOLVED,
        impact: ImpactLevel.MAJOR,
        organizationId: organization.id,
        resolvedAt: new Date(),
      },
    }),
    prisma.incident.create({
      data: {
        title: 'Scheduled Maintenance',
        description: 'Regular system maintenance and updates',
        status: IncidentStatus.RESOLVED,
        impact: ImpactLevel.NONE,
        organizationId: organization.id,
        resolvedAt: new Date(),
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {}; 