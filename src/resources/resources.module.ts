import { forwardRef, Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { ReservationsModule } from '@/reservations/reservations.module';
import { RoomModule } from '@/room/room.module';

@Module({
  imports: [forwardRef(() => ReservationsModule), forwardRef(() => RoomModule)],
  providers: [ResourcesService],
  controllers: [ResourcesController],
  exports: [ResourcesService],
})
export class ResourcesModule {}
