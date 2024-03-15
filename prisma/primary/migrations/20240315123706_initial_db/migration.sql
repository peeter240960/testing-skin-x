-- CreateTable
CREATE TABLE "post" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postedAt" TEXT NOT NULL,
    "postedBy" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);
