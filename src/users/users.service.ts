import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { BranchService } from '@/branch/branch.service';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService, private branchService: BranchService) {}

  async create(createUserDto: CreateUserDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;

    const { branchId, role, password, ...createUserPayload } = createUserDto;
    if (!tx) await this.branchService.findOne(branchId);
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) throw new BadRequestException('User with same email already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { ...createUserPayload, password: hashedPassword }
    });

    await db.userBranch.create({
      data: {
        userId: user.id,
        branchId: branchId,
        role: role
      }
    })
    return user;
  }

  async findAll() {
    return await this.database.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.database.user.findFirst({
      where: { id },
      include: {
        branches: {
          include: {
            branch: {
              include: {
                hotel: true
              }
            }
          }
        }
      }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return user;
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

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.database.user.findFirst({
      where: {
        email: email
      },
      include: {
        branches: {
          include: {
            branch: {
              include: {
                hotel: true
              }
            }
          }
        }
      }
    });
  }
}
