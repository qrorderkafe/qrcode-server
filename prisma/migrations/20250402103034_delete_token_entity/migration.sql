/*
  Warnings:

  - You are about to drop the column `token_used` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `current_token` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `token_expires_at` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "token_used";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "current_token",
DROP COLUMN "token_expires_at";
