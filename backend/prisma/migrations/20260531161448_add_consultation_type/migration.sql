-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('IN_CLINIC', 'ONLINE');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "consultationType" "ConsultationType" NOT NULL DEFAULT 'IN_CLINIC',
ADD COLUMN     "meetLink" TEXT;
