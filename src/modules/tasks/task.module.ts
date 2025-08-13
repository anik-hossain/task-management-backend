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

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
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
  providers: [TaskService, JwtStrategy, RolesGuard],
  exports: [TaskService, JwtStrategy, RolesGuard],
})
export class TaskModule {}