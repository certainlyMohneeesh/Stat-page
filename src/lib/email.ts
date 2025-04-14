import nodemailer, { Transporter } from 'nodemailer';
import { prisma } from './prisma';
import type { ServiceStatus, IncidentStatus, MaintenanceStatus } from '.prisma/client';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  private async getOrganizationSubscribers(organizationId: string) {
    return prisma.user.findMany({
      where: {
        organizationId,
        emailNotifications: true,
      },
    });
  }

  async sendServiceStatusUpdate(serviceId: string, newStatus: ServiceStatus) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { organization: true },
    });

    if (!service) return;

    const subscribers = await this.getOrganizationSubscribers(service.organizationId);

    const subject = `Service Status Update: ${service.name} is now ${newStatus}`;
    const text = `
      The status of ${service.name} has been updated to ${newStatus}.
      
      Service: ${service.name}
      New Status: ${newStatus}
      Organization: ${service.organization.name}
      
      You can view more details at: ${process.env.FRONTEND_URL}/status/${service.organization.slug}
    `;

    await this.sendBulkEmail(subscribers, subject, text);
  }

  async sendIncidentUpdate(incidentId: string, status: IncidentStatus) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { service: true, organization: true },
    });

    if (!incident) return;

    const subscribers = await this.getOrganizationSubscribers(incident.organizationId);

    const subject = `Incident Update: ${incident.title} - ${status}`;
    const text = `
      The status of incident "${incident.title}" has been updated to ${status}.
      
      Incident: ${incident.title}
      Service: ${incident.service.name}
      New Status: ${status}
      Organization: ${incident.organization.name}
      
      You can view more details at: ${process.env.FRONTEND_URL}/incidents/${incidentId}
    `;

    await this.sendBulkEmail(subscribers, subject, text);
  }

  async sendMaintenanceUpdate(maintenanceId: string, status: MaintenanceStatus) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { organization: true },
    });

    if (!maintenance) return;

    const subscribers = await this.getOrganizationSubscribers(maintenance.organizationId);

    const subject = `Maintenance Update: ${maintenance.title} - ${status}`;
    const text = `
      The status of maintenance "${maintenance.title}" has been updated to ${status}.
      
      Maintenance: ${maintenance.title}
      New Status: ${status}
      Organization: ${maintenance.organization.name}
      
      You can view more details at: ${process.env.FRONTEND_URL}/maintenance/${maintenanceId}
    `;

    await this.sendBulkEmail(subscribers, subject, text);
  }

  private async sendBulkEmail(
    recipients: { email: string }[],
    subject: string,
    text: string
  ) {
    const promises = recipients.map((recipient) =>
      this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient.email,
        subject,
        text,
      })
    );

    await Promise.all(promises);
  }
} 