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
  UseGuards,
  Req,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Res
} from '@nestjs/common';
import { CreateUserDto } from './DTO/createUser.dto.js';
import { UpdateUserDto } from './DTO/updateUser.dto.js';
import { UserServices } from './user.services.js';
import { LoginUserDto } from './DTO/loginUser.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import type { JwtPayloadType } from '../utils/types.js';
import { CurrentUser } from './decorator/current-user.decorator.js';
import { User } from '../generated/prisma/client.js';
import { Roles } from './decorator/user-role.decorator.js';
import { UserRole } from '../utils/enums.js';
import { AuthRolesGuard } from './guards/auth-roles.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { throttle } from 'rxjs';
import { Throttle } from '@nestjs/throttler';

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

  @Get('/auth/current-user')
  @UseGuards(AuthGuard)
  // getCurrentUser(@Req() request:any){ old way
  getCurrentUser(@CurrentUser() payload: JwtPayloadType): Promise<User> {
    // we can use @CurrentUser decorator to get the payload from request instead of using @Req() request
    // const payload:JwtPayloadType=request["user"]//we add it to request in AuthGuard
    // console.log(payload)
    return this.userService.getCurrentUser(payload.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  getAllUsers(@Query("pageNumber",ParseIntPipe) pageNumber:number,@Query("pageSize",ParseIntPipe) pageSize:number) {
    return this.userService.getAllUsers(pageNumber,pageSize);
  }

  @Put()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthRolesGuard)
  updateUser(@CurrentUser() payload: JwtPayloadType, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(payload.id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  deleteUser(@Param('id') id:string,@CurrentUser() payload: JwtPayloadType) {
    return this.userService.deleteUser(id,payload);
  }

    @Post("upload-profile-image")
    @UseGuards(AuthGuard)
    @UseInterceptors(
      FileInterceptor('profile-image'),
    )
    uploadProfileImage(@UploadedFile() file: Express.Multer.File,@CurrentUser() payload:JwtPayloadType) {
      if (!file) throw new BadRequestException('File not found');
     
      return this.userService.uploadProfileImage(payload.id,file.filename)
    }
  
@Delete("image/remove-profile-image")
@UseGuards(AuthGuard)
removeProfileImage(@CurrentUser() payload:JwtPayloadType){
  return this.userService.removeProfileImage(payload.id)
}



    //get uploaded file
    @Get('images/:profileImage')
    @UseGuards(AuthGuard)
    getUploadedFile(@Param('profileImage') profileImage: string, @Res() res: Response) {
    
      return res.sendFile(profileImage, { root: 'images/profile' });
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
