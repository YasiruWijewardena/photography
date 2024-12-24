-- AlterTable
ALTER TABLE `admins` ADD COLUMN `admin_level` ENUM('BASIC', 'SUPER') NOT NULL DEFAULT 'BASIC';
