import { DatabaseService } from '@/common/database/database.service';
import { matchUserBranchWithEntity } from '@/common/helpers/utils';
import { GuestsService } from '@/guests/guests.service';
import { RoomService } from '@/room/room.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { differenceInMilliseconds, isBefore, millisecondsToHours } from 'date-fns';
import { Request } from 'express';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PaymentService } from '@/payment/payment.service';
import { CreatePaymentDto } from '@/payment/dto/create-payment.dto';
import { Payment, PaymentType, Reservation } from '@prisma/client';
import { BranchService } from '@/branch/branch.service';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private database: DatabaseService,
    private roomService: RoomService,
    private guestService: GuestsService,
    private paymentService: PaymentService,
    private branchService: BranchService
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    await this.branchService.findOne(createReservationDto.branchId);
    await this.roomService.findOne(createReservationDto.roomId);

    const guestId = createReservationDto.guestId ? createReservationDto.guestId : (await this.guestService.create(createReservationDto.guest)).id;
    const reservation = await this.database.reservation.create({
      data: { ...createReservationDto, guestId, paymentStatus: 'unpaid', status: createReservationDto.status || 'confirmed', guest: undefined }
    });

    await this.createReservationRoomPayment(reservation);

    return reservation;
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
    const record = await this.getById(id);
    if (!record) throw new BadRequestException(`Reservation with id ${id} not found`);
    matchUserBranchWithEntity(this.request.user, record.branchId);
    return record;
  }

  async getById(id: number): Promise<Reservation | null> {
    return await this.database.reservation.findFirst({
      where: {
        id
      }
    })
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

  async updateReservationFinance(reservationId: number) {
    const payments = await this.paymentService.getAllReservationPayments(reservationId);

    const totalAmount = payments.reduce((total, payment) => {
      if (payment.type !== PaymentType.guest_payment) {
        total += payment.totalAmount;
      }
      return total;
    }, 0)

    const paidAmount = payments.reduce((totalPaid, payment) => {
      if (payment.type === PaymentType.guest_payment) {
        totalPaid += payment.totalAmount;
      }
      return totalPaid;
    }, 0)

    const balance = totalAmount - paidAmount;

    return await this.database.reservation.update({
      where: {
        id: reservationId
      },
      data: {
        totalAmount,
        balance,
        paidAmount
      }
    })
  }

  async createReservationPayment(paymentData: CreatePaymentDto) {
    await this.paymentService.create(paymentData);
    return await this.updateReservationFinance(paymentData.reservationId);
  }

  async createReservationRoomPayment(reservation: Reservation) {
    const roomPrice = (await this.roomService.findOne(reservation.roomId)).price;
    return await this.createReservationPayment({
      reservationId: reservation.id,
      type: PaymentType.room_charges,
      description: `Room charges - ${roomPrice.toLocaleString()}`,
      amount: roomPrice,
      additionalCharges: 0,
      tax: 0
    });
  }
}
