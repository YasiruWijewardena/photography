/*
  Warnings:

  - You are about to drop the column `categories` on the `photographs` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `photographs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `photographs` DROP COLUMN `categories`,
    DROP COLUMN `tags`;

-- CreateTable
CREATE TABLE `_AlbumTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlbumTags_AB_unique`(`A`, `B`),
    INDEX `_AlbumTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PhotographTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PhotographTags_AB_unique`(`A`, `B`),
    INDEX `_PhotographTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PhotographCategories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PhotographCategories_AB_unique`(`A`, `B`),
    INDEX `_PhotographCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AlbumTags` ADD CONSTRAINT `_AlbumTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlbumTags` ADD CONSTRAINT `_AlbumTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhotographTags` ADD CONSTRAINT `_PhotographTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhotographTags` ADD CONSTRAINT `_PhotographTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhotographCategories` ADD CONSTRAINT `_PhotographCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhotographCategories` ADD CONSTRAINT `_PhotographCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
