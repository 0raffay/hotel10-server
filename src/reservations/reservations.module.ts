import { GuestsService } from '@/guests/guests.service';
import { RoomService } from '@/room/room.service';
import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  exports: [ReservationsService],
  controllers: [ReservationsController],
  providers: [ReservationsService, RoomService, GuestsService],
})
export class ReservationsModule {}
