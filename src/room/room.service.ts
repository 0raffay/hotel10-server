import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DatabaseService } from '@/common/database/database.service';
import { BaseService } from '@/common/base/BaseService';

@Injectable()
export class RoomService extends BaseService<any, CreateRoomDto, UpdateRoomDto> {
  constructor(private database: DatabaseService) {
    super(database.room);
  }

  async create(data: CreateRoomDto): Promise<any> {
    const existingRoom = await this.getRoomByNumber(data.roomNumber, data.branchId);
    if (existingRoom) throw new NotFoundException('Room number already exists');
    return super.create(data);
  }

  async getRoomByNumber(roomNumber: string, branchId: number) {
    return await this.database.room.findFirst({
      where: {
        branchId: branchId,
        roomNumber: roomNumber
      }
    })
  }
}
