import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DatabaseService } from '@/common/database/database.service';
import { ReservationsService } from '@/reservations/reservations.service';
import { ResourcesService } from '@/resources/resources.service';
import { PaymentType } from '@prisma/client';

@Injectable()
export class DamagesService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private database: DatabaseService,
    private reservationService: ReservationsService,
  ) {}

  async create(createDamageDto: CreateDamageDto) {
    const { roomResourceId, reservationResourceId, chargeDetails } = createDamageDto;
    if (roomResourceId && reservationResourceId) throw new BadRequestException('Damage cannot be assigned to both room resource & reservation resource');
    if (reservationResourceId && !roomResourceId) {
      const reservationResource = await this.database.reservationResource.findFirst({ where: { id: reservationResourceId }, include: {
        resource: true
      } });

      if (!reservationResource) throw new NotFoundException(`Record not found for provided reservation resource id: ${reservationResourceId}`);

      this.reservationService.createReservationPayment({
        type: PaymentType.damage_charges,
        amount: reservationResource?.resource.defaultCharge || 0,
        description: chargeDetails.description,
        additionalCharges: chargeDetails.additionalCharges,
        reservationId: reservationResource!.reservationId,
        tax: 0
      })
    }
    if (roomResourceId && reservationResourceId) {
      const roomResource = await this.database.roomResource.findFirst({ where: { id: roomResourceId } });
      if (!roomResource) throw new NotFoundException(`Record not found for provided room resource id`);
    }

    return await this.database.damage.create({
      data: {
        damagedQuantity: createDamageDto.damagedQuantity,
        status:'pending',
        notes: createDamageDto.notes,
        reservationResourceId,
        roomResourceId,
        reportedBy: this.request.user!.id
      }
    });
  }

  async findAll() {
    return await this.database.damage.findMany({
      where: {
        OR: [
          {
            reservationResource: {
              reservation: {
                branchId: this.request.user?.branchId
              }
            }
          },
          {
            roomResource: {
              room: {
                branchId: this.request.user?.branchId
              }
            }
          }
        ]
      }
    });
  }

  async findOne(id: number) {
    const damage = await this.database.damage.findFirst({
      where: {
        id: id,
        OR: [
          {
            reservationResource: {
              reservation: {
                branchId: this.request.user?.branchId
              }
            }
          },
          {
            roomResource: {
              room: {
                branchId: this.request.user?.branchId
              }
            }
          }
        ]
      }
    });

    if (!damage) {
      throw new NotFoundException(`Damage report with id ${id} does not exist or is not accessible`);
    }

    return damage;
  }

  async update(id: number, updateDamageDto: UpdateDamageDto) {
    await this.findOne(id);
    return await this.database.damage.update({
      where: {
        id
      },
      data: updateDamageDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.database.damage.delete({
      where: {
        id
      }
    });
  }
}
