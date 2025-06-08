import { DatabaseService } from '@/common/database/database.service';
import { RoomService } from '@/room/room.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { differenceInDays, differenceInMilliseconds, isAfter, isBefore, isEqual, millisecondsToHours } from 'date-fns';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PaymentService } from '@/payment/payment.service';
import { CreatePaymentDto } from '@/payment/dto/create-payment.dto';
import { PaymentStatus, PaymentType, Reservation, ReservationStatus, RoomStatus } from '@prisma/client';
import { BranchService } from '@/branch/branch.service';
import { ContextService } from '@/common/context/context.service';
import { PermissionsService } from '@/permission/permissions.service';
import { generateReservationNumber } from '@/common/helpers/utils';
import { RoomHistoryService } from '@/room-history/room-history.service';
import { ReservationFinanceService } from './reservation-finance.service';
import { ReservationCheckoutDto } from './dto/reservation-checkout.dto';
import { reservationInclude } from '@/common/helpers/prisma.queries';

@Injectable()
export class ReservationsService {
  constructor(
    private database: DatabaseService,
    private context: ContextService,
    private roomService: RoomService,
    private branchService: BranchService,
    private reservationPaymentService: ReservationFinanceService,
    private historyService: RoomHistoryService,
    private permissionsService: PermissionsService
  ) {}

  async create(dto: CreateReservationDto) {
    await this.branchService.findOne(dto.branchId);

    const room = await this.roomService.findOne(dto.roomId);
    if (room.status !== RoomStatus.available) throw new BadRequestException('Room is not available');

    const reservationStatus = this.getInitialStatus(dto.checkInDate);
    const reservationNumber = await generateReservationNumber(this.database);

    const currentUser = this.context.getAuthUser();

    const reservation = await this.database.reservation.create({
      data: {
        ...dto,
        reservationNumber,
        paymentStatus: PaymentStatus.unpaid,
        status: reservationStatus,
        createdById: currentUser.id,
        updatedById: currentUser.id
      }
    });

    // Create advanced payment
    await this.createReservationPayment({
      amount: dto.advancePaymentAmount,
      reservationId: reservation.id,
      type: PaymentType.guest_payment,
      description: 'Advance payment',
      tax: 0,
      additionalCharges: 0
    });

    // update reservations status
    await this.onUpdateReservationStatus(dto.roomId, reservationStatus);
    // Create reservation room payment
    await this.reservationPaymentService.createReservationRoomPayment(reservation);
    // Create room history
    await this.historyService.updateRoomHistory(reservation.id, room.id);

    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.findOne(id);

    if (dto.status && dto.status !== reservation.status) {
      await this.onUpdateReservationStatus(reservation.roomId, dto.status);
    }

    if (dto.roomId && dto.roomId !== reservation.roomId) {
      await this.roomService.update(reservation.roomId, { status: RoomStatus.available });
      await this.roomService.update(dto.roomId, { status: RoomStatus.reserved });
      await this.historyService.updateRoomHistory(id, dto.roomId);
    }

    return await this.database.reservation.update({
      where: { id },
      data: { ...dto, updatedById: this.context.getAuthUser().id }
    });
  }
  async findAll({ branchId }: { branchId?: number } = {}) {
    const branches = this.context.getUserBranches();

    return await this.database.reservation.findMany({
      include: reservationInclude,
      where: {
        branchId: branchId ? branchId : { in: branches }
      }
    });
  }

  async findOne(id: number) {
    const record = await this.database.reservation.findFirst({
      where: {
        id
      },
      include: {
        roomHistory: {
          include: {
            room: true
          }
        },
        reservationResource: true,
        branch: true,
        payments: true,
        room: {
          include: {
            roomType: true,
            floor: true
          }
        },
        guest: true,
        createdBy: true,
        updatedBy: true
      }
    });
    if (!record) throw new BadRequestException(`Reservation with id ${id} not found`);
    this.permissionsService.verifyEntityOwnership(record.branchId);
    return record;
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    await this.roomService.update(reservation.roomId, { status: RoomStatus.available });
    return await this.database.reservation.delete({
      where: {
        id
      }
    });
  }

  private getInitialStatus(checkInDate: Date): ReservationStatus {
    return isAfter(checkInDate, new Date()) || isEqual(checkInDate, new Date()) ? ReservationStatus.checked_in : ReservationStatus.confirmed;
  }

  private async onUpdateReservationStatus(roomId: number, status: ReservationStatus) {
    if (status === ReservationStatus.cancelled) {
      await this.roomService.update(roomId, { status: RoomStatus.available });
    }

    if (status === ReservationStatus.checked_in || status === ReservationStatus.confirmed) {
      await this.roomService.update(roomId, { status: RoomStatus.reserved });
    }

    if (status === ReservationStatus.checked_out) {
      await this.roomService.update(roomId, { status: RoomStatus.maintenance_required });
    }
  }

  async createReservationPayment(paymentData: CreatePaymentDto) {
    return await this.reservationPaymentService.createReservationPayment(paymentData);
  }

  async reservationCheckout(dto: ReservationCheckoutDto) {
    const reservation = await this.findOne(dto.reservationId);

    await this.onUpdateReservationStatus(reservation.roomId, ReservationStatus.checked_out);

    await this.createReservationPayment({
      reservationId: dto.reservationId,
      type: PaymentType.guest_payment,
      amount: dto.amount,
      additionalCharges: 0,
      tax: 0,
      description: dto.description
    });

    await this.reservationPaymentService.updateReservationFinance(dto.reservationId);

    await this.historyService.updateRoomHistory(reservation.id, reservation.roomId, true);

    return await this.database.reservation.update({
      where: {
        id: dto.reservationId
      },
      data: {
        status: ReservationStatus.checked_out,
        checkOutDate: new Date(),
        discount: reservation.balance - dto.amount,
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.paid,
        balance: 0
      }
    });
  }
}
