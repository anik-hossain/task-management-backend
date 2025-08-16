import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // When a client connects, add them to their own room
  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} connected and joined room user_${userId}`);
    }
  }

  // Notify only assignees when a task is created
  notifyTaskCreation(task: any): void {
    if (task.assignee) {
      this.server.to(`user_${task?.assignee?.id}`).emit('taskCreated', task);
    }
  }

  // Notify only assignees when a task is updated
  notifyTaskUpdate(task: any): void {
    if (task.assignee) {
      this.server.to(`user_${task?.assignee?.id}`).emit('taskUpdated', task);
    }
  }
}
