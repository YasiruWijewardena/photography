/*
  Warnings:

  - You are about to drop the column `customer_id` on the `favourites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,photograph_id]` on the table `favourites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,album_id]` on the table `favourites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `favourites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `favourites` DROP FOREIGN KEY `favourites_customer_id_fkey`;

-- DropIndex
DROP INDEX `favourites_customer_id_album_id_key` ON `favourites`;

-- DropIndex
DROP INDEX `favourites_customer_id_photograph_id_key` ON `favourites`;

-- AlterTable
ALTER TABLE `favourites` DROP COLUMN `customer_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `favourites_user_id_photograph_id_key` ON `favourites`(`user_id`, `photograph_id`);

-- CreateIndex
CREATE UNIQUE INDEX `favourites_user_id_album_id_key` ON `favourites`(`user_id`, `album_id`);

-- AddForeignKey
ALTER TABLE `favourites` ADD CONSTRAINT `favourites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
