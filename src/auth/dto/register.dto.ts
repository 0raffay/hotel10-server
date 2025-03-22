import { CreateBranchDto } from '@/branch/dto/create-branch.dto';
import { CreateHotelDto } from '@/hotels/dto/create-hotel.dto';
import { CreateOwnerDto } from '@/owner/dto/create-owner.dto';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { AuthCreateUserDto } from './auth-create-user.dto';

export class RegisterDto {
  @ValidateNested()
  @Type(() => CreateHotelDto)
  hotel: CreateHotelDto;

  @ValidateNested()
  @Type(() => CreateBranchDto)
  branch: CreateBranchDto;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(2)
  @Type(() => CreateOwnerDto)
  owners: CreateOwnerDto[];

  @ValidateNested()
  @Type(() => AuthCreateUserDto)
  user: AuthCreateUserDto;
}
