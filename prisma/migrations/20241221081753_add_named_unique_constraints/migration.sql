/*
  Warnings:

  - A unique constraint covering the columns `[user_id,photograph_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,album_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - Made the column `photograph_id` on table `likes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_photograph_id_fkey`;

-- AlterTable
ALTER TABLE `likes` MODIFY `photograph_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `likes_user_id_photograph_id_key` ON `likes`(`user_id`, `photograph_id`);

-- CreateIndex
CREATE UNIQUE INDEX `likes_user_id_album_id_key` ON `likes`(`user_id`, `album_id`);

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_photograph_id_fkey` FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
