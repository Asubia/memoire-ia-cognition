import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type AnswerLike = {
  timeSpent: number;
};

type TestSessionLike = {
  testType: "TEST_1" | "TEST_2";
  score: number;
  total: number;
  aiUsageCount: number | null;
  answers: AnswerLike[];
};

type UserWithSessions = {
  pseudo: string;
  username: string;
  age: number;
  educationLevel: string;
  aiUsageFrequency: string;
  createdAt: Date;
  sessions: TestSessionLike[];
};

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function totalTime(session?: TestSessionLike) {
  if (!session) return "";
  return session.answers.reduce(
    (sum, answer) => sum + (answer.timeSpent ?? 0),
    0
  );
}

function percent(session?: TestSessionLike) {
  if (!session || !session.total) return "";
  return Math.round((session.score / session.total) * 100);
}

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = (await prisma.user.findMany({
    where: { role: "PARTICIPANT" },
    include: {
      sessions: {
        include: {
          answers: {
            select: {
              timeSpent: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as UserWithSessions[];

  const rows = users.map((user) => {
    const test1 = user.sessions.find((s) => s.testType === "TEST_1");
    const test2 = user.sessions.find((s) => s.testType === "TEST_2");

    const test1Percent = percent(test1);
    const test2Percent = percent(test2);

    const gap =
      typeof test1Percent === "number" && typeof test2Percent === "number"
        ? test2Percent - test1Percent
        : "";

    return [
      user.pseudo,
      user.username,
      user.age,
      user.educationLevel,
      user.aiUsageFrequency,

      test1?.score ?? "",
      test1?.total ?? "",
      test1Percent,
      totalTime(test1),

      test2?.score ?? "",
      test2?.total ?? "",
      test2Percent,
      totalTime(test2),

      test2?.aiUsageCount ?? "",
      gap,
      user.createdAt.toISOString(),
    ];
  });

  const headers = [
    "pseudo",
    "identifiant",
    "age",
    "niveau_etude",
    "frequence_usage_ia",

    "score_test_1",
    "total_test_1",
    "score_test_1_pourcentage",
    "temps_total_test_1_secondes",

    "score_test_2",
    "total_test_2",
    "score_test_2_pourcentage",
    "temps_total_test_2_secondes",

    "nombre_aides_ia",
    "ecart_test2_test1_pourcentage",
    "date_inscription",
  ];

  const csv = [
    headers.map(escapeCsv).join(";"),
    ...rows.map((row) => row.map(escapeCsv).join(";")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="resultats-etude-ia.csv"',
    },
  });
}