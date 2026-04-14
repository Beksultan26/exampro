/*
  Warnings:

  - Added the required column `group` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "group" TEXT NOT NULL;
