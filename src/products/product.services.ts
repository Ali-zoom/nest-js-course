import { Get, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateProductrDto } from "./DTOs/create-product.dto.js";
import { UpdateProductrDto } from "./DTOs/update-product.dto.js";
import { Product } from "../generated/prisma/client.js";

@Injectable()
export class ProductsService{
    constructor(
        private readonly prisma:PrismaService
    ){

    }

    
     async getProducts(){
        const products=await this.prisma.product.findMany({include:{user:true,reviews:true}});
        return products;
    }

     
     async getProductsById(id: string){
        const products=await this.prisma.product.findUnique({where:{id},include:{user:true,reviews:true}});
        return products;
    }

    async createProduct(userId:string,data:CreateProductrDto){

        const product=this.prisma.product.create({
            data:{
                name:data.name,
                description:data.description??"",
                price:data.price,
                userId:userId
            }
        })

        return product;

    }

    async updateProduct(pdoductId:string,productData:UpdateProductrDto){

        const checkProduct=await this.prisma.product.findUnique({
            where:{id:pdoductId}
        })
        if(!checkProduct){
            throw new NotFoundException("product not found")
        }

        const updatedProduct=await this.prisma.product.update({
            where:{id:pdoductId},
            data:{
                name:productData.name??checkProduct.name,
                description:productData.description??checkProduct.description,
                price:productData.price ??checkProduct.price ,
            }
        })

        return updatedProduct;

    }




}