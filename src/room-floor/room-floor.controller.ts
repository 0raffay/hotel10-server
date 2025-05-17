import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, Query } from '@nestjs/common';
import { RoomFloorService } from './room-floor.service';
import { CreateRoomFloorDto } from './dto/create-room-floor.dto';
import { UpdateRoomFloorDto } from './dto/update-room-floor.dto';
import { Request } from 'express';

@Controller('room-floor')
export class RoomFloorController {
  constructor(private readonly roomFloorService: RoomFloorService) {}

  @Post()
  create(@Body() createRoomFloorDto: CreateRoomFloorDto) {
    return this.roomFloorService.create(createRoomFloorDto);
  }

  @Get()
  findAll(@Query('branchId') branchId: string) {
    if (!branchId) {
      throw new BadRequestException('Branch id is required');
    }

    return this.roomFloorService.findAll(+branchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomFloorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomFloorDto: UpdateRoomFloorDto) {
    return this.roomFloorService.update(+id, updateRoomFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomFloorService.remove(+id);
  }
}
