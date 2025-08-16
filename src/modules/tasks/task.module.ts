import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@common/strategies/jwt.strategy';
import { RolesGuard } from '@common/guards/roles.guard';
import { Task } from './entities/task.entity';
import { User } from '@/common/entities/user.entity';
import { NotificationGateway } from '../../common/index.gateway';
import { NotificationsModule } from '../notifications/notification.module';
import { TaskDependency } from './entities/task-dependencies.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectModule } from '../projects/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, TaskDependency, Project]),
    NotificationsModule,
    ProjectModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, JwtStrategy, RolesGuard, NotificationGateway],
  exports: [TaskService, JwtStrategy, RolesGuard],
})
export class TaskModule {}