/*
  Warnings:

  - The values [INTERNAL,EXTERNAL] on the enum `ChargeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,UNDER_REPAIR,REPLACED] on the enum `DamageStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNPAID,PAID,REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,CONFIRMED,CANCELLED,CHECKED_IN,CHECKED_OUT] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [AMENITY,FACILITY] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - The values [AVAILABLE,OCCUPIED,UNDER_MAINTAINANCE] on the enum `RoomStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reservationId` on the `damage_reports` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `damage_reports` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `damage_reports` table. All the data in the column will be lost.
  - You are about to drop the column `damaged` on the `reservation_resources` table. All the data in the column will be lost.
  - You are about to drop the column `inventory` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `damaged` on the `room_resources` table. All the data in the column will be lost.
  - You are about to drop the column `occupancyLimit` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `damagedQuantity` to the `damage_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Made the column `defaultCharge` on table `resources` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `capacity` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `rooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('admin', 'manager', 'agent');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('guest_payment', 'room_charges', 'resource_charges', 'damage_charges');

-- AlterEnum
BEGIN;
CREATE TYPE "ChargeType_new" AS ENUM ('internal', 'external');
ALTER TABLE "resources" ALTER COLUMN "chargeType" TYPE "ChargeType_new" USING ("chargeType"::text::"ChargeType_new");
ALTER TYPE "ChargeType" RENAME TO "ChargeType_old";
ALTER TYPE "ChargeType_new" RENAME TO "ChargeType";
DROP TYPE "ChargeType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DamageStatus_new" AS ENUM ('pending', 'under_repair', 'replaced');
ALTER TABLE "damage_reports" ALTER COLUMN "status" TYPE "DamageStatus_new" USING ("status"::text::"DamageStatus_new");
ALTER TYPE "DamageStatus" RENAME TO "DamageStatus_old";
ALTER TYPE "DamageStatus_new" RENAME TO "DamageStatus";
DROP TYPE "DamageStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('unpaid', 'paid');
ALTER TABLE "reservations" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out');
ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "ReservationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('amenity', 'facility');
ALTER TABLE "resources" ALTER COLUMN "type" TYPE "ResourceType_new" USING ("type"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RoomStatus_new" AS ENUM ('available', 'booked', 'under_maintainance');
ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "RoomStatus_new" USING ("status"::text::"RoomStatus_new");
ALTER TYPE "RoomStatus" RENAME TO "RoomStatus_old";
ALTER TYPE "RoomStatus_new" RENAME TO "RoomStatus";
DROP TYPE "RoomStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "damage_reports" DROP CONSTRAINT "damage_reports_resourceId_fkey";

-- AlterTable
ALTER TABLE "damage_reports" DROP COLUMN "reservationId",
DROP COLUMN "resourceId",
DROP COLUMN "roomId",
ADD COLUMN     "damagedQuantity" INTEGER NOT NULL,
ADD COLUMN     "reservationResourceId" INTEGER,
ADD COLUMN     "roomResourceId" INTEGER;

-- AlterTable
ALTER TABLE "guests" ALTER COLUMN "cnic" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reservation_resources" DROP COLUMN "damaged";

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "stayDuration" DOUBLE PRECISION,
ALTER COLUMN "totalAmount" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "inventory",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "defaultCharge" SET NOT NULL,
ALTER COLUMN "defaultCharge" SET DEFAULT 0.0,
ALTER COLUMN "defaultCharge" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "room_resources" DROP COLUMN "damaged";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "occupancyLimit",
ADD COLUMN     "capacity" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRoles" NOT NULL;

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "relatedEntityId" INTEGER,
    "type" "PaymentType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "additionalCharges" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_reservationResourceId_fkey" FOREIGN KEY ("reservationResourceId") REFERENCES "reservation_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_roomResourceId_fkey" FOREIGN KEY ("roomResourceId") REFERENCES "room_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
