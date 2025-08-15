-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Group" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ImageToMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ImageToMessage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ImageToMessage_B_index" ON "public"."_ImageToMessage"("B");

-- AddForeignKey
ALTER TABLE "public"."_ImageToMessage" ADD CONSTRAINT "_ImageToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ImageToMessage" ADD CONSTRAINT "_ImageToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
