import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const username = "admin";
  const password = "admin123";

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    console.log("Admin déjà existant");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      pseudo: "Administrateur",
      username,
      passwordHash: hashedPassword,
      age: 0,
      educationLevel: "ADMIN",
      aiUsageFrequency: "TOUS_LES_JOURS",
      role: "ADMIN",
    },
  });

  console.log("Admin créé !");
  console.log("Identifiant : admin");
  console.log("Mot de passe : admin123");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });