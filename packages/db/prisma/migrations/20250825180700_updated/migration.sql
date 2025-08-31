/*
  Warnings:

  - Added the required column `roomId` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChatHistory" ADD COLUMN     "roomId" INTEGER NOT NULL;
