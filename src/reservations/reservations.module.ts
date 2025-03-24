import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { RoomService } from '@/room/room.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, RoomService],
})
export class ReservationsModule {}
