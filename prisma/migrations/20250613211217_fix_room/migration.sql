/*
  Warnings:

  - Added the required column `createdById` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "updatedById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
