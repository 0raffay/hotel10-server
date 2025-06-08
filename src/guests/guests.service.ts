import { DatabaseService } from '@/common/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ContextService } from '@/common/context/context.service';

@Injectable()
export class GuestsService {
  constructor(private database: DatabaseService, private context: ContextService) {}

  async create(createGuestDto: CreateGuestDto) {
    return await this.database.guest.create({
      data: createGuestDto
    });
  }

  async findAll({ branchId }: { branchId?: number } = {}) {
    const branches = this.context.getUserBranches();
    return await this.database.guest.findMany({
      include: {
        reservations: {
          where: {
            branchId: {
              in: branchId ? [branchId] : branches
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
          include: {
            payments: true,
            branch: true,
            room: {
              include: {
                roomType: true,
                floor: true
              }
            },
            reservationResource: {
              include: {
                resource: true
              }
            },
            guest: {
              include: {
                reservations: true
              }
            }
          },
          where: {
            branchId: {
              in: this.context.getUserBranches()
            }
          }
        }
      }
    })
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
