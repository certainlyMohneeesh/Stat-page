import { prisma } from './prisma';
import type { 
  ServiceStatus, 
  IncidentStatus, 
  MaintenanceStatus, 
  Role 
} from '.prisma/client';

// User Operations
export const userService = {
  create: async (data: { 
    email: string; 
    password: string; 
    name?: string; 
    organizationId: string;
    emailNotifications?: boolean;
  }) => {
    return prisma.user.create({ data });
  },
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
  findById: async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },
  update: async (id: string, data: {
    email?: string;
    password?: string;
    name?: string;
    emailNotifications?: boolean;
  }) => {
    return prisma.user.update({ where: { id }, data });
  },
};

// Organization Operations
export const organizationService = {
  create: async (data: { name: string; slug: string }) => {
    return prisma.organization.create({ data });
  },
  findById: async (id: string) => {
    return prisma.organization.findUnique({ where: { id } });
  },
  findBySlug: async (slug: string) => {
    return prisma.organization.findUnique({ where: { slug } });
  },
  update: async (id: string, data: { name?: string; slug?: string }) => {
    return prisma.organization.update({ where: { id }, data });
  },
};

// Team Operations
export const teamService = {
  create: async (data: { name: string; organizationId: string }) => {
    return prisma.team.create({ data });
  },
  addUser: async (teamId: string, userId: string, role: Role = 'USER') => {
    return prisma.teamUser.create({
      data: { teamId, userId, role },
    });
  },
  findById: async (id: string) => {
    return prisma.team.findUnique({
      where: { id },
      include: { users: { include: { user: true } } },
    });
  },
};

// Service Operations
export const serviceService = {
  create: async (data: { 
    name: string; 
    description?: string; 
    organizationId: string;
    status?: ServiceStatus;
  }) => {
    return prisma.service.create({ data });
  },
  updateStatus: async (id: string, status: ServiceStatus) => {
    return prisma.service.update({
      where: { id },
      data: { status },
    });
  },
  findById: async (id: string) => {
    return prisma.service.findUnique({ where: { id } });
  },
  findByOrganization: async (organizationId: string) => {
    return prisma.service.findMany({ where: { organizationId } });
  },
};

// Incident Operations
export const incidentService = {
  create: async (data: {
    title: string;
    description: string;
    serviceId: string;
    organizationId: string;
    status?: IncidentStatus;
  }) => {
    return prisma.incident.create({ data });
  },
  addUpdate: async (incidentId: string, data: { status: string; message: string }) => {
    return prisma.incidentUpdate.create({
      data: { ...data, incidentId },
    });
  },
  updateStatus: async (id: string, status: IncidentStatus) => {
    return prisma.incident.update({
      where: { id },
      data: { status, resolvedAt: status === 'RESOLVED' ? new Date() : undefined },
    });
  },
  findById: async (id: string) => {
    return prisma.incident.findUnique({
      where: { id },
      include: { updates: true },
    });
  },
  findByOrganization: async (organizationId: string) => {
    return prisma.incident.findMany({
      where: { organizationId },
      include: { updates: true },
    });
  },
};

// Maintenance Operations
export const maintenanceService = {
  create: async (data: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    organizationId: string;
    affectedServices: string[];
    status?: MaintenanceStatus;
  }) => {
    return prisma.maintenance.create({ data });
  },
  updateStatus: async (id: string, status: MaintenanceStatus) => {
    return prisma.maintenance.update({
      where: { id },
      data: { status },
    });
  },
  findById: async (id: string) => {
    return prisma.maintenance.findUnique({ where: { id } });
  },
  findByOrganization: async (organizationId: string) => {
    return prisma.maintenance.findMany({ where: { organizationId } });
  },
};

// Metric Operations
export const metricService = {
  create: async (data: { 
    name: string; 
    value: number; 
    unit: string; 
    serviceId: string;
  }) => {
    return prisma.metric.create({ data });
  },
  findByService: async (serviceId: string, startTime?: Date, endTime?: Date) => {
    return prisma.metric.findMany({
      where: {
        serviceId,
        timestamp: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  },
}; 