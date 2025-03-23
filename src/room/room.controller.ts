import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ICrudController } from '@/common/types';
import { Room } from '@prisma/client';

@Controller('rooms')
export class RoomController implements ICrudController<Room, CreateRoomDto, UpdateRoomDto> {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() creatRoomDto: CreateRoomDto, @Req() req: any) {
    return this.roomService.create(creatRoomDto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.roomService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.roomService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, @Req() req: any) {
    return this.roomService.update(+id, updateRoomDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.roomService.remove(+id, req.user);
  }
}
