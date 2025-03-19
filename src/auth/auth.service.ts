import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { HotelsService } from '@/hotels/hotels.service';
import { OwnerService } from '@/owner/owner.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly hotelService: HotelsService, private readonly ownerService: OwnerService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: any) {
    const { password, ...payload } = user;
    return {
      ...payload,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const hotel = await this.hotelService.create(registerDto.hotel);
    const owner = await this.ownerService.create(registerDto.owners.map(owner => {
      return {
        ...owner, hotelId: hotel.id
      }
    }))
//     const existingUser = await this.usersService.findUserByEmail(user.email);
//     if (existingUser) {
//       throw new BadRequestException('email already exists');
//     }
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     return this.login({});
    return {
      hotel,
      owner
    }
  }
}
