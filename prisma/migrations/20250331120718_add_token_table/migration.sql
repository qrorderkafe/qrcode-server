-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "token_used" TEXT;

-- CreateTable
CREATE TABLE "TableToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TableToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableToken_token_key" ON "TableToken"("token");

-- CreateIndex
CREATE INDEX "TableToken_token_idx" ON "TableToken"("token");

-- AddForeignKey
ALTER TABLE "TableToken" ADD CONSTRAINT "TableToken_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
