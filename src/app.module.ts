import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './products/product.module.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './middlewares/logger.middleware.js';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env, must come first

    ProductModule,
    UsersModule,
    PrismaModule,
    UploadsModule,
    ThrottlerModule.forRoot([// this for throttler
      {
        name:"short",
        ttl: 4000, // 4 seconds
        limit: 3, // 3 request every 4 seconds for each IP address (client)
      },
      {
        name:"meduim",
        ttl: 10000, // 10 seconds
        limit: 5, // 3 request every 10 seconds for each IP address (client)
      },
       {
        name:"long",
        ttl: 60000, // 1 minutes
        limit: 15, // 15 request every 1 minutes for each IP address (client)
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {//nest module this for middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes(
      {
        path:"api/products",// or for all routes "*"
        method:RequestMethod.GET // or for all methods "ALL"
      }
    )

    consumer
    .apply(LoggerMiddleware)
    .forRoutes(
      {
        path:"api/users",// or for all routes "*"
        method:RequestMethod.GET // or for all methods "ALL"
      },
       {
        path:"api/reviews",// or for all routes "*"
        method:RequestMethod.ALL // or for all methods "ALL"
      }
    )
  }


}
