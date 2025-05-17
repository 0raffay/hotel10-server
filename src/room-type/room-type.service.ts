import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(private readonly database: DatabaseService) {}

  async create(createRoomTypeDto: CreateRoomTypeDto) {
    return this.database.roomType.create({
      data: createRoomTypeDto,
    });
  }

  async findAll() {
    return this.database.roomType.findMany();
  }

  async findOne(id: number) {
    const roomType = await this.database.roomType.findUnique({
      where: { id },
    });

    if (!roomType) {
      throw new NotFoundException(`RoomType with ID ${id} not found`);
    }

    return roomType;
  }

  async update(id: number, updateRoomTypeDto: UpdateRoomTypeDto) {
    const exists = await this.database.roomType.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`RoomType with ID ${id} not found`);
    }

    return this.database.roomType.update({
      where: { id },
      data: updateRoomTypeDto,
    });
  }

  async remove(id: number) {
    const exists = await this.database.roomType.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`RoomType with ID ${id} not found`);
    }

    return this.database.roomType.delete({
      where: { id },
    });
  }
}
