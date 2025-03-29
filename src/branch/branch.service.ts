import { DatabaseService } from '@/common/database/database.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch, Prisma } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private readonly database: DatabaseService) {}

  async create(createBranchDto: CreateBranchDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;
    const branchExists = await this.checkIfBranchExists(createBranchDto.email, createBranchDto.hotelId);
    if (branchExists) throw new BadRequestException('Branch with same email already exists.');
    return await db.branch.create({
      data: createBranchDto
    });
  }

  async findOne(id: number): Promise<Branch | null> {
    const branch = await this.database.branch.findFirst({
      where: {
        id: id
      }
    });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  async checkIfBranchExists(email: string, hotelId: number) {
    return await this.database.branch.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        hotelId: hotelId
      }
    });
  }
}
