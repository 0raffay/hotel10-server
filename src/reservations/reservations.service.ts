import { DatabaseService } from '@/common/database/database.service';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
import { GuestsService } from '@/guests/guests.service';
import { RoomService } from '@/room/room.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { differenceInMilliseconds, millisecondsToHours } from 'date-fns';
import { Request } from 'express';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private database: DatabaseService,
    private roomService: RoomService,
    private guestService: GuestsService
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const stayDuration = this.getReservationDuration(createReservationDto.checkInDate, createReservationDto.checkOutDate);
    const totalAmount = this.getReservationAmount(stayDuration ,(await this.roomService.getRoomPriceById(createReservationDto.roomId)));

    const guestId = createReservationDto.guestId ? createReservationDto.guestId :  (await this.guestService.create(createReservationDto.guest)).id

    return await this.database.reservation.create({
      data: { ...createReservationDto, guestId, stayDuration, totalAmount, paymentStatus: "unpaid", status: createReservationDto.status || "confirmed", guest: undefined  }
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    await this.findOne(id);
    return await this.database.reservation.update({
      where: {
        id
      },
      data: updateReservationDto
    });
  }

  async findAll() {
    return await this.database.reservation.findMany({
      where: {
        branchId: this.request.user?.branchId
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.reservation.findFirst({
      where: {
        id: id
      }
    });
    if (!record) throw new BadRequestException(`Record with id ${id} not found`);
    matchUserBranchWithEntity(this.request.user, record.branchId);
    return record;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.database.reservation.delete({
      where: {
        id
      }
    });
  }

  getReservationDuration(checkInDate: Date, checkOutDate: Date): number {
    return millisecondsToHours(differenceInMilliseconds(checkOutDate, checkInDate)) / 24;
  }

  getReservationAmount(stayDuration: number, pricePerNight: number): number {
    return stayDuration * pricePerNight;
  }
}
