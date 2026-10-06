import { BadRequestException, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './DTO/createUser.dto.js';
import bcrypt from 'bcryptjs';
import { LoginUserDto } from './DTO/loginUser.dto.js';
import { JwtService } from '@nestjs/jwt';
import { AccessTokeType, JwtPayloadType } from '../utils/types.js';

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
      throw new BadRequestException('check username or password');
    }

    const payLoad: JwtPayloadType = { id: user.id, role: user.role };
    const accessToken = await this.generateAccessToken(payLoad);
    return { accessToken };
  }

  private generateAccessToken = async (
    payLoad: JwtPayloadType,
  ): Promise<string> => {
    const accessToken = await this.jwtService.signAsync(payLoad);
    return accessToken;
  };
}
