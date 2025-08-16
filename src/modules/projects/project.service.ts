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
  ) { }

  async createProject(
    ownerId: number,
    name: string,
    startDate: string,
    endDate: string,
    members: number[],
    description?: string,
  ) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');

    const project = this.projectRepo.create({
      name,
      description,
      owner,
      startDate,
      endDate,
    });

    await this.projectRepo.save(project);

    // Add owner as admin
    const ownerMembership = this.projectMemberRepo.create({
      project,
      user: owner,
      role: 'admin',
    });
    await this.projectMemberRepo.save(ownerMembership);

    // Add other members (if any)
    if (members.length) {
      const memberEntities = await this.userRepo.findByIds(members);
      const memberships = memberEntities.map((user) =>
        this.projectMemberRepo.create({
          project,
          user,
          role: 'member',
        }),
      );
      await this.projectMemberRepo.save(memberships);
    }

    return project;
  }



  findTasksByProjID(id: string) {
    return this.projectRepo.findOne({
      where: { id: Number(id) },
      relations: ['tasks', 'tasks.assignee'],
    });
  }

  async findAll(user: User) {
    let projects;

    if (user.role === 'admin' || user.role === 'manager') {
      // Admin & Manager -> see all projects
      projects = await this.projectRepo.find({
        relations: ['owner', 'members'],
      });
    } else {
      // Associate -> only see projects where they're a member
      projects = await this.projectRepo.find({
        where: { members: { user: user } },
        relations: ['owner', 'members'],
      });
    }

    return projects.length > 0 ? projects : [];
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
