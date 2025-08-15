import { User } from '@/common/entities/user.entity';
import { Project } from '@/modules/projects/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { TaskDependency } from './task-dependencies.entity';


export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

 @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: 'enum', enum: Priority, default: Priority.LOW })
  priority: Priority;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignee: User;

  @Column({ nullable: true, type: 'date' })
  startDate: string;

  @Column({ nullable: true, type: 'date' })
  dueDate: string;

  @OneToMany(() => TaskDependency, (dependency) => dependency.task)
  dependencies: TaskDependency[];
}
