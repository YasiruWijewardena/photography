/*
  Warnings:

  - You are about to drop the column `customer_id` on the `likes` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_customer_id_fkey`;

-- AlterTable
ALTER TABLE `likes` DROP COLUMN `customer_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
