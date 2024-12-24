/*
  Warnings:

  - You are about to drop the column `id_back_image` on the `photographers` table. All the data in the column will be lost.
  - You are about to drop the column `id_front_image` on the `photographers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `photographers` DROP COLUMN `id_back_image`,
    DROP COLUMN `id_front_image`;
