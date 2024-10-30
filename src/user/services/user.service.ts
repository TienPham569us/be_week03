import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { USER_REPOSITORY } from '../providers';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {}

  public async create(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    
    return await this.userRepository.create<User>({
      ...userDto,
      password: hashedPassword
    });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  public async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  public async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }
}
