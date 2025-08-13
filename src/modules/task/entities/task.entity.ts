import { User } from '@/common/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high', // fixed from 'member' to 'high'
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  assign: User;

  @Column({ type: 'enum', enum: Priority, default: Priority.LOW })
  priority: Priority;

  @Column()
  start_date: string;
  
  @Column()
  end_date: string;
  
  @Column({ nullable: true })
  dependencies: string;
}
