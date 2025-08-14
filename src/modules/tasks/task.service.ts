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

   private allowedTransitions: Record<string, Record<string, string[]>> = {
    admin: {
      pending: ['in-progress', 'completed'],
      'in-progress': ['pending', 'completed'],
      completed: ['pending', 'in-progress'],
    },
    manager: {
      pending: ['in-progress', 'completed'],
      'in-progress': ['pending', 'completed'],
      completed: ['pending', 'in-progress'],
    },
    member: {
      pending: ['in-progress'],
      'in-progress': ['completed'],
      completed: [],
    },
  };

  async updateStatus(user: User, taskId: number, newStatus: string): Promise<Task> {
    const task = await this.findById(taskId);

    const allowed = this.allowedTransitions[user.role]?.[task.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException('You are not allowed to change to this status');
    }

    task.status = newStatus as any;
    return this.tasksRepository.save(task);
  }
}