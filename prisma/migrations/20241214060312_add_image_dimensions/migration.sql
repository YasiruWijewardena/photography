/*
  Warnings:

  - Added the required column `image_height` to the `photographs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_width` to the `photographs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_height` to the `photographs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_width` to the `photographs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `photographs` ADD COLUMN `image_height` INTEGER NOT NULL,
    ADD COLUMN `image_width` INTEGER NOT NULL,
    ADD COLUMN `thumbnail_height` INTEGER NOT NULL,
    ADD COLUMN `thumbnail_width` INTEGER NOT NULL;
