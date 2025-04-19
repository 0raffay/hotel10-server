import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { DatabaseService } from '@/common/database/database.service';
import { PaymentType } from '@prisma/client';
import { AssignResourceDto } from './dto/assign-resource.dto';
import { ReservationsService } from '@/reservations/reservations.service';
import { RoomService } from '@/room/room.service';
import { ContextService } from '@/common/context/context.service';
import { PermissionsService } from '@/permission/permissions.service';

@Injectable()
export class ResourcesService {
  constructor(
    private database: DatabaseService,
    private context: ContextService,
    private permissionsService: PermissionsService,
    private reservationService: ReservationsService,
    private roomService: RoomService
  ) {}

  async create(createResourceDto: CreateResourceDto) {
    this.permissionsService.verifyEntityOwnership(createResourceDto.branchId);
    return await this.database.resource.create({
      data: createResourceDto
    });
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    await this.findOne(id);
    return this.database.resource.update({
      where: {
        id
      },
      data: updateResourceDto
    });
  }

  async findAll() {
    return await this.database.resource.findMany({
      where: {
        branchId: {
          in: this.context.getUserBranches()
        }
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.resource.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Resource with id ${id} not found`);
    this.permissionsService.verifyEntityOwnership(record.branchId);
    return record;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.database.resource.delete({
      where: {
        id
      }
    });
  }

  async updateResourceQuantity(id: number, quantity: number) {
    return await this.update(id, {
      quantity
    });
  }

  async assignResource(assignResourceDto: AssignResourceDto) {
    const { resourceId, reservationId, roomId, quantity, chargeDetails } = assignResourceDto;

    const resource = await this.findOne(resourceId);
    if (resource.quantity < quantity) {
      throw new BadRequestException('Not enought resource quantity available');
    }

    let assignment: any;

    if (reservationId) {
      const reservation = await this.reservationService.findOne(reservationId);
      if (reservation) {
        assignment = await this.database.reservationResource.create({
          data: {
            resourceId,
            reservationId,
            quantity
          }
        });

        await this.reservationService.createReservationPayment({
          type: PaymentType.resource_charges,
          additionalCharges: chargeDetails.additionalCharges,
          amount: quantity * (resource.defaultCharge || 0),
          description: chargeDetails.description,
          relatedEntityId: resource.id,
          reservationId: reservation.id,
          tax: chargeDetails.tax || 0
        })
      }
    }

    if (roomId) {
      const room = await this.roomService.findOne(roomId);
      if (room) {
        assignment = await this.database.roomResource.create({
          data: {
            resourceId,
            roomId,
            quantity
          }
        });
      }
    }

    await this.updateResourceQuantity(resource.id, resource.quantity - quantity);

    return assignment;
  }
}
