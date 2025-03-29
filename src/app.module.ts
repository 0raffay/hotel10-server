import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { OwnerService } from './owner/owner.service';
import { OwnerModule } from './owner/owner.module';
import { BranchModule } from './branch/branch.module';
import { RoomModule } from './room/room.module';
import { ResourcesModule } from './resources/resources.module';
import { ReservationsModule } from './reservations/reservations.module';
import { GuestsModule } from './guests/guests.module';
import { DamagesModule } from './damages/damages.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DatabaseModule, UsersModule, HotelsModule, AuthModule, OwnerModule, BranchModule, RoomModule, ResourcesModule, ReservationsModule, GuestsModule, DamagesModule, PaymentModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    JwtStrategy
  ],
  exports: []
})
export class AppModule {}
