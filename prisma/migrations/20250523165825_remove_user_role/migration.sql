/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "SellerOffer" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "mrp" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "SellerOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellerOffer_sellerId_idx" ON "SellerOffer"("sellerId");

-- CreateIndex
CREATE INDEX "SellerOffer_storeId_idx" ON "SellerOffer"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerOffer_sellerId_storeId_key" ON "SellerOffer"("sellerId", "storeId");

-- AddForeignKey
ALTER TABLE "SellerOffer" ADD CONSTRAINT "SellerOffer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerOffer" ADD CONSTRAINT "SellerOffer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
