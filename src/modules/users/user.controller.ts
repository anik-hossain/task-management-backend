import { Controller, Get, UseGuards } from '@nestjs/common';
import { TaskService } from './user.service';
import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private taskService: TaskService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async tasks() {
    return this.taskService.index();
  }
}