import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  exports: [RoomService],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
