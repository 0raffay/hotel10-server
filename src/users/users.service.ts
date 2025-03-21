import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async create(createUserDto: CreateUserDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;

    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) throw new BadRequestException('User with same email already exists.');
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await db.user.create({
      data: { ...createUserDto, password: hashedPassword }
    });
  }

  async findAll() {
    return await this.database.user.findMany();
  }

  async findOne(id: number) {
    return await this.database.user.findUnique({
      where: { id },
      include: {
        branch: {
          include: {
            hotel: true
          }
        }
      }
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
      where: { id }
    });
  }

  async findUserByEmail(email: string) {
    return await this.database.user.findFirst({
      where: {
        email: email
      },
      include: {
        branch: {
          include: {
            hotel: true
          }
        }
      }
    });
  }
}
