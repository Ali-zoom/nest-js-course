import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe with whitelist and forbidNonWhitelisted options
  // this will apply for all request in the application controllers
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  //applay helmet middleware to enhance security by setting various HTTP headers
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
