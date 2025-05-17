import { Module } from '@nestjs/common';
import { RoomFloorService } from './room-floor.service';
import { RoomFloorController } from './room-floor.controller';

@Module({
  controllers: [RoomFloorController],
  providers: [RoomFloorService],
})
export class RoomFloorModule {}
