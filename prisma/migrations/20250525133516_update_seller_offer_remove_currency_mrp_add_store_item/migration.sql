/*
  Warnings:

  - You are about to drop the column `currency` on the `SellerOffer` table. All the data in the column will be lost.
  - You are about to drop the column `mrp` on the `SellerOffer` table. All the data in the column will be lost.
  - Added the required column `storeItemId` to the `SellerOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SellerOffer" DROP COLUMN "currency",
DROP COLUMN "mrp",
ADD COLUMN     "storeItemId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "SellerOffer_storeItemId_idx" ON "SellerOffer"("storeItemId");

-- AddForeignKey
ALTER TABLE "SellerOffer" ADD CONSTRAINT "SellerOffer_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
