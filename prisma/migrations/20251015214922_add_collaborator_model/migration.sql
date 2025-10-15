/*
  Warnings:

  - The `mondayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mondayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tuesdayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tuesdayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wednesdayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wednesdayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `thursdayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `thursdayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fridayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fridayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `saturdayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `saturdayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sundayStart` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sundayEnd` column on the `business_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "business_hours" DROP COLUMN "mondayStart",
ADD COLUMN     "mondayStart" INTEGER,
DROP COLUMN "mondayEnd",
ADD COLUMN     "mondayEnd" INTEGER,
DROP COLUMN "tuesdayStart",
ADD COLUMN     "tuesdayStart" INTEGER,
DROP COLUMN "tuesdayEnd",
ADD COLUMN     "tuesdayEnd" INTEGER,
DROP COLUMN "wednesdayStart",
ADD COLUMN     "wednesdayStart" INTEGER,
DROP COLUMN "wednesdayEnd",
ADD COLUMN     "wednesdayEnd" INTEGER,
DROP COLUMN "thursdayStart",
ADD COLUMN     "thursdayStart" INTEGER,
DROP COLUMN "thursdayEnd",
ADD COLUMN     "thursdayEnd" INTEGER,
DROP COLUMN "fridayStart",
ADD COLUMN     "fridayStart" INTEGER,
DROP COLUMN "fridayEnd",
ADD COLUMN     "fridayEnd" INTEGER,
DROP COLUMN "saturdayStart",
ADD COLUMN     "saturdayStart" INTEGER,
DROP COLUMN "saturdayEnd",
ADD COLUMN     "saturdayEnd" INTEGER,
DROP COLUMN "sundayStart",
ADD COLUMN     "sundayStart" INTEGER,
DROP COLUMN "sundayEnd",
ADD COLUMN     "sundayEnd" INTEGER;

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
