import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/platform/database/services/prisma.service';

@Injectable()
export class HelloRepository {
  constructor(private readonly prismaService: PrismaService) {}
  paginate() {
    return this.prismaService.users.findMany();
  }
}
