import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MainModule } from './main.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
