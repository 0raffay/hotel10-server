import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private readonly database: DatabaseService) {}

  async create(createHotelDto: CreateHotelDto, tx?: Prisma.TransactionClient) {
    const db = tx || this.database;
    const hotelExists = await this.findHotelByName(createHotelDto.name);
    if (hotelExists) throw new BadRequestException('Hotel with same name already exists.');
    return await db.hotel.create({
      data: createHotelDto
    });
  }

  async findAll() {
    return await this.database.hotel.findMany();
  }

  async findOne(id: number) {
    return await this.database.hotel.findUnique({
      where: { id },
      include: { branches: true }
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

  async findHotelByEmail(email: string) {
    return await this.database.hotel.findFirst({
      where: {
        email: email.trim().toLowerCase()
      }
    });
  }

  async findHotelByName(name: string) {
    return await this.database.hotel.findFirst({
      where: {
        name: name.trim().toLowerCase()
      }
    });
  }
}
