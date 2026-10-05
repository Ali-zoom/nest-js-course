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
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/createUser.dto.js';
import { UpdateUserDto } from './DTO/updateUser.dto.js';
import { UserServices } from './user.services.js';
import { LoginUserDto } from './DTO/loginUser.dto.js';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UserServices) {}

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {}

  @Post('/auth/register')
  register(@Body() body: CreateUserDto) {
    return this.userService.registerUser(body);
  }

  @Post('/auth/login')
   @HttpCode(200)
  login(@Body() body: LoginUserDto) {
    return this.userService.loginUser(body);
  }

  // @Put(':id')
  // updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() body: UpdateUserDto,
  // ) {
  //   console.log('body', body);

  //   const user = this.users.find((u) => u.id === id);
  //   if (!user) {
  //     return new NotFoundException(`User with id ${id} not found`);
  //   }

  //   const newUser = {
  //     id: id,
  //     name: body.name || user.name,
  //     age: body.age || user.age,
  //   };
  //   this.users.push(newUser);
  //   return newUser;
  // }
}
