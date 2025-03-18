import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DatabaseModule, UsersModule, HotelsModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    JwtStrategy
  ]
})
export class AppModule {}
