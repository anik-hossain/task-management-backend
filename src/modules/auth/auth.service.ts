import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../common/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}


  // Register a new member user
  async register(registerDto: RegisterDto): Promise<{ accessToken: string, user: Partial<User> }> {
    const { email, password, name } = registerDto;
    
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.MEMBER,
    });

    await this.usersRepository.save(user);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Return only safe user info
    return { accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  // Login user
  async login(loginDto: LoginDto): Promise<{ accessToken: string, user: Partial<User> }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email, },
      select: ['id', 'email', 'name', 'role', 'password']
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  // Find user by ID
  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Get currently logged in user (by ID)
  async getLoggedInUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
