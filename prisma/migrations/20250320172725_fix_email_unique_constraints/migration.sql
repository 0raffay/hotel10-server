/*
  Warnings:

  - A unique constraint covering the columns `[cnic,hotelId]` on the table `hotel_owners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,hotelId]` on the table `hotel_owners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,branchId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "branches_email_key";

-- DropIndex
DROP INDEX "hotel_owners_cnic_key";

-- DropIndex
DROP INDEX "hotel_owners_email_key";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_phone_key";

-- CreateIndex
CREATE UNIQUE INDEX "hotel_owners_cnic_hotelId_key" ON "hotel_owners"("cnic", "hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_owners_email_hotelId_key" ON "hotel_owners"("email", "hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_branchId_key" ON "users"("email", "branchId");
