import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { prisma } from './prisma';
import type { ServiceStatus, IncidentStatus, MaintenanceStatus } from '.prisma/client';

interface WebSocketMessage {
  type: 'status' | 'incident' | 'maintenance';
  data: any;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });
  }

  broadcast(message: WebSocketMessage) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  async notifyServiceStatusChange(serviceId: string, newStatus: ServiceStatus) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { organization: true },
    });

    if (service) {
      this.broadcast({
        type: 'status',
        data: {
          serviceId,
          status: newStatus,
          organizationId: service.organizationId,
        },
      });
    }
  }

  async notifyIncidentUpdate(incidentId: string, status: IncidentStatus) {
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { organization: true },
    });

    if (incident) {
      this.broadcast({
        type: 'incident',
        data: {
          incidentId,
          status,
          organizationId: incident.organizationId,
        },
      });
    }
  }

  async notifyMaintenanceUpdate(maintenanceId: string, status: MaintenanceStatus) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { organization: true },
    });

    if (maintenance) {
      this.broadcast({
        type: 'maintenance',
        data: {
          maintenanceId,
          status,
          organizationId: maintenance.organizationId,
        },
      });
    }
  }
} 