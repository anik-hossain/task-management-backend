import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';;
import { ProjectMember } from './entities/project-member.entity';
import { User } from '@/common/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>,
  ) {}

  async createProject(ownerId: number, name: string, description?: string) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');

    const project = this.projectRepo.create({ name, description, owner });
    await this.projectRepo.save(project);

    // Add owner as a member
    const membership = this.projectMemberRepo.create({
      project,
      user: owner,
      role: 'admin',
    });
    await this.projectMemberRepo.save(membership);

    return project;
  }

  findAll() {
    return this.projectRepo.find({ relations: ['owner', 'members'] });
  }

  findOne(id: number) {
    return this.projectRepo.findOne({ 
      where: { id },
      relations: ['owner', 'members', 'tasks'],
    });
  }

  async update(id: number, data: Partial<Project>) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    Object.assign(project, data);
    return this.projectRepo.save(project);
  }

  async remove(id: number) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    return this.projectRepo.remove(project);
  }
}
