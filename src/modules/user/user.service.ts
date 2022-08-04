import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(data);
    const userSaved = await this.userRepository.save(user);
    if (!userSaved) {
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
    return userSaved;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUser(data: UpdateUserInput): Promise<User> {
    const user = await this.getUserById(data.id);
    await this.userRepository.update(user, { ...data });
    return this.userRepository.create({ ...user, ...data });
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    const userDeleted = await this.userRepository.delete(user);
    if (userDeleted) {
      return true;
    }
    return false;
  }
}
