import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { HotelsService } from '@/hotels/hotels.service';
import { OwnerService } from '@/owner/owner.service';
import { BranchService } from '@/branch/branch.service';
import { DatabaseService } from '@/common/database/database.service';
import { transformUserResponse } from '@/common/helpers/utils';
import { Role } from '@/common/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private database: DatabaseService,
    private usersService: UsersService,
    private hotelService: HotelsService,
    private ownerService: OwnerService,
    private branchService: BranchService
  ) {}

  async validateUser(email: string, password: string): Promise<Record<string, unknown>> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return transformUserResponse(user);
  }

  async login(user: any) {
    const { password, ...payload } = user;
    return {
      ...payload,
      accessToken: this.jwtService.sign({ id: payload.id, email: payload.email, role: payload.role })
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.database.$transaction(async (tx) => {
      const hotel = await this.hotelService.create(registerDto.hotel, tx);
      const owners = await this.ownerService.create(
        registerDto.owners.map((owner) => ({
          ...owner,
          hotelId: hotel.id
        })),
        tx
      );
      const branch = await this.branchService.create({ ...registerDto.branch, hotelId: hotel.id, email: hotel.email }, tx);
      const user = await this.usersService.create({ ...registerDto.user, username: `${hotel.name}`, branchId: branch.id, email: hotel.email, phone: hotel.phone, role: Role.ADMIN }, tx);

      return {
        hotel,
        owners,
        branch,
        user: { ...user, password: undefined }
      };
    });
  }
}
