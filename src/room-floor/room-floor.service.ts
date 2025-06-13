import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomFloorDto } from './dto/create-room-floor.dto';
import { UpdateRoomFloorDto } from './dto/update-room-floor.dto';
import { DatabaseService } from '@/common/database/database.service';

@Injectable()
export class RoomFloorService {
  constructor(private database: DatabaseService) {}

  async create(createRoomFloorDto: CreateRoomFloorDto) {
    const existing = await this.database.roomFloor.findFirst({
      where: {
        name: createRoomFloorDto.name,
        branchId: createRoomFloorDto.branchId
      }
    });

    if (existing) throw new BadRequestException('Room floor already exists');
    return this.database.roomFloor.create({
      data: createRoomFloorDto
    });
  }

  async findAll(branchId: number) {
    return this.database.roomFloor.findMany({
      where: {
        branchId
      }
    });
  }

  async findOne(id: number) {
    return this.database.roomFloor.findUnique({
      where: { id },
      include: {
        branch: true,
        rooms: true
      }
    });
  }

  async update(id: number, updateRoomFloorDto: UpdateRoomFloorDto) {
    return this.database.roomFloor.update({
      where: { id },
      data: updateRoomFloorDto
    });
  }

  async remove(id: number) {
    return this.database.roomFloor.delete({
      where: { id }
    });
  }
}
