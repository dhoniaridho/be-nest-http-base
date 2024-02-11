import { Controller, Get, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Controller()
class AppController {
  constructor() {}

  @Get()
  getHello() {
    return {
      appVersion: 1,
    };
  }
}

@Module({
  imports: [UsersModule],
  controllers: [AppController],
})
export class AppModule {}
