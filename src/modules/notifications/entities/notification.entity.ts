import { User } from '@/common/entities/user.entity';
import { Task } from '@/modules/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Task, { nullable: true, onDelete: 'SET NULL' })
  task?: Task;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: 'task' })
  type: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
