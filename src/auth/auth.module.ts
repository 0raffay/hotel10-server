import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { HotelsModule } from '@/hotels/hotels.module';
import { OwnerModule } from '@/owner/owner.module';
import { BranchModule } from '@/branch/branch.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    HotelsModule,
    OwnerModule,
    BranchModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
