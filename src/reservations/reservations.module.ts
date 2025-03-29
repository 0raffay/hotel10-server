import { GuestsService } from '@/guests/guests.service';
import { RoomService } from '@/room/room.service';
import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PaymentService } from '@/payment/payment.service';
import { BranchService } from '@/branch/branch.service';

@Module({
  exports: [ReservationsService],
  controllers: [ReservationsController],
  providers: [ReservationsService, RoomService, GuestsService, PaymentService, BranchService],
})
export class ReservationsModule {}
