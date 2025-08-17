-- CreateTable
CREATE TABLE "public"."UserInfo" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT 'anonymous',
    "lastName" TEXT NOT NULL DEFAULT 'anonymous',
    "imageId" TEXT NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_imageId_key" ON "public"."UserInfo"("imageId");

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
