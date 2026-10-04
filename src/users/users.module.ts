import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UserServices } from "./user.services.js";

@Module({
  imports: [PrismaModule],
  exports:[],
  controllers: [UsersController],
  providers: [UserServices],
})
export class UsersModule {

}