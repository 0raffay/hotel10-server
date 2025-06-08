import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() creatRoomDto: CreateRoomDto, ) {
    return this.roomService.create(creatRoomDto);
  }

  @Get()
  findAll(@Query('branchId') branchId?: string) {
    return this.roomService.findAll({ branchId: branchId ? Number(branchId) : undefined });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, ) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, ) {
    return this.roomService.remove(+id);
  }
}
