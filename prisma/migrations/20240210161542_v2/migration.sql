/*
  Warnings:

  - Added the required column `type` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` ADD COLUMN `type` ENUM('CLASSROOM', 'AMPHITHEATER') NOT NULL;
