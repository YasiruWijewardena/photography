/*
  Warnings:

  - A unique constraint covering the columns `[customer_id,photograph_id]` on the table `favourites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customer_id,album_id]` on the table `favourites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `favourites_customer_id_photograph_id_key` ON `favourites`(`customer_id`, `photograph_id`);

-- CreateIndex
CREATE UNIQUE INDEX `favourites_customer_id_album_id_key` ON `favourites`(`customer_id`, `album_id`);
