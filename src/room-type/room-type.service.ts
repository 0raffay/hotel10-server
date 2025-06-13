import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/common/database/database.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { ContextService } from '@/common/context/context.service';

@Injectable()
export class RoomTypeService {
  constructor(private readonly database: DatabaseService, private readonly context: ContextService) {}

  async create(createRoomTypeDto: CreateRoomTypeDto) {
   const existing = await this.database.roomType.findFirst({
      where: {
        hotelId: this.context.getAuthUser().hotelId,
        name: createRoomTypeDto.name,
      }
    })

    if (existing) throw new BadRequestException("Room type already exists");

    return this.database.roomType.create({
      data: createRoomTypeDto,
    });
  }

  async findAll() {
    const id = this.context.getAuthUser();
    const data = await this.database.roomType.findMany({
      where: {
        hotelId: id.hotelId
      }
    })
    return data;
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
