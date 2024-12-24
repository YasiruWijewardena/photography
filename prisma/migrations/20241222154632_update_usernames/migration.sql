-- AlterTable
ALTER TABLE `users` ADD COLUMN `firstname` VARCHAR(191) NOT NULL DEFAULT 'fname',
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL DEFAULT 'lname';
