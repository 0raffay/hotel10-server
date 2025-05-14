import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { HotelsModule } from '@/hotels/hotels.module';
import { BranchModule } from '@/branch/branch.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    HotelsModule,
    BranchModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
