import { DatabaseService } from "@/common/database/database.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomHistoryService {
  constructor(private db: DatabaseService) {}

  async updateRoomHistory(reservationId: number, roomId?: number, completeReservation = false) {
    const activeHistory = await this.db.roomHistory.findFirst({
      where: { reservationId, toDate: null }
    });

    if (!activeHistory && roomId) {
      return this.db.roomHistory.create({ data: { reservationId, roomId, fromDate: new Date() } });
    }

    if (roomId && activeHistory && activeHistory.roomId !== roomId) {
      await this.db.roomHistory.updateMany({
        where: { reservationId, toDate: null },
        data: { toDate: new Date() }
      });

      return this.db.roomHistory.create({ data: { reservationId, roomId, fromDate: new Date() } });
    }

    if (completeReservation && activeHistory) {
      return this.db.roomHistory.update({
        where: { id: activeHistory.id },
        data: { toDate: new Date() }
      });
    }
  }
}
