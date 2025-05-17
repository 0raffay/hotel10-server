import { IsString, IsNotEmpty, IsInt, Min, IsNumber } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Room type name is required' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Hotel Id is required' })
  hotelId: number;

  @IsInt()
  @Min(0, { message: 'Price must be a non-negative integer' })
  price: number;
}
