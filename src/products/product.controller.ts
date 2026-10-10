import { Controller, Get } from "@nestjs/common";

@Controller()
export class ProductController{

    

    @Get("/api/products")
    getProducts(){
        return "This action returns all products";
    }
}