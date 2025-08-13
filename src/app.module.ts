import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/task.module';
import { UserController } from './modules/users/user.controller';

@Module({
  imports: [
    // Load env vars from .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Modules
    AuthModule,
    TaskModule,
    UserController
  ],
})
export class AppModule {}
