import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminCharts from "@/components/AdminCharts";

type TestSessionLike = {
  id: number;
  userId: number;
  testType: "TEST_1" | "TEST_2";
  score: number;
  total: number;
  aiUsageCount: number | null;
  startedAt: Date;
  completedAt: Date | null;
};

type UserWithSessions = {
  id: number;
  pseudo: string;
  username: string;
  passwordHash: string;
  age: number;
  educationLevel: string;
  aiUsageFrequency: string;
  role: string;
  createdAt: Date;
  sessions: TestSessionLike[];
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "ADMIN") redirect("/");

  const users = (await prisma.user.findMany({
    where: { role: "PARTICIPANT" },
    include: { sessions: true },
    orderBy: { createdAt: "desc" },
  })) as UserWithSessions[];

  const rows = users.map((user) => {
    const test1 = user.sessions.find((s) => s.testType === "TEST_1");
    const test2 = user.sessions.find((s) => s.testType === "TEST_2");

    const test1Percent =
      test1 && test1.total ? Math.round((test1.score / test1.total) * 100) : 0;

    const test2Percent =
      test2 && test2.total ? Math.round((test2.score / test2.total) * 100) : 0;

    const gap = test2Percent - test1Percent;

    return {
      participant: user.pseudo,
      test1: test1Percent,
      test2: test2Percent,
      gap,
      aiUsage: test2?.aiUsageCount ?? 0,
      aiUsageFrequency: user.aiUsageFrequency,
      hasBothTests: Boolean(test1 && test2),
    };
  });

  const completedRows = rows.filter((row) => row.hasBothTests);

  const average = (values: number[]) => {
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const avgTest1 = average(completedRows.map((row) => row.test1));
  const avgTest2 = average(completedRows.map((row) => row.test2));
  const avgGap = average(completedRows.map((row) => row.gap));
  const avgAiUsage = average(completedRows.map((row) => row.aiUsage));

  const improvedCount = completedRows.filter((row) => row.gap > 0).length;
  const stableCount = completedRows.filter((row) => row.gap === 0).length;
  const decreasedCount = completedRows.filter((row) => row.gap < 0).length;

  const improvementRate =
    completedRows.length === 0
      ? 0
      : Math.round((improvedCount / completedRows.length) * 100);

  const comparisonData = [
    { name: "Test 1", score: avgTest1 },
    { name: "Test 2", score: avgTest2 },
  ];

  const gapDistributionData = [
    { name: "Progression", value: improvedCount },
    { name: "Stable", value: stableCount },
    { name: "Baisse", value: decreasedCount },
  ];

  const correlationData = completedRows.map((row) => ({
    participant: row.participant,
    aiUsage: row.aiUsage,
    scoreTest2: row.test2,
  }));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-300">
              Panel administrateur
            </p>

            <h1 className="text-4xl font-extrabold text-white mt-2">
              Tableau de bord de l’étude IA
            </h1>

            <p className="text-slate-300 mt-3 max-w-3xl">
              Analyse claire des performances entre le test sans IA et le test
              avec assistance IA limitée.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/api/admin/export"
              className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              Exporter CSV
            </a>

            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="rounded-xl bg-red-500 px-5 py-3 text-white font-semibold hover:bg-red-600 transition"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard label="Participants" value={`${users.length}`} />
          <StatCard label="Moyenne Test 1" value={`${avgTest1} %`} color="blue" />
          <StatCard label="Moyenne Test 2" value={`${avgTest2} %`} color="green" />
          <StatCard
            label="Gain moyen"
            value={`${avgGap > 0 ? "+" : ""}${avgGap} %`}
            color={avgGap >= 0 ? "green" : "red"}
          />
          <StatCard label="Usage moyen IA" value={`${avgAiUsage} / 10`} color="purple" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Synthèse scientifique
          </h2>

          <p className="text-slate-600 mt-3 leading-relaxed">
            {completedRows.length === 0
              ? "Aucune donnée complète n’est encore disponible."
              : `${improvementRate}% des participants ont amélioré leur score avec l’assistance IA. Le gain moyen observé est de ${avgGap > 0 ? "+" : ""}${avgGap}%. Ces résultats permettent d’observer si l’IA agit comme un soutien au raisonnement ou si son usage reste variable selon les profils.`}
          </p>
        </div>

        <AdminCharts
          comparisonData={comparisonData}
          gapDistributionData={gapDistributionData}
          correlationData={correlationData}
        />

        <div className="mt-8 rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Résultats par participant
            </h2>
            <p className="text-slate-500 mt-1">
              Vue simplifiée pour comparer rapidement les performances.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-4">Participant</th>
                  <th className="p-4">Test 1</th>
                  <th className="p-4">Test 2</th>
                  <th className="p-4">Écart</th>
                  <th className="p-4">Aides IA</th>
                  <th className="p-4">Usage déclaré</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr key={row.participant} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">
                      {row.participant}
                    </td>
                    <td className="p-4 text-slate-700">{row.test1} %</td>
                    <td className="p-4 text-slate-700">{row.test2} %</td>
                    <td className="p-4 font-bold">
                      <span
                        className={
                          row.gap > 0
                            ? "text-green-600"
                            : row.gap < 0
                            ? "text-red-600"
                            : "text-slate-600"
                        }
                      >
                        {row.gap > 0 ? "+" : ""}
                        {row.gap} %
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">{row.aiUsage} / 10</td>
                    <td className="p-4 text-slate-700">{row.aiUsageFrequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: string;
  color?: "slate" | "blue" | "green" | "red" | "purple";
}) {
  const colors = {
    slate: "text-slate-900",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-4xl font-extrabold mt-2 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}