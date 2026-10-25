import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './DTO/createUser.dto.js';
import bcrypt from 'bcryptjs';
import { LoginUserDto } from './DTO/loginUser.dto.js';
import { JwtService } from '@nestjs/jwt';
import { AccessTokeType, JwtPayloadType } from '../utils/types.js';
import { UpdateUserDto } from './DTO/updateUser.dto.js';
import { UserRole } from '../utils/enums.js';
import {join} from 'node:path'
import {unlinkSync} from 'node:fs'
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
      throw new BadRequestException('check username or password from here');
    }

    const payLoad: JwtPayloadType = { id: user.id, role: user.role };
    const accessToken = await this.generateAccessToken(payLoad);
    return { accessToken };
  }

  async getCurrentUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async getAllUsers(pageNumber: number, pageSize: number) {
    return await this.prisma.user.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
  }

  //pagination example
  async getAllUsersForPagination(page: number, limit: number) {
    const currentPage = page;
    const pageSize = limit;
    const [users, totalUsers] = await Promise.all([
      this.prisma.user.findMany({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage,
      limit: pageSize,
    };
  }

  async updateUser(id: string, { name, password }: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.name = name ?? user.name;

    const salt = await bcrypt.genSalt(10);
    user.password = password
      ? await bcrypt.hash(password, salt)
      : user.password;
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return updatedUser;
  }

  async deleteUser(id: string, payload: JwtPayloadType) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.role === UserRole.ADMIN || user.id === payload.id) {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'user deleted successfully' };
    } else {
      throw new BadRequestException('you are not allowed to delete this user');
    }
  }

  async uploadProfileImage(userID: string, profileImage: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userID } });
    if (!user) throw new NotFoundException('user not found');
    if (user.profileImage) {
      await this.removeProfileImage(userID);
      return this.prisma.user.update({
        where: { id: userID },
        data: { profileImage: profileImage },
        omit: { password: true },
      });
    } else {
      return this.prisma.user.update({
        where: { id: userID },
        data: { profileImage: profileImage },
        omit: { password: true },
      });
    }
  }

  async removeProfileImage(userID: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userID } });
    if (!user) throw new NotFoundException('user not found');
    if (!user.profileImage)
      throw new BadRequestException('user does not have profile image');

    const imagePath = join(
      process.cwd(),
      `./images/profile/${user.profileImage}`,
    );
    unlinkSync(imagePath);

    return this.prisma.user.update({
      where: { id: userID },
      data: { profileImage: null },
      omit: { password: true },
    });
  }

  private generateAccessToken = async (
    payLoad: JwtPayloadType,
  ): Promise<string> => {
    const accessToken = await this.jwtService.signAsync(payLoad);
    return accessToken;
  };
}
