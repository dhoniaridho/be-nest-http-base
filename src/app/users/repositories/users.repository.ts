import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<
  Prisma.UsersWhereInput,
  Prisma.UsersSelect & Prisma.UsersCountOutputTypeSelect,
  Prisma.UsersOrderByWithRelationInput,
  Prisma.UsersInclude,
  Prisma.UsersCreateInput
> {
  constructor() {
    super('users');
  }
}
