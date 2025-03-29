import { Module } from '@nestjs/common';
import { DamagesService } from './damages.service';
import { DamagesController } from './damages.controller';
import { ReservationsModule } from '@/reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [DamagesController],
  providers: [DamagesService],
})
export class DamagesModule {}
