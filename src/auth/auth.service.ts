import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { HotelsService } from '@/hotels/hotels.service';
import { BranchService } from '@/branch/branch.service';
import { DatabaseService } from '@/common/database/database.service';
import { transformUserResponse } from '@/common/helpers/utils';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private database: DatabaseService,
    private usersService: UsersService,
    private hotelService: HotelsService,
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
      accessToken: this.jwtService.sign({
        id: payload.id,
        branches: payload.branches.map((userBranch: any) => {
          return {
            id: userBranch.branch.id,
            role: userBranch.role
          };
        })
      })
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.database.$transaction(async (tx) => {
      const hotel = await this.hotelService.create(registerDto.hotel, tx);
      const branch = await this.branchService.create({ ...registerDto.branch, hotelId: hotel.id }, tx);
      const user = await this.usersService.create(
        {
          ...registerDto.user,
          branchId: branch.id,
          role: UserRole.admin,
          isOwner: true
        },
        tx
      );

      return {
        hotel,
        branch,
        user: { ...user, password: undefined }
      };
    });
  }
}
