import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { RoomModule } from '@/room/room.module';
import { ReservationsModule } from '@/reservations/reservations.module';

@Module({
  imports: [RoomModule, ReservationsModule],
  providers: [ResourcesService],
  controllers: [ResourcesController]
})
export class ResourcesModule {}
