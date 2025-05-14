/*
  Warnings:

  - You are about to drop the column `location` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `hotel_owners` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cnic]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnic` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "hotel_owners" DROP CONSTRAINT "hotel_owners_hotelId_fkey";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "location",
DROP COLUMN "whatsapp",
ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "cnic" TEXT NOT NULL,
ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "hotel_owners";

-- CreateIndex
CREATE UNIQUE INDEX "users_cnic_key" ON "users"("cnic");
