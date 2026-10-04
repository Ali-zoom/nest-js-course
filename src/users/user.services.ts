import { Get, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class UserServices{

    constructor(private readonly prisma: PrismaService){}

    async getAll(){
        return await this.prisma.user.findMany();
    }
}