import { BadRequestException, Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UserServices } from "./user.services.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
            storage: diskStorage({
              destination: './images/profile',
              filename: (req, file, cb) => {
                const uniqueSuffix =
                  Date.now() + '-' + Math.round(Math.random() * 1e9);
                const originalName = file.originalname;
                const extension = originalName.substring(
                  originalName.lastIndexOf('.'),
                );
                const newFileName = `${uniqueSuffix}${extension}`;
                cb(null, newFileName);
              },
            }),
            fileFilter: (req, file, cb) => {
              const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
              if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
              } else {
                cb(new BadRequestException('Invalid file type'), false);
              }
            },
            limits: {
              fileSize: 2 * 1024 * 1024, // 2MB
            },
          }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  exports: [UserServices],
  controllers: [UsersController],
  providers: [UserServices],
})
export class UsersModule {}