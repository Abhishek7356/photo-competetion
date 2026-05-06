/*
  Warnings:

  - Added the required column `participantName` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantPhone` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "participantName" TEXT NOT NULL,
ADD COLUMN     "participantPhone" TEXT NOT NULL;
