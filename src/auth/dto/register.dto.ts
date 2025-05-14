import { CreateBranchDto } from '@/branch/dto/create-branch.dto';
import { CreateHotelDto } from '@/hotels/dto/create-hotel.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AuthCreateUserDto } from './auth-create-user.dto';

export class RegisterDto {
  @ValidateNested()
  @Type(() => CreateHotelDto)
  hotel: CreateHotelDto;

  @ValidateNested()
  @Type(() => CreateBranchDto)
  branch: CreateBranchDto;

  @ValidateNested()
  @Type(() => AuthCreateUserDto)
  user: AuthCreateUserDto;
}
