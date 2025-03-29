import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DatabaseService } from '@/common/database/database.service';
import { ICrudService } from '@/common/types';
import { Room } from '@prisma/client';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable()
export class RoomService implements ICrudService<Room, CreateRoomDto, UpdateRoomDto> {
  constructor(
    @Inject(REQUEST) private request: Request,
    private database: DatabaseService
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const existingRoom = await this.findRoomByNumber(createRoomDto.roomNumber, createRoomDto.branchId);
    if (existingRoom) throw new BadRequestException('Room with this number already exists');
    matchUserBranchWithEntity(this.request.user, createRoomDto.branchId);
    return await this.database.room.create({ data: createRoomDto });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    return await this.database.room.update({
      where: {
        id
      },
      data: updateRoomDto
    });
  }

  async findAll() {
    return await this.database.room.findMany({
      where: {
        branchId: this.request.user?.branchId
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.room.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Room with id ${id} not found`);
    matchUserBranchWithEntity(this.request.user, record.branchId);
    return record;
  }

  async remove(id: number) {
    await this.findOne(id);
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
