import { CreateUserDto } from '@/users/dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class AuthCreateUserDto extends OmitType(CreateUserDto, ['branches']) {}
