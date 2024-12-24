/*
  Warnings:

  - Added the required column `address` to the `photographers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_back_image` to the `photographers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_front_image` to the `photographers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_picture` to the `photographers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `profile_image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `photographers` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `id_back_image` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_front_image` VARCHAR(255) NOT NULL,
    ADD COLUMN `profile_picture` VARCHAR(255) NOT NULL;
