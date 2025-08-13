import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create.dto';
import { Task } from './entities/task.entity';
import { User } from '@/common/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
     @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async index(): Promise<string> {

    return 'Users'
  }
}
