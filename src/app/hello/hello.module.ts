import { Module } from '@nestjs/common';
import { HelloController } from './controllers';
import { HelloService } from './services';
import { HelloRepository } from './repositories';

@Module({
  controllers: [HelloController],
  providers: [HelloService, HelloRepository],
})
export class HelloModule {}
