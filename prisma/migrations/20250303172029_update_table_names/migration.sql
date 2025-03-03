/*
  Warnings:

  - You are about to drop the column `created_at` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `hotel_id` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `business_card` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `letter_head` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `social_links` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `property_owners` table. All the data in the column will be lost.
  - You are about to drop the column `hotel_id` on the `property_owners` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `property_owners` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hotelId` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `hotels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `property_owners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `property_owners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "property_owners" DROP CONSTRAINT "property_owners_hotel_id_fkey";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "created_at",
DROP COLUMN "hotel_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hotelId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "business_card",
DROP COLUMN "created_at",
DROP COLUMN "letter_head",
DROP COLUMN "social_links",
DROP COLUMN "updated_at",
ADD COLUMN     "businessCard" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "letterHead" TEXT,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "property_owners" DROP COLUMN "created_at",
DROP COLUMN "hotel_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hotelId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_owners" ADD CONSTRAINT "property_owners_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
