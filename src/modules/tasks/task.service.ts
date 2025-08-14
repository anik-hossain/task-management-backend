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

  async index(user: User): Promise<Task[]> {
    if (['admin', 'manager'].includes(user.role)) {
      return this.tasksRepository.find({ relations: ['assignees'] });
    }

    return this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignees', 'assignee')
      .where('assignee.id = :userId', { userId: user.id })
      .getMany();
  }


  async create(createDTO: CreateTaskDto): Promise<Task> {
    const assignees = await this.userRepository.findByIds(createDTO.assignees);
    const task = this.tasksRepository.create({
      ...createDTO,
      assignees,
    });

    return this.tasksRepository.save(task);
  }

  // get task by id
  async findById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['assignees'] });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }
}