import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { RoomStatus } from "@prisma/client";

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsString()
  @IsNotEmpty()
  roomType: string;

  @IsString()
  @IsNotEmpty()
  bedType: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  price: number;

  @IsEnum(RoomStatus)
  status: RoomStatus;

  @IsString()
  @IsOptional()
  description: string;
}
