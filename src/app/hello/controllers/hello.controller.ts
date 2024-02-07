import { Controller, Get } from '@nestjs/common';
import { HelloService } from '../services';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): string {
    return this.helloService.getHello();
  }

  @Get('paginate')
  paginate() {
    return this.helloService.paginate();
  }
}
