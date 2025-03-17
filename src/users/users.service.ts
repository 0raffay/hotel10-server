import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.database.user.create({
      data: {...createUserDto, password: hashedPassword}
    });
  }

  async findAll() {
    return await this.database.user.findMany();
  }

  async findOne(id: number) {
    return await this.database.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return await this.database.user.update({
      where: { id },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return await this.database.user.delete({
      where: { id },
    });
  }
}
