-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "price" MONEY NOT NULL,

    PRIMARY KEY ("id")
);
