import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { User } from '@/common/entities/user.entity';
import { NotificationsService } from './notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Get all notifications for the logged-in user
  @Get()
  async findAll(@GetUser() user: User) {
    return this.notificationsService.findAllForUser(user.id);
  }

  // Mark a notification as read
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @GetUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  // Delete a notification
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.notificationsService.remove(id, user.id);
  }
}
