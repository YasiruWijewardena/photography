/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AlbumTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PhotographTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `albums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favourites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photographers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photographs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_AlbumTags` DROP FOREIGN KEY `_AlbumTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AlbumTags` DROP FOREIGN KEY `_AlbumTags_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PhotographTags` DROP FOREIGN KEY `_PhotographTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PhotographTags` DROP FOREIGN KEY `_PhotographTags_B_fkey`;

-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `admin_user_fk`;

-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `admins_approved_by_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `albums` DROP FOREIGN KEY `albums_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `albums` DROP FOREIGN KEY `albums_photographer_id_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customer_user_fk`;

-- DropForeignKey
ALTER TABLE `favourites` DROP FOREIGN KEY `favourites_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `favourites` DROP FOREIGN KEY `favourites_photograph_id_fkey`;

-- DropForeignKey
ALTER TABLE `favourites` DROP FOREIGN KEY `favourites_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_photograph_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `photographers` DROP FOREIGN KEY `photographer_user_fk`;

-- DropForeignKey
ALTER TABLE `photographers` DROP FOREIGN KEY `photographers_approved_by_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `photographers` DROP FOREIGN KEY `photographers_subscription_id_fkey`;

-- DropForeignKey
ALTER TABLE `photographs` DROP FOREIGN KEY `photographs_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `photographs` DROP FOREIGN KEY `photographs_photographer_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_package_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_photographer_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_customer_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_photograph_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_photographer_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_project_id_fkey`;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `VerificationToken`;

-- DropTable
DROP TABLE `_AlbumTags`;

-- DropTable
DROP TABLE `_PhotographTags`;

-- DropTable
DROP TABLE `admins`;

-- DropTable
DROP TABLE `albums`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `favourites`;

-- DropTable
DROP TABLE `likes`;

-- DropTable
DROP TABLE `packages`;

-- DropTable
DROP TABLE `photographers`;

-- DropTable
DROP TABLE `photographs`;

-- DropTable
DROP TABLE `projects`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `subscriptions`;

-- DropTable
DROP TABLE `tags`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `ViewEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `anonymousId` VARCHAR(191) NULL,
    `viewTargetType` ENUM('PROFILE', 'ALBUM', 'PHOTO') NOT NULL,
    `targetId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ViewEvent_viewTargetType_targetId_idx`(`viewTargetType`, `targetId`),
    INDEX `ViewEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
