/*
  Warnings:

  - You are about to drop the `_PhotographCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `albums` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_PhotographCategories` DROP FOREIGN KEY `_PhotographCategories_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PhotographCategories` DROP FOREIGN KEY `_PhotographCategories_B_fkey`;

-- AlterTable
ALTER TABLE `albums` ADD COLUMN `category_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_PhotographCategories`;

-- CreateIndex
CREATE INDEX `tags_name_idx` ON `tags`(`name`);

-- AddForeignKey
ALTER TABLE `albums` ADD CONSTRAINT `albums_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
