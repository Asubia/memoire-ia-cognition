import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    const { answers, score, total } = await req.json();

    const session = await prisma.testSession.create({
      data: {
        userId: Number(userId),
        testType: "TEST_1",
        score,
        total,
        completedAt: new Date(),
        answers: {
          create: answers.map((answer: any) => ({
            question: answer.question,
            userAnswer: answer.userAnswer,
            correctAnswer: answer.correctAnswer,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Test 1 enregistré.",
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur lors de l’enregistrement du test." },
      { status: 500 }
    );
  }
}