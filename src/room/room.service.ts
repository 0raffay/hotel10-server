import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DatabaseService } from '@/common/database/database.service';
import { ICrudService } from '@/common/types';
import { Room } from '@prisma/client';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
@Injectable()
export class RoomService implements ICrudService<Room, CreateRoomDto, UpdateRoomDto> {
  constructor(private database: DatabaseService) {}

  async create(createRoomDto: CreateRoomDto, user: any) {
    const existingRoom = await this.findRoomByNumber(createRoomDto.roomNumber, createRoomDto.branchId);
    if (existingRoom) throw new BadRequestException('Room with this number already exists');
    matchUserBranchWithEntity(user, createRoomDto.branchId);
    return await this.database.room.create({ data: createRoomDto });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto, user: any) {
    await this.findOne(id, user);
    return this.database.room.update({
      where: {
        id
      },
      data: updateRoomDto
    });
  }

  async findAll(user: any) {
    return await this.database.room.findMany({
      where: {
        branchId: user.branchId
      }
    });
  }

  async findOne(id: number, user: any) {
    const record = await this.database.room.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Room with id ${id} not found`);
    matchUserBranchWithEntity(user, record.branchId);
    return record;
  }

  async remove(id: number, user: any) {
    await this.findOne(id, user);
    return await this.database.room.delete({
      where: {
        id
      }
    });
  }

  async findRoomByNumber(roomNumber: string, branchId: number): Promise<Room | null> {
    return await this.database.room.findFirst({
      where: {
        roomNumber,
        branchId
      }
    });
  }
}
