import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const data = [
    {
      description: "Guitarra",
      price: 1000,
      width: 100,
      height: 50,
      depth: 15,
      weight: 3,
    },
    {
      description: "Amplificador",
      price: 5000,
      width: 50,
      height: 50,
      depth: 50,
      weight: 22,
    },
    {
      description: "Cabo",
      price: 30,
      width: 10,
      height: 10,
      depth: 10,
      weight: 1,
    },
  ];
  await prisma.product.createMany({ data });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
