import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create.dto';
import { Task } from './entities/task.entity';
import { User } from '@/common/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
     @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async create(createDTO: CreateTaskDto): Promise<Task> {
    const assignees = await this.userRepository.findByIds(createDTO.assigneeIds);
    const task = this.tasksRepository.create({
      ...createDTO,
      assignees, // these are full User entities
    });

    return this.tasksRepository.save(task);
  }
}