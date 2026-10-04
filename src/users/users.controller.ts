import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Post,
  Body,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/createUser.dto.js';
import { UpdateUserDto } from './DTO/updateUser.dto.js';
import { UserServices } from './user.services.js';

@Controller('api/users')
export class UsersController {

  constructor(private readonly userService: UserServices) {}
  private users = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Alice Johnson', age: 35 },
  ];
  @Get('')
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Post('')
  createUser(@Body() body: CreateUserDto) {
    console.log('body', body);

    const newUser = {
      id: this.users.length + 1,
      name: body.name,
      age: body.age,
    };
    this.users.push(newUser);
    return newUser;
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    console.log('body', body);

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return new NotFoundException(`User with id ${id} not found`);
    }

    const newUser = {
      id: id,
      name: body.name || user.name,
      age: body.age || user.age,
    };
    this.users.push(newUser);
    return newUser;
  }
}
