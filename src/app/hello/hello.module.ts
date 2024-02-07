import { Module } from '@nestjs/common';
import { HelloController } from './controllers';
import { HelloService } from './services';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
