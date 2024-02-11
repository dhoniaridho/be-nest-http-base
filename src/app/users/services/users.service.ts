import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.usersRepository
      .select({
        id: true,
        email: true,
        posts: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      })
      .paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.usersRepository
        .where({
          id,
        })
        .select({
          id: true,
          email: true,
          posts: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        })
        .firstOrThrow();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.usersRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createUserDto: CreateUserDto) {
    try {
      return this.usersRepository.create({
        email: createUserDto.email,
        name: createUserDto.name,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, createUserDto: CreateUserDto) {
    try {
      return this.usersRepository.update(id, {
        email: createUserDto.email,
        name: createUserDto.name,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
