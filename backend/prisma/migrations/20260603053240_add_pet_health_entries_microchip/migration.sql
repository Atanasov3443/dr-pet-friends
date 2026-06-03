-- CreateEnum
CREATE TYPE "HealthEntryType" AS ENUM ('DEWORMING', 'MEDICATION', 'PROCEDURE', 'WEIGHT', 'ALLERGY', 'NOTE');

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "color" TEXT,
ADD COLUMN     "microchip" TEXT;

-- CreateTable
CREATE TABLE "PetHealthEntry" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "type" "HealthEntryType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "data" TEXT,
    "notes" TEXT,
    "nextDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetHealthEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PetHealthEntry" ADD CONSTRAINT "PetHealthEntry_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
