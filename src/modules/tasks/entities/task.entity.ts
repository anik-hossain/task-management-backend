import { User } from '@/common/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignees: User[];

  @Column({ type: 'enum', enum: Priority, default: Priority.LOW })
  priority: Priority;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column({ nullable: true })
  dependencies: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
