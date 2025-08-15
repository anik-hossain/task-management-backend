import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '@/common/entities/user.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }

    async findAllForUser(userId: number) {
        return this.notificationRepo.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
    }

    async markAsRead(id: number, userId: number) {
        const notification = await this.notificationRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!notification) throw new NotFoundException('Notification not found');
        if (notification.user.id !== userId)
            throw new ForbiddenException('Not your notification');

        notification.is_read = true;
        return this.notificationRepo.save(notification);
    }

    async remove(id: number, userId: number) {
        const notification = await this.notificationRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!notification) throw new NotFoundException('Notification not found');
        if (notification.user.id !== userId)
            throw new ForbiddenException('Not your notification');

        await this.notificationRepo.remove(notification);
        return { message: 'Notification deleted' };
    }

    //   await this.notificationsService.save({
    //         user: assignee,
    //         title: 'New Task Assigned',
    //         message: `You have been assigned a new task: ${task.title}`,
    //         type: 'task',
    //       });

    // Utility: Create notification
    async create(userId: User, task: { title: string, type: string }) {
        const notification = this.notificationRepo.save({
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${task.title}`,
            type: task.type,
            user: userId,
        });
        return notification
    }
}
