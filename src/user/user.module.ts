import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userProvider } from './providers/user.provider';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ...userProvider, UserRepository],
  exports: [UserService],
})
export class UserModule {}
