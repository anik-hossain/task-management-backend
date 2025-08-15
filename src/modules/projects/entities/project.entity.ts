import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProjectMember } from './project-member.entity';
import { User } from '@/common/entities/user.entity';
import { Task } from '@/modules/tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.ownedProjects, { nullable: true })
  owner: User;

  @Column({ default: 'active' })
  status: string;
  @Column({ nullable: true, type: 'date' })
  startDate: string;

  @Column({ nullable: true, type: 'date' })
  endDate: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectMember, (pm) => pm.project)
  members: ProjectMember[];
}
