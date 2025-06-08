import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { BranchService } from '@/branch/branch.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { userInclude } from '@/common/helpers/prisma.queries';

@Injectable()
export class UsersService {
  constructor(
    private database: DatabaseService,
    private branchService: BranchService
  ) {}

  async create(createUserDto: CreateUserDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;

    const { branches, password, ...createUserPayload } = createUserDto;
    const existingUser = await this.checkIfUserExist(createUserDto);
    if (existingUser) throw new BadRequestException('User with same email or cnic already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { ...createUserPayload, password: hashedPassword }
    });

    if (branches && branches.length > 0) {
      await Promise.all(
        branches.map(async ({ branchId, role }) => {
          return db.userBranch.create({
            data: {
              userId: user.id,
              branchId,
              role
            }
          });
        })
      );
    }

    return user;
  }

  async findAll() {
    const users = await this.database.user.findMany({
      omit: {
        password: true
      },
      include: userInclude
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.database.user.findFirst({
      where: { id },
      omit: {
        password: true
      },
      include: userInclude
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { branches, ...updateUserPayload } = updateUserDto;

    // Remove old assignments
    await this.database.userBranch.deleteMany({
      where: {
        userId: id
      }
    });

    // Re-insert new ones
    if (branches?.length) {
      await this.database.userBranch.createMany({
        data: branches.map((branch) => ({
          userId: id,
          branchId: branch.branchId,
          role: branch.role
        }))
      });
    }

    return await this.database.user.update({
      where: { id },
      data: updateUserPayload
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

  async checkIfUserExist(user: CreateUserDto) {
    return await this.database.user.findFirst({
      where: {
        OR: [{ email: user.email }, { cnic: user.cnic }]
      }
    });
  }
}
