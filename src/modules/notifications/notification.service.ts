import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '@/common/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

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

    async markAsRead(id: string, userId: number) {
        const notification = await this.notificationRepo.findOne({
            where: { id: Number(id) },
            relations: ['user'],
        });
        if (!notification) throw new NotFoundException('Notification not found');
        if (notification.user.id !== userId)
            throw new ForbiddenException('Not your notification');

        notification.is_read = true;
        return this.notificationRepo.save(notification);
    }

    async remove(id: string, userId: number) {
        const notification = await this.notificationRepo.findOne({
            where: { id: Number(id) },
            relations: ['user'],
        });
        if (!notification) throw new NotFoundException('Notification not found');
        if (notification.user.id !== userId)
            throw new ForbiddenException('Not your notification');

        await this.notificationRepo.remove(notification);
        return { message: 'Notification deleted' };
    }

    // Utility: Create notification
    async create(userId: User, task: { title: string, type: string, message: string, task?: Task }) {
        const notification = this.notificationRepo.save({
            title: task.title,
            message: task.message,
            type: task.type,
            user: userId,
            task: task.task,
        });
        return notification
    }
}
