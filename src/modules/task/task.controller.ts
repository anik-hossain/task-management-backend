import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateDto } from './dto/create.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@common/entities/user.entity';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async tasks(@Body() taskDto: CreateDto) {
    return this.taskService.create(taskDto);
  }
}