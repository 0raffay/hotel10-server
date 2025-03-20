import { DatabaseService } from '@/common/database/database.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OwnerService {
  constructor(private readonly database: DatabaseService) {}

  async checkIfOwnerExists(owner: CreateOwnerDto) {
    const existingOwner = await this.database.hotelOwner.findFirst({
      where: {
        hotelId: owner.hotelId,
        OR: [
          { email: owner.email },
          { cnic: owner.cnic }
        ]
      }
    });
    
    if (existingOwner) {
      throw new ConflictException('Owner with this email or CNIC already exists.');
    }
  }

  async create(createOwnerDto: CreateOwnerDto[], tx?: Prisma.TransactionClient) {
      const db = tx || this.database;
    return await Promise.all(
      createOwnerDto.map(async owner => {
        await this.checkIfOwnerExists(owner);
        return db.hotelOwner.create({ data: owner });
      })
    );
  }
}
