-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('photographer', 'customer', 'admin') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `admin_id` INTEGER NOT NULL,
    `permissions` JSON NOT NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `cust_id` INTEGER NOT NULL,
    `favourites` JSON NULL,

    PRIMARY KEY (`cust_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photographers` (
    `photo_id` INTEGER NOT NULL,
    `bio` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `instagram` VARCHAR(255) NOT NULL,
    `mobile_num` INTEGER NOT NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `subscription_id` INTEGER NULL,

    PRIMARY KEY (`photo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `albums` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photographer_id` INTEGER NOT NULL,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photographs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `album_id` INTEGER NOT NULL,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `thumb_url` VARCHAR(255) NOT NULL,
    `tags` JSON NULL,
    `categories` JSON NULL,
    `likes_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `photographer_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `photographer_id` INTEGER NOT NULL,
    `photograph_id` INTEGER NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(255) NOT NULL,
    `project_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `features` JSON NULL,

    UNIQUE INDEX `subscriptions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `packages_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favourites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `photograph_id` INTEGER NULL,
    `album_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `photograph_id` INTEGER NULL,
    `album_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photographer_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'active', 'awaiting_selection', 'editing', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admin_user_fk` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customer_user_fk` FOREIGN KEY (`cust_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photographers` ADD CONSTRAINT `photographer_user_fk` FOREIGN KEY (`photo_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `photographers` ADD CONSTRAINT `photographers_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `albums` ADD CONSTRAINT `albums_photographer_id_fkey` FOREIGN KEY (`photographer_id`) REFERENCES `photographers`(`photo_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `photographs` ADD CONSTRAINT `photographs_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photographs` ADD CONSTRAINT `photographs_photographer_id_fkey` FOREIGN KEY (`photographer_id`) REFERENCES `photographers`(`photo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_customer_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`cust_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_photographer_fkey` FOREIGN KEY (`photographer_id`) REFERENCES `photographers`(`photo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_photograph_fkey` FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favourites` ADD CONSTRAINT `favourites_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`cust_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favourites` ADD CONSTRAINT `favourites_photograph_id_fkey` FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favourites` ADD CONSTRAINT `favourites_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`cust_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_photograph_id_fkey` FOREIGN KEY (`photograph_id`) REFERENCES `photographs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_photographer_id_fkey` FOREIGN KEY (`photographer_id`) REFERENCES `photographers`(`photo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`cust_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
