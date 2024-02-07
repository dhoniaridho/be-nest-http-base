import { Injectable } from '@nestjs/common';
import { HelloRepository } from '../repositories';

@Injectable()
export class HelloService {
  constructor(private readonly helloRepository: HelloRepository) {}
  getHello() {
    return 'Hello, World!';
  }

  paginate() {
    return this.helloRepository.paginate();
  }
}
