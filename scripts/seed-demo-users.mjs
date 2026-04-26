import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAnswers(testType, total, score) {
  return Array.from({ length: total }, (_, index) => {
    const isCorrect = index < score;

    return {
      question: `${testType} - Question ${index + 1}`,
      userAnswer: isCorrect ? "Bonne réponse simulée" : "Mauvaise réponse simulée",
      correctAnswer: "Bonne réponse simulée",
      isCorrect,
      timeSpent: randomInt(8, 60),
    };
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);

  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        pseudo: `Participant demo ${i}`,
        username: `demo${i}`,
        passwordHash,
        age: randomInt(15, 50),
        educationLevel: ["BAC", "BAC_2", "BAC_3", "BAC_5"][randomInt(0, 3)],
        aiUsageFrequency: ["JAMAIS", "RAREMENT", "PARFOIS", "SOUVENT"][randomInt(0, 3)],
        role: "PARTICIPANT",
      },
    });

    const scoreTest1 = randomInt(8, 17);
    const scoreTest2 = randomInt(9, 19);
    const aiUsageCount = randomInt(1, 10);

    await prisma.testSession.create({
      data: {
        userId: user.id,
        testType: "TEST_1",
        score: scoreTest1,
        total: 20,
        answers: {
          create: makeAnswers("TEST_1", 20, scoreTest1),
        },
      },
    });

    await prisma.testSession.create({
      data: {
        userId: user.id,
        testType: "TEST_2",
        score: scoreTest2,
        total: 20,
        aiUsageCount,
        answers: {
          create: makeAnswers("TEST_2", 20, scoreTest2),
        },
      },
    });
  }

  console.log("20 participants de démonstration créés avec succès.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });