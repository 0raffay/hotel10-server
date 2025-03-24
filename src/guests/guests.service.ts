import { DatabaseService } from '@/common/database/database.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(@Inject(REQUEST) private request: Request, private database: DatabaseService) {}

  async create(createGuestDto: CreateGuestDto) {
    return await this.database.guest.create({
      data: createGuestDto
    });
  }

  async findAll() {
    return await this.database.guest.findMany({
      include: {
        reservations: {
          where: {
            branchId: this.request.user?.branchId
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.guest.findFirst({
      where: {
        id
      },
      include: {
        reservations: {
          where: {
            branchId: this.request.user?.branchId
          }
        }
      }
    })
    if (!record) throw new NotFoundException(`Record with id ${id} not found`);
    return record;
  }

  async update(id: number, updateGuestDto: UpdateGuestDto) {
    await this.findOne(id);
    return await this.database.guest.update({
      where: {
        id
      },
      data: updateGuestDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.database.guest.delete({
      where: {
        id
      }
    });
  }
}
