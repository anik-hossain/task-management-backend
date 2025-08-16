import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { ownerId: number; name: string; members: number[], description?: string, startDate: string, endDate: string }) {
    return this.projectService.createProject(body.ownerId, body.name, body.startDate, body.endDate, body.members, body.description);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll( @Req() req) {
    return this.projectService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Project>) {
    return this.projectService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}
