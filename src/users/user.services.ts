import { BadRequestException, Get, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserDto } from "./DTO/createUser.dto.js";
import bcrypt from "bcryptjs";
import { LoginUserDto } from "./DTO/loginUser.dto.js";

@Injectable()
export class UserServices{

    constructor(private readonly prisma: PrismaService){}

    async registerUser({name,email,password}:CreateUserDto){
        const checkUserExist=await this.prisma.user.findUnique({where:{email}});
        if(checkUserExist){
            return  new BadRequestException("check username or password")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasswored=await bcrypt.hash(password, salt);
        const newUser=await this.prisma.user.create({
            data:{name,email,password:hashedPasswored}
        })
        return newUser
    }

     async loginUser({email,password}:LoginUserDto){
        const user=await this.prisma.user.findUnique({where:{email}});
        if(!user){
            return  new BadRequestException("check username or password")
        }

        const plainPassword =await bcrypt.compare(password, user.password); // true
  if(!plainPassword){
            return  new BadRequestException("check username or password")
        }


        
     
        return user
    }
}