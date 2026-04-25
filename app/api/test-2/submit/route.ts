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

    const { answers, score, total, aiUsageCount } = await req.json();

    const session = await prisma.testSession.create({
      data: {
        userId: Number(userId),
        testType: "TEST_2",
        score,
        total,
        aiUsageCount,
        completedAt: new Date(),
        answers: {
          create: answers.map((a: any) => ({
            question: a.question,
            userAnswer: a.userAnswer,
            correctAnswer: a.correctAnswer,
            isCorrect: a.isCorrect,
            timeSpent: a.timeSpent,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Test 2 enregistré",
      sessionId: session.id,
      aiUsageCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}