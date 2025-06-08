import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;

  @ValidateIf((o) => o.nationality?.toLowerCase() === 'pakistani')
  @IsString({ message: "CNIC must be a string" })
  @IsNotEmpty({ message: "CNIC is required for Pakistani nationality" })
  cnic?: string;


  @ValidateIf((o) => o.nationality?.toLowerCase() !== 'pakistani')
  @IsString({ message: "Passport must be a string" })
  @IsNotEmpty({ message: "Passport is required" })
  passport: string;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Date of birth must be a valid date' })
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  ntn: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  nationality: string;
}
