import { DatabaseService } from '@/common/database/database.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, Prisma } from '@prisma/client';
import { reservationInclude, roomInclude, userInclude } from '@/common/helpers/prisma.queries';

@Injectable()
export class BranchService {
  constructor(private readonly database: DatabaseService) {}

  async create(createBranchDto: CreateBranchDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;
    if (createBranchDto.email) {
      const branchExists = await this.checkIfBranchExists(createBranchDto.email, createBranchDto.hotelId);
      if (branchExists) throw new BadRequestException('Branch with same email already exists.');
    }
    return await db.branch.create({
      data: createBranchDto
    });
  }

  async findAll(hotelId: string): Promise<Branch[]> {
    if (!hotelId) throw new BadRequestException("Please provide a hotelId to get all branches")
    return this.database.branch.findMany({
      include: {
        staff: true,
        rooms: true,
        reservations: true,
        resources: true,
        hotel: true
      },
      where: {
        hotelId: +hotelId
      }
    });
  }

  async findOne(id: number): Promise<Branch | null> {
    const branch = await this.database.branch.findFirst({
      where: { id },
      include: {
        reservations: {
          include: reservationInclude
        },
        rooms: {
          include: roomInclude,
        },
        resources: true,
        staff: {
          include: {
            user: {
              include: userInclude
            }
          }
        },
    }});

    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Branch with id ${id} not found`);

    return this.database.branch.update({
      where: { id },
      data: updateBranchDto
    });
  }

  async remove(id: number): Promise<Branch> {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Branch with id ${id} not found`);

    return this.database.branch.delete({
      where: { id }
    });
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
