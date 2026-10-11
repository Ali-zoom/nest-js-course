import { Controller, Get, Param, Post, UseGuards,Body, Put } from "@nestjs/common";
import { ProductsService } from "./product.services.js";
import { Roles } from "../users/decorator/user-role.decorator.js";
import { UserRole } from "../utils/enums.js";
import { AuthRolesGuard } from "../users/guards/auth-roles.guard.js";
import { CurrentUser } from "../users/decorator/current-user.decorator.js";
import type { JwtPayloadType } from "../utils/types.js";
import { CreateProductrDto } from "./DTOs/create-product.dto.js";
import { UpdateUserDto } from "../users/DTO/updateUser.dto.js";

@Controller("api/products/")
export class ProductController{
    constructor(
        private readonly productService:ProductsService
    ){

    }

    

    @Get("")
    getProducts(){
        return this.productService.getProducts()
    }

    @Get(":id")
    getSingleProductById(@Param("id") id:string){
        return this.productService.getProductsById(id)
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthRolesGuard)
    async createProduct(@CurrentUser() payload:JwtPayloadType,@Body() body:CreateProductrDto){
        return this.productService.createProduct(payload.id,body)
    }

     @Put(":id")
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthRolesGuard)
    async updateProduct(@Param("id") id:string,@Body() body:UpdateUserDto){
        return this.productService.updateProduct(id,body)
    }
}