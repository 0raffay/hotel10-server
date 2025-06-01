import { DatabaseService } from '@/common/database/database.service';
import { CreatePaymentDto } from '@/payment/dto/create-payment.dto';
import { PaymentService } from '@/payment/payment.service';
import { RoomService } from '@/room/room.service';
import { Injectable } from '@nestjs/common';
import { PaymentType, Reservation } from '@prisma/client';

@Injectable()
export class ReservationFinanceService {
  constructor(
    private db: DatabaseService,
    private paymentService: PaymentService,
    private roomService: RoomService
  ) {}

  async updateReservationFinance(reservationId: number) {
    const payments = await this.paymentService.getAllReservationPayments(reservationId);

    const totalAmount = payments
      .filter((p) => p.type !== PaymentType.guest_payment)
      .reduce((a, p) => a + p.totalAmount, 0);
    const paidAmount = payments
      .filter((p) => p.type === PaymentType.guest_payment)
      .reduce((a, p) => a + p.totalAmount, 0);
    const balance = totalAmount - paidAmount;

    return this.db.reservation.update({
      where: { id: reservationId },
      data: { totalAmount, balance, paidAmount }
    });
  }

  async createReservationRoomPayment(reservation: Reservation) {
    const price = (await this.roomService.findOne(reservation.roomId)).roomType.price;
    await this.paymentService.create({
      reservationId: reservation.id,
      type: PaymentType.room_charges,
      description: 'Room charges',
      amount: price,
      additionalCharges: 0,
      tax: 0
    });

    return this.updateReservationFinance(reservation.id);
  }

  async createReservationPayment(paymentData: CreatePaymentDto) {
    await this.paymentService.create(paymentData);
    return await this.updateReservationFinance(paymentData.reservationId);
  }
}
