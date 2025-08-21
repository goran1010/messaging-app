/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_imageId_fkey";

-- AlterTable
ALTER TABLE "public"."Image" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserInfo" ALTER COLUMN "imageId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "public"."Image"("url");

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
