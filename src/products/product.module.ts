import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { ProductsService } from "./product.services.js";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module.js";

@Module({
    imports: [PrismaModule,JwtModule,UsersModule],
    exports:[],
    controllers: [ProductController],
    providers: [ProductsService],
})
export class ProductModule {}