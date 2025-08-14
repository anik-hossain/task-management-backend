import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@common/entities/user.entity';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index() {
    return this.taskService.index();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async tasks(@Body() taskDto: CreateTaskDto) {
    return this.taskService.create(taskDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number) {
    return this.taskService.findById(id);
  }
}