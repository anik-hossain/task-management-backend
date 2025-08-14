// tasks.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  notifyTaskUpdate(taskId: string | number, status: string): void {
    this.server.emit('taskUpdated', { taskId, status });
  }
}
