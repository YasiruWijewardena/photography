/*
  Warnings:

  - A unique constraint covering the columns `[slug,photographer_id]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `albums` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `albums` MODIFY `slug` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `albums_slug_photographer_id_key` ON `albums`(`slug`, `photographer_id`);
