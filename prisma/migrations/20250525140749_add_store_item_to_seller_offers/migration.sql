-- DropForeignKey
ALTER TABLE "SellerOffer" DROP CONSTRAINT "SellerOffer_storeItemId_fkey";

-- AlterTable
ALTER TABLE "SellerOffer" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "mrp" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "storeItemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SellerOffer" ADD CONSTRAINT "SellerOffer_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
