import { CreateBranchDto } from "@/branch/dto/create-branch.dto";
import { CreateHotelDto } from "@/hotels/dto/create-hotel.dto";
import { CreateOwnerDto } from "@/owner/dto/create-owner.dto";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, ValidateNested } from "class-validator";

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
  @Type(() => CreateUserDto)
  user: CreateUserDto
}