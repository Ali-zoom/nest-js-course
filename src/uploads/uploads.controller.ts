import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';

@Controller('api/uploads')
export class UploadsController {
  //upload file
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');
    console.log('File uploaded ', { file });
    return {
      message: 'File uploaded successfully',
      fileName: file.originalname,
    };
  }

  //upload multiple files

  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0)
      throw new BadRequestException('Files not found');
    console.log('Files uploaded ', { files });
    return {
      message: 'Files uploaded successfully',
      fileNames: files.map((file) => file.originalname),
    };
  }

  //get uploaded file
  @Get(':filename')
  getUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'images' });
  }
}
