import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  findAll() {
    return User.findAll();
  }

  async create(user: User) {
    return await User.create({ ...user });
  }
}
