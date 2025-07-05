/*
  Warnings:

  - The values [pending,replaced] on the enum `DamageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DamageStatus_new" AS ENUM ('reported', 'under_repair', 'fixed');
ALTER TABLE "damage_reports" ALTER COLUMN "status" TYPE "DamageStatus_new" USING ("status"::text::"DamageStatus_new");
ALTER TYPE "DamageStatus" RENAME TO "DamageStatus_old";
ALTER TYPE "DamageStatus_new" RENAME TO "DamageStatus";
DROP TYPE "DamageStatus_old";
COMMIT;
