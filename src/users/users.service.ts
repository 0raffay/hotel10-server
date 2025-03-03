import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data:  {...createUserDto, password: hashedPassword},
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;
    const updatedData = password
      ? { ...userData, password: await bcrypt.hash(password, 10) }
      : userData;
    return await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
