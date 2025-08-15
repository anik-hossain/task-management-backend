import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_dependencies')
@Unique(['task', 'dependsOnTask'])
export class TaskDependency {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.dependencies, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  dependsOnTask: Task;
}
