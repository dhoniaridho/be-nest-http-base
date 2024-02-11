import { Module } from '@nestjs/common';
import { usersController } from './controllers';
import { UsersService } from './services';
import { UsersRepository } from './repositories';

@Module({
  controllers: [usersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
