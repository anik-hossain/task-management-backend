import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Notification } from '@/modules/notifications/entities/notification.entity';
import { Project } from '@/modules/projects/entities/project.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import { ProjectMember } from '@/modules/projects/entities/project-member.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => ProjectMember, (pm) => pm.user)
  projectMemberships: ProjectMember[];
}
