import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsNumber()
  @IsNotEmpty()
  roomTypeId: number;

  @IsString()
  @IsNotEmpty()
  bedType: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsOptional()
  description?: string;
}
