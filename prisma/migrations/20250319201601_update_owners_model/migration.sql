/*
  Warnings:

  - You are about to drop the `property_owners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "property_owners" DROP CONSTRAINT "property_owners_hotelId_fkey";

-- DropTable
DROP TABLE "property_owners";

-- CreateTable
CREATE TABLE "hotel_owners" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hotel_owners_cnic_key" ON "hotel_owners"("cnic");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_owners_email_key" ON "hotel_owners"("email");

-- AddForeignKey
ALTER TABLE "hotel_owners" ADD CONSTRAINT "hotel_owners_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
