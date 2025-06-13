import { DatabaseService } from '@/common/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ContextService } from '@/common/context/context.service';
import { reservationInclude } from '@/common/helpers/prisma.queries';

@Injectable()
export class GuestsService {
  constructor(
    private database: DatabaseService,
    private context: ContextService
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    return await this.database.guest.create({
      data: createGuestDto
    });
  }
  async findAll({ branchId }: { branchId?: number } = {}) {
    const branches = this.context.getUserBranches();

    const branchFilter = branchId ? [branchId] : branches;

    return await this.database.guest.findMany({
      include: {
        reservations: {
          where: {
            branchId: {
              in: branchFilter
            }
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.guest.findFirst({
      where: {
        id
      },
      include: {
        reservations: {
          include: reservationInclude
        }
      }
    });
    if (!record) throw new NotFoundException(`Guest with id ${id} not found`);
    return record;
  }

  async update(id: number, updateGuestDto: UpdateGuestDto) {
    await this.findOne(id);
    return await this.database.guest.update({
      where: {
        id
      },
      data: updateGuestDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.database.guest.delete({
      where: {
        id
      }
    });
  }
}
