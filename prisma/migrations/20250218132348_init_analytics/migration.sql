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
  - You are about to drop the `photographer_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photographers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photographs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plan_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
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
ALTER TABLE `photographer_subscriptions` DROP FOREIGN KEY `photographer_subscriptions_photographerId_fkey`;

-- DropForeignKey
ALTER TABLE `photographer_subscriptions` DROP FOREIGN KEY `photographer_subscriptions_subscriptionPlanId_fkey`;

-- DropForeignKey
ALTER TABLE `photographers` DROP FOREIGN KEY `photographer_user_fk`;

-- DropForeignKey
ALTER TABLE `photographers` DROP FOREIGN KEY `photographers_approved_by_admin_id_fkey`;

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

-- DropForeignKey
ALTER TABLE `subscription_plan_features` DROP FOREIGN KEY `subscription_plan_features_subscriptionFeatureId_fkey`;

-- DropForeignKey
ALTER TABLE `subscription_plan_features` DROP FOREIGN KEY `subscription_plan_features_subscriptionPlanId_fkey`;

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
DROP TABLE `photographer_subscriptions`;

-- DropTable
DROP TABLE `photographers`;

-- DropTable
DROP TABLE `photographs`;

-- DropTable
DROP TABLE `projects`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `subscription_features`;

-- DropTable
DROP TABLE `subscription_plan_features`;

-- DropTable
DROP TABLE `subscription_plans`;

-- DropTable
DROP TABLE `tags`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `ProfileViewEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `anonymousId` VARCHAR(191) NULL,
    `profileUserId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProfileViewEvent_profileUserId_idx`(`profileUserId`),
    INDEX `ProfileViewEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlbumViewEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `anonymousId` VARCHAR(191) NULL,
    `albumId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AlbumViewEvent_albumId_idx`(`albumId`),
    INDEX `AlbumViewEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoViewEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `anonymousId` VARCHAR(191) NULL,
    `photoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PhotoViewEvent_photoId_idx`(`photoId`),
    INDEX `PhotoViewEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
