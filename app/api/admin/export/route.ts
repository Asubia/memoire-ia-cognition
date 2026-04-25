import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "PARTICIPANT" },
    include: { sessions: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = users.map((user) => {
    const test1 = user.sessions.find((s) => s.testType === "TEST_1");
    const test2 = user.sessions.find((s) => s.testType === "TEST_2");

    const test1Percent =
      test1 && test1.total ? Math.round((test1.score / test1.total) * 100) : "";

    const test2Percent =
      test2 && test2.total ? Math.round((test2.score / test2.total) * 100) : "";

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
      test1Percent,
      test2Percent,
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
    "score_test_1_pourcentage",
    "score_test_2_pourcentage",
    "nombre_aides_ia",
    "ecart_test2_test1",
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