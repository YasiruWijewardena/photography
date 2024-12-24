/*
  Warnings:

  - You are about to drop the column `thumb_url` on the `photographs` table. All the data in the column will be lost.
  - Added the required column `thumbnail_url` to the `photographs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `photographs` DROP COLUMN `thumb_url`,
    ADD COLUMN `cameraModel` VARCHAR(100) NULL,
    ADD COLUMN `exposure` VARCHAR(50) NULL,
    ADD COLUMN `focalLength` VARCHAR(50) NULL,
    ADD COLUMN `lens` VARCHAR(100) NULL,
    ADD COLUMN `thumbnail_url` VARCHAR(255) NOT NULL;
