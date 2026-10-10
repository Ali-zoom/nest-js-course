import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadType } from '../../utils/types.js';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../utils/enums.js';
import { UserServices } from '../user.services.js';
@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector:Reflector,
        private readonly userService: UserServices,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
const roles:UserRole[]=this.reflector.getAllAndOverride('roles',[context.getHandler(),context.getClass()])// roles key from user-role.decorator
console.log("roles===",roles)
if(!roles || roles.length===0) return false
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        const payload: JwtPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET'),
          },
        );


        const user=await this.userService.getCurrentUser(payload.id)
        if (!user) return false
        if(roles.includes(user.role as UserRole)){
            request['user'] = payload;
            return true
        }

        
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Invalid token,no token provided');
    }
    return false;
  }
}
