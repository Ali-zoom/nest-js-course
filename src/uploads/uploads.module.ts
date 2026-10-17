import { BadRequestException, Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller.js";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
    controllers: [UploadsController],
    providers: [],
    imports: [MulterModule.register({
      storage: diskStorage({
        destination: './images',
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
    })],
    exports: []
})
export class UploadsModule{}