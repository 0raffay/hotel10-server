import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomStatus } from '@prisma/client';

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

  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;

  @IsString()
  @IsOptional()
  description?: string;
}
