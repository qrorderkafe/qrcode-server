/*
  Warnings:

  - You are about to drop the `TableToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TableToken" DROP CONSTRAINT "TableToken_table_id_fkey";

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "current_token" TEXT,
ADD COLUMN     "token_expires_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "TableToken";
