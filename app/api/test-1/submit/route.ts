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

    const existingSession = await prisma.testSession.findFirst({
      where: {
        userId: Number(userId),
        testType: "TEST_1",
      },
    });

    if (existingSession) {
      return NextResponse.json(
        { error: "Vous avez déjà effectué le test 1." },
        { status: 409 }
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
          create: answers,
        },
      },
    });

    return NextResponse.json({
      message: "Test 1 enregistré avec succès.",
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Erreur submit test 1 :", error);

    return NextResponse.json(
      { error: "Erreur lors de l’enregistrement du test 1." },
      { status: 500 }
    );
  }
}