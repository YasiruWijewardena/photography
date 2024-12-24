/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `firstname` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `lastname` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `username`,
    MODIFY `firstname` VARCHAR(100) NOT NULL,
    MODIFY `lastname` VARCHAR(100) NOT NULL;
