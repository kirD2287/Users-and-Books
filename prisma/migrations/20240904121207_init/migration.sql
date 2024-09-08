-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "emailToken" TEXT,
ADD COLUMN     "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false;
