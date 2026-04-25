import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.answer.deleteMany();
  await prisma.testSession.deleteMany();

  await prisma.user.deleteMany({
    where: {
      role: "PARTICIPANT",
    },
  });

  console.log(
    "Base réinitialisée : participants, réponses et sessions supprimés. Admin conservé."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });