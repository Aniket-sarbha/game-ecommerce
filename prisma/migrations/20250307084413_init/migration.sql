/*
  Warnings:

  - The primary key for the `Store` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Store` table. All the data in the column will be lost.
  - The primary key for the `StoreItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `StoreItem` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `StoreItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StoreItem` table. All the data in the column will be lost.
  - Added the required column `img` to the `StoreItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StoreItem" DROP CONSTRAINT "StoreItem_storeId_fkey";

-- DropIndex
DROP INDEX "StoreItem_storeId_idx";

-- AlterTable
ALTER TABLE "Store" DROP CONSTRAINT "Store_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Store_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Store_id_seq";

-- AlterTable
ALTER TABLE "StoreItem" DROP CONSTRAINT "StoreItem_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "image",
DROP COLUMN "updatedAt",
ADD COLUMN     "img" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "mrp" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "storeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StoreItem_id_seq";

-- AddForeignKey
ALTER TABLE "StoreItem" ADD CONSTRAINT "StoreItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
