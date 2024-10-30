import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

const transformError = (error: ValidationError) => {
  const { property, constraints } = error;
  return {
    property,
    constraints
  };
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(DoesUserExist)
  @Post('register')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const data = {
        mode: 'create'
      };

      // validation
      const object = plainToInstance(CreateUserDto, createUserDto);
      const errors = await validate(object, {
        stopAtFirstError: true
      });

      console.log('errors: ', errors);

      if (errors.length > 0) {
        console.log('errors: ', errors);
        Reflect.set(data, 'error', 'Please correct all fields!');
        const responseError = {};
        errors.map((error) => {
          const rawError = transformError(error);
          Reflect.set(responseError, rawError.property, Object.values(rawError.constraints)[0]);
        });
        Reflect.set(data, 'errors', responseError);
        return { data };
      }

      const userExist = await this.userService.findOneByEmail(createUserDto.email);
      if (userExist) {
        throw new ForbiddenException('This email already exist');
        return;
      }

      const usernameExist = await this.userService.findOneByUsername(createUserDto.username);
      if (usernameExist) {
        throw new ForbiddenException('This username already exist');
        return;
      }

      // set value and show success message
      Reflect.set(data, 'email', object.email);
      Reflect.set(data, 'username', object.username);
      //console.log('data1: ', data);
      const user = await this.userService.create({ ...object });

      Reflect.set(data, 'success', `Account ${user.email} - has been created successfully!`);
      //console.log('data2: ', data);
      return { data };
      //return this.userService.createUser({ ...object });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.log('error: ', error);
      throw new InternalServerErrorException('Server error! Please try again later...');
    }
  }
}
