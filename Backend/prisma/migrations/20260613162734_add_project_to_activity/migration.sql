-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "project" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB;
