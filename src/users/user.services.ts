<<<<<<< HEAD
import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
=======
import { BadRequestException, Get, Injectable } from '@nestjs/common';
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './DTO/createUser.dto.js';
import bcrypt from 'bcryptjs';
import { LoginUserDto } from './DTO/loginUser.dto.js';
import { JwtService } from '@nestjs/jwt';
import { AccessTokeType, JwtPayloadType } from '../utils/types.js';
<<<<<<< HEAD
import { UpdateUserDto } from './DTO/updateUser.dto.js';
import { UserRole } from '../utils/enums.js';
=======
>>>>>>> 47a567bc117c759e3298386dea82475883322a25

@Injectable()
export class UserServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({
    name,
    email,
    password,
  }: CreateUserDto): Promise<AccessTokeType> {
    const checkUserExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (checkUserExist) {
      throw new BadRequestException('check username or password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPasswored = await bcrypt.hash(password, salt);
    const newUser = await this.prisma.user.create({
      data: { name, email, password: hashedPasswored },
    });

    const payLoad: JwtPayloadType = { id: newUser.id, role: newUser.role };
    const accessToken = await this.generateAccessToken(payLoad);
    return { accessToken };
  }

  async loginUser({ email, password }: LoginUserDto): Promise<AccessTokeType> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('check username or password');
    }

    const plainPassword = await bcrypt.compare(password, user.password); // true
    if (!plainPassword) {
<<<<<<< HEAD
      throw new BadRequestException('check username or password from here');
=======
      throw new BadRequestException('check username or password');
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
    }

    const payLoad: JwtPayloadType = { id: user.id, role: user.role };
    const accessToken = await this.generateAccessToken(payLoad);
    return { accessToken };
  }

<<<<<<< HEAD
  async getCurrentUser(id:string){

    const user=await this.prisma.user.findUnique({where:{id},})
    if(!user){
      throw new NotFoundException('user not found')
    }
    return user
  }

 async getAllUsers(){
  return await this.prisma.user.findMany()
 } 

 async updateUser(id:string, {name,password}:UpdateUserDto){

  const user=await this.prisma.user.findUnique({where:{id}})
  if(!user){
    throw new NotFoundException('user not found')
  }

  user.name=name??user.name;

  const salt = await bcrypt.genSalt(10);
  user.password=password?await bcrypt.hash(password, salt):user.password;
  const updatedUser=await this.prisma.user.update({where:{id},data:user})
  return updatedUser
  
 }

 async deleteUser(id:string,payload:JwtPayloadType){
  const user=await this.prisma.user.findUnique({where:{id}})
  if(!user){
    throw new NotFoundException('user not found')
  }
  if(user.role===UserRole.ADMIN || user.id===payload.id){
    await this.prisma.user.delete({where:{id}})
    return {message:'user deleted successfully'}
  }else{
    throw new BadRequestException('you are not allowed to delete this user')
  }
 }



=======
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
  private generateAccessToken = async (
    payLoad: JwtPayloadType,
  ): Promise<string> => {
    const accessToken = await this.jwtService.signAsync(payLoad);
    return accessToken;
  };
}
