-- AlterTable
ALTER TABLE `admins` ADD COLUMN `approved_by_admin_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `photographers` ADD COLUMN `approved_by_admin_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_approved_by_admin_id_fkey` FOREIGN KEY (`approved_by_admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photographers` ADD CONSTRAINT `photographers_approved_by_admin_id_fkey` FOREIGN KEY (`approved_by_admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;
