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



  async findTasksByProjID(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id: Number(id) },
      relations: ['tasks', 'tasks.assignee', 'members.user'],
    });

    if (!project) return null;

    const members = project.members.map((m) => m.user);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      tasks: project.tasks,
      members,
    };
  }


  async findAll(user: User) {
    let projects;

    if (user.role === 'admin' || user.role === 'manager') {
      // Admin & Manager -> see all projects
      projects = await this.projectRepo.find({
        relations: ['owner', 'members.user'],
      });
    } else {
      // Associate -> only see projects where they're a member
      projects = await this.projectRepo.find({
        where: { members: { user: user } },
        relations: ['owner', 'members.user'],
      });
    }

    if (!projects || projects.length === 0) return [];

    // Map members to just User objects
    return projects.map(project => ({
      ...project,
      members: project.members.map(m => m.user),
    }));
  }



  findOne(id: number) {
    return this.projectRepo.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks'],
    });
  }

  async update(id: number, data: Partial<Project>) {
    // Load project with members and owner
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['members', 'owner', 'tasks'],
    });
    if (!project) throw new NotFoundException('Project not found');

    // Update project fields
    Object.assign(project, data);
    const updatedProject = await this.projectRepo.save(project);

    // Update members if provided and owner exists
    if (data.members && project.owner) {
      const ownerId = project.owner.id;

      // Remove old members except the owner
      // @ts-ignore
      const oldMemberIds = project.members.filter(memberId => memberId !== ownerId);
      if (oldMemberIds.length) {
        const oldMembers = await this.projectMemberRepo.findByIds(oldMemberIds);
        await this.projectMemberRepo.remove(oldMembers);
      }

      // Add new members, excluding owner
      // @ts-ignore
      const newMemberIds = data.members.filter(id => id !== ownerId);
      if (newMemberIds.length) {
        const memberEntities = await this.userRepo.findByIds(newMemberIds);
        const memberships = memberEntities.map(user =>
          this.projectMemberRepo.create({
            project: updatedProject,
            user,
            role: 'member',
          }),
        );
        await this.projectMemberRepo.save(memberships);
      }
    }

    // Reload project with members, tasks, owner for frontend
    const projectWithMembers = await this.projectRepo.findOne({
      where: { id },
      relations: ['members', 'owner', 'tasks'],
    });

    return projectWithMembers;
  }


  async remove(id: number) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    return this.projectRepo.remove(project);
  }
}
