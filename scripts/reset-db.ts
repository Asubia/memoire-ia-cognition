import { prisma } from "@/lib/prisma";

async function main() {
  // Supprimer les réponses
  await prisma.answer.deleteMany();

  // Supprimer les sessions
  await prisma.testSession.deleteMany();

  // Supprimer uniquement les participants (garde ADMIN)
  await prisma.user.deleteMany({
    where: {
      role: "PARTICIPANT",
    },
  });

  console.log("Base réinitialisée (participants supprimés, admin conservé)");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });