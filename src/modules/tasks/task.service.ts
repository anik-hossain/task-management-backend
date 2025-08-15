import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create.dto';
import { Task } from './entities/task.entity';
import { User } from '@/common/entities/user.entity';
import { TasksGateway } from './tasks.gateway';
import { NotificationsService } from '../notifications/notification.service';
import { ProjectService } from '../projects/project.service';

@Injectable()
export class TaskService {
 constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly notificationsService: NotificationsService,
    private readonly projectService: ProjectService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  // Get tasks for user
  async index(projectID: string) {
    if (projectID === 'undefined') return null;

    return this.projectService.findTasksByProjID(projectID)
  }


  // Create task
  async create(id: number | string, createDTO: CreateTaskDto): Promise<Task> {
    const assignee = await this.userRepository.findOne({ where: { id: createDTO.assigneeId } });
    if (!assignee) throw new NotFoundException(`User with id ${createDTO.assigneeId} not found`);

    let dependenciesEntities: any = [];
    if (createDTO.dependencies && createDTO.dependencies.length) {
      dependenciesEntities = createDTO.dependencies.map(depId => {
        return this.tasksRepository.create({
          id: depId,
        } as any); // temporary placeholder for relation
      });
    }

    const task = this.tasksRepository.create({
      project: { id: Number(id) },
      title: createDTO.title,
      description: createDTO.description,
      priority: createDTO.priority,
      startDate: createDTO.startDate,
      dueDate: createDTO.dueDate,
      assignee,
      dependencies: dependenciesEntities,
    });

    const savedTask = await this.tasksRepository.save(task);

    await this.notificationsService.create(assignee, {
      title: 'New Task Assigned',
      type: 'task',
      message: `You have been assigned a new task: ${task.title}`,
      task: savedTask,
    });

    this.tasksGateway.notifyTaskCreation(savedTask);
    return savedTask;
  }



  // Get task by id
  async findById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignee', 'project'],
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  // Allowed status transitions based on role
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

  // Update task status
  async updateStatus(user: User, taskId: number, newStatus: string): Promise<Task> {
    const task = await this.findById(taskId);

    const allowed = this.allowedTransitions[user.role]?.[task.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException('You are not allowed to change to this status');
    }

    task.status = newStatus as any;
    const updatedTask = await this.tasksRepository.save(task);

    // Notify assignee about status update
    if (task.assignee) {
      await this.notificationsService.create(task.assignee, {
        title: `Task status updated`,
        type: 'task',
        message: `The status of task "${task.title}" has been updated to "${newStatus}".`,
        task: updatedTask,
      });
    }

    this.tasksGateway.notifyTaskUpdate(updatedTask);
    return updatedTask;
  }
}
