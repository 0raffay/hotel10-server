import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BaseController } from '@/common/base/BaseController';

@Controller('rooms')
export class RoomController extends BaseController<Room, CreateRoomDto, UpdateRoomDto>(CreateRoomDto, UpdateRoomDto) {
  constructor(private readonly roomService: RoomService) {
    super(roomService);
  }
}
