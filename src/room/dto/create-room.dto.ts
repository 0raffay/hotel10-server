import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsNumber()
  @IsNotEmpty()
  floorId: number;

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

  @IsEnum(RoomStatus)
  @IsOptional()
  status: RoomStatus;
}
