import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DatabaseService } from '@/common/database/database.service';
import { Room, RoomStatus } from '@prisma/client';
import { ContextService } from '@/common/context/context.service';
import { PermissionsService } from '@/permission/permissions.service';

@Injectable()
export class RoomService {
  constructor(
    private database: DatabaseService,
    private context: ContextService,
    private permissionsService: PermissionsService
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const existingRoom = await this.findRoomByNumber(createRoomDto.roomNumber, createRoomDto.branchId);
    if (existingRoom) throw new BadRequestException('Room with this number already exists');
    this.permissionsService.verifyEntityOwnership(createRoomDto.branchId);

    const payload = {
      ...createRoomDto,
      status: RoomStatus.available
    }
    return await this.database.room.create({ data: payload });
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
      include: {
        branch: true,
        floor: true,
        reservations: true,
        roomResources: true,
        roomType: true
      },
      where: {
        branchId: {
          in: this.context.getUserBranches()
        }
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.room.findFirst({
      where: {
        id: id
      },
      include: {
        branch: true,
        floor: true,
        reservations: true,
        roomResources: true,
        roomType: true
      },
    });
    if (!record) throw new BadRequestException(`Room with id ${id} not found`);
    this.permissionsService.verifyEntityOwnership(record.branchId);
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
