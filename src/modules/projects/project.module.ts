import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { User } from '@/common/entities/user.entity';
import { NotificationGateway } from '@/common/index.gateway';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, ProjectMember]),
    NotificationsModule,
  ],
  providers: [ProjectService, NotificationGateway],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
