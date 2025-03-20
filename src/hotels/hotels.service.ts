import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private readonly database: DatabaseService) {}

  async create(createHotelDto: CreateHotelDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;
    return await db.hotel.create({
      data: createHotelDto
    });;
  }

  async findAll() {
    return await this.database.hotel.findMany();
  }

  async findOne(id: number) {
    return await this.database.hotel.findUnique({
      where: { id },
      include: { branches: true, owners: true }
    });
  }
  async update(id: number, updateHotelDto: Prisma.HotelUpdateInput) {
    return await this.database.hotel.update({
      where: { id },
      data: updateHotelDto
    });
  }

  async remove(id: number) {
    return await this.database.hotel.delete({
      where: { id }
    });
  }
}
