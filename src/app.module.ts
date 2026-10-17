import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './products/product.module.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module.js';

@Module({
  imports: [
        ConfigModule.forRoot({ isGlobal: true }), // loads .env, must come first

    ProductModule,UsersModule,PrismaModule,UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
