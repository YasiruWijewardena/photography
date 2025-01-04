-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('photographer', 'customer', 'admin', 'pending') NOT NULL;
