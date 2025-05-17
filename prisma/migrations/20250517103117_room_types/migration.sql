/*
  Warnings:

  - You are about to drop the column `price` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `roomTypeId` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "price",
DROP COLUMN "roomType",
ADD COLUMN     "roomTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RoomType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_name_hotelId_key" ON "RoomType"("name", "hotelId");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
