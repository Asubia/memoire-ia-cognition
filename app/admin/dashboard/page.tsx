import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminCharts from "@/components/AdminCharts";
import type { TestSession, User } from "@prisma/client";

type UserWithSessions = User & {
  sessions: TestSession[];
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "ADMIN") {
    redirect("/");
  }

  const users: UserWithSessions[] = await prisma.user.findMany({
    where: { role: "PARTICIPANT" },
    include: { sessions: true },
    orderBy: { createdAt: "desc" },
  });

  const allSessions: TestSession[] = users.flatMap(
  (user: UserWithSessions) => user.sessions
);
  const test1Sessions = allSessions.filter(
    (s: TestSession) => s.testType === "TEST_1"
  );

  const test2Sessions = allSessions.filter(
    (s: TestSession) => s.testType === "TEST_2"
  );

  const average = (sessions: typeof allSessions) => {
    if (sessions.length === 0) return 0;

    const total = sessions.reduce((sum, s) => {
      if (!s.total || s.total === 0) return sum;
      return sum + (s.score / s.total) * 100;
    }, 0);

    return Math.round(total / sessions.length);
  };

  const avgTest1 = average(test1Sessions);
  const avgTest2 = average(test2Sessions);

  const avgAiUsage =
    test2Sessions.length === 0
      ? 0
      : Math.round(
          test2Sessions.reduce((sum, s) => sum + (s.aiUsageCount ?? 0), 0) /
            test2Sessions.length
        );

  const comparisonData = [
    { name: "Test 1", moyenne: avgTest1 },
    { name: "Test 2", moyenne: avgTest2 },
  ];

  const userProgressData = users.map((user) => {
    const test1 = user.sessions.find((s) => s.testType === "TEST_1");
    const test2 = user.sessions.find((s) => s.testType === "TEST_2");

    return {
      participant: user.pseudo,
      test1:
        test1 && test1.total
          ? Math.round((test1.score / test1.total) * 100)
          : 0,
      test2:
        test2 && test2.total
          ? Math.round((test2.score / test2.total) * 100)
          : 0,
    };
  });

  const correlationData = users
    .map((user) => {
      const test2 = user.sessions.find((s) => s.testType === "TEST_2");
      if (!test2 || !test2.total) return null;

      return {
        participant: user.pseudo,
        aiUsage: test2.aiUsageCount ?? 0,
        scoreTest2: Math.round((test2.score / test2.total) * 100),
      };
    })
    .filter(
      (
        item
      ): item is {
        participant: string;
        aiUsage: number;
        scoreTest2: number;
      } => item !== null
    );

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Panel administrateur
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Tableau de bord de l’
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                étude IA
              </span>
            </h1>

            <div className="flex gap-3">
              <a
                href="/api/admin/export"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition"
              >
                Exporter CSV
              </a>

              <form action="/api/logout" method="POST">
                <button
                  type="submit"
                  className="rounded-xl bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
                >
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>

          <p className="text-slate-600 mt-3">
            Visualisation des résultats collectés pour comparer le test sans IA
            et le test avec assistance IA.
          </p>

          <p className="text-slate-500 mt-2 italic">
            Analyse comparative des performances avec et sans assistance IA.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
            <p className="text-slate-500 text-sm">Participants</p>
            <p className="text-4xl font-extrabold text-slate-900 mt-2">
              {users.length}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
            <p className="text-slate-500 text-sm">Moyenne Test 1</p>
            <p className="text-4xl font-extrabold text-blue-600 mt-2">
              {avgTest1} %
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
            <p className="text-slate-500 text-sm">Moyenne Test 2</p>
            <p className="text-4xl font-extrabold text-green-600 mt-2">
              {avgTest2} %
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
            <p className="text-slate-500 text-sm">Usage moyen IA</p>
            <p className="text-4xl font-extrabold text-purple-600 mt-2">
              {avgAiUsage}
            </p>
          </div>
        </div>

        <AdminCharts
          comparisonData={comparisonData}
          userProgressData={userProgressData}
          correlationData={correlationData}
        />

        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/50">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Résultats par participant
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100/70 text-slate-700">
                <tr>
                  <th className="p-4">Participant</th>
                  <th className="p-4">Âge</th>
                  <th className="p-4">Usage IA déclaré</th>
                  <th className="p-4">Test 1</th>
                  <th className="p-4">Test 2</th>
                  <th className="p-4">Aides IA</th>
                  <th className="p-4">Écart</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {users.map((user) => {
                  const test1 = user.sessions.find((s) => s.testType === "TEST_1");
                  const test2 = user.sessions.find((s) => s.testType === "TEST_2");

                  const test1Percent =
                    test1 && test1.total
                      ? Math.round((test1.score / test1.total) * 100)
                      : null;

                  const test2Percent =
                    test2 && test2.total
                      ? Math.round((test2.score / test2.total) * 100)
                      : null;

                  const gap =
                    test1Percent !== null && test2Percent !== null
                      ? test2Percent - test1Percent
                      : null;

                  return (
                    <tr
                      key={user.id}
                      className="text-slate-800 hover:bg-white/60 transition"
                    >
                      <td className="p-4 font-medium">{user.pseudo}</td>
                      <td className="p-4">{user.age}</td>
                      <td className="p-4">{user.aiUsageFrequency}</td>
                      <td className="p-4">
                        {test1Percent !== null ? `${test1Percent} %` : "-"}
                      </td>
                      <td className="p-4">
                        {test2Percent !== null ? `${test2Percent} %` : "-"}
                      </td>
                      <td className="p-4">{test2 ? test2.aiUsageCount ?? 0 : "-"}</td>
                      <td className="p-4 font-semibold">
                        {gap !== null ? (
                          <span className={gap > 0 ? "text-green-600" : "text-red-600"}>
                            {gap > 0 ? "+" : ""}
                            {gap} %
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}