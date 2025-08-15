import { Controller, Post, Get, Body, UseGuards, Param, Req, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UpdateStatusDto } from './dto/UpdateStatusDto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async index(@Param('id') id: string, @Req() req) {
    // Pass the logged-in user to the service
    return this.taskService.index(id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async tasks(@Param('id') id: string, @Body() taskDto: CreateTaskDto) {
    return this.taskService.create(id, taskDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number) {
    return this.taskService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto
  ) {
    return this.taskService.updateStatus(req.user, Number(id), dto.status);
  }
}