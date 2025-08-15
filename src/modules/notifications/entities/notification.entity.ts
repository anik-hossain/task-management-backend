// notification.entity.ts
import { User } from '@/common/entities/user.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @ManyToOne(() => Task, { nullable: true })
  task?: Task;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: 'task' })
  type: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
