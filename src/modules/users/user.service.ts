import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/common/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
     @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async index(): Promise<User[]> {

    return await this.userRepository.find()
  }
}
