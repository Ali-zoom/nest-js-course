import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UserServices } from "./user.services.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [PrismaModule,
    JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>({
      global:true,
      secret:configService.get<string>('JWT_SECRET'),
      signOptions:{expiresIn:configService.get<string>("JWT_EXPIRES_IN") as any} 
    })
  })],
  exports:[UserServices],
  controllers: [UsersController],
  providers: [UserServices],
})
export class UsersModule {

}