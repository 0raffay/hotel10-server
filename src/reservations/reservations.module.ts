import { GuestsService } from '@/guests/guests.service';
import { forwardRef, Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PaymentService } from '@/payment/payment.service';
import { BranchService } from '@/branch/branch.service';
import { RoomHistoryService } from '@/room-history/room-history.service';
import { ReservationFinanceService } from './reservation-finance.service';
import { RoomModule } from '@/room/room.module';

@Module({
  imports: [forwardRef(() => RoomModule)],
  exports: [ReservationsService],
  controllers: [ReservationsController],
  providers: [ReservationsService, GuestsService, PaymentService, BranchService, RoomHistoryService, ReservationFinanceService],
})
export class ReservationsModule {}
