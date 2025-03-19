import { DatabaseService } from '@/common/database/database.service';
import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';

@Injectable()
export class OwnerService {
  constructor(private readonly database: DatabaseService) {}

  async create(createOwnerDto: CreateOwnerDto[]) {
    return await Promise.all(createOwnerDto.map(owner => this.database.hotelOwner.create({
      data: owner
    })))
  }

}
