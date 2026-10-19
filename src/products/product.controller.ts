import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './product.services.js';
import { Roles } from '../users/decorator/user-role.decorator.js';
import { UserRole } from '../utils/enums.js';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard.js';
import { CurrentUser } from '../users/decorator/current-user.decorator.js';
import type { JwtPayloadType } from '../utils/types.js';
import { CreateProductrDto } from './DTOs/create-product.dto.js';
import { UpdateUserDto } from '../users/DTO/updateUser.dto.js';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('api/products/')
// @SkipThrottle()//this for skip throttle for this all apis in this controller
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @Get('')
  getProducts(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productService.getProducts(name, minPrice, maxPrice);
  }

  @Get(':id')
  // @SkipThrottle()//this for skip throttle for this api end point

  // @Throttle({default:{limit:5,ttl:10000}})// override the throttler and set it for specific api
//    @Throttle({"short":{limit:3,ttl:4000}})// override the throttler and set it for specific api
  @SkipThrottle({"short":true,"long":true,"meduim":false})
  getSingleProductById(@Param('id') id: string) {
    return this.productService.getProductsById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async createProduct(
    @CurrentUser() payload: JwtPayloadType,
    @Body() body: CreateProductrDto,
  ) {
    return this.productService.createProduct(payload.id, body);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async updateProduct(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.productService.updateProduct(id, body);
  }
}
