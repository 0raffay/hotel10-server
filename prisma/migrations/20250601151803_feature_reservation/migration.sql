/*
  Warnings:

  - The values [pending] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [booked] on the enum `RoomStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `stayDuration` on the `reservations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ntn]` on the table `guests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reservationNumber]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationNumber` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('cancelled', 'confirmed', 'checked_in', 'checked_out');
ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "ReservationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RoomStatus_new" AS ENUM ('available', 'reserved', 'under_maintainance', 'maintenance_required');
ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "RoomStatus_new" USING ("status"::text::"RoomStatus_new");
ALTER TYPE "RoomStatus" RENAME TO "RoomStatus_old";
ALTER TYPE "RoomStatus_new" RENAME TO "RoomStatus";
DROP TYPE "RoomStatus_old";
COMMIT;

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'staff';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "company" TEXT,
ADD COLUMN     "ntn" TEXT;

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "stayDuration",
ADD COLUMN     "advancePaymentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "reservationNumber" TEXT NOT NULL,
ADD COLUMN     "totalChildren" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "room_histories" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_ntn_key" ON "guests"("ntn");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservationNumber_key" ON "reservations"("reservationNumber");

-- AddForeignKey
ALTER TABLE "room_histories" ADD CONSTRAINT "room_histories_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_histories" ADD CONSTRAINT "room_histories_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
