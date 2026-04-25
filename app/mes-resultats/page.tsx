import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AnswerLike = {
  id: number;
  sessionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
};

type TestSessionWithAnswers = {
  id: number;
  userId: number;
  testType: "TEST_1" | "TEST_2";
  score: number;
  total: number;
  aiUsageCount: number | null;
  startedAt: Date;
  completedAt: Date | null;
  answers: AnswerLike[];
};

export default async function MesResultatsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) redirect("/");

  const sessions = (await prisma.testSession.findMany({
    where: { userId: Number(userId) },
    include: { answers: true },
    orderBy: { completedAt: "desc" },
  })) as TestSessionWithAnswers[];

  const test1 = sessions.find(
    (session: TestSessionWithAnswers) => session.testType === "TEST_1"
  );

  const test2 = sessions.find(
    (session: TestSessionWithAnswers) => session.testType === "TEST_2"
  );

  const displayedSessions = [test1, test2].filter(
    (session): session is TestSessionWithAnswers => session !== undefined
  );

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Espace participant
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Mes résultats
          </h1>

          <p className="text-slate-600 mt-3">
            Retrouvez vos réponses, les bonnes réponses et votre score pour
            chaque test effectué.
          </p>
        </div>

        {displayedSessions.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
            <p className="text-slate-700">
              Vous n’avez encore effectué aucun test.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayedSessions.map((session: TestSessionWithAnswers) => {
              const percent = session.total
                ? Math.round((session.score / session.total) * 100)
                : 0;

              return (
                <div
                  key={session.id}
                  className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/50">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {session.testType === "TEST_1"
                        ? "Test 1 — Sans IA"
                        : "Test 2 — Avec IA"}
                    </h2>

                    <p className="text-slate-600 mt-2">
                      Score :{" "}
                      <span className="font-bold text-black">
                        {session.score} / {session.total} ({percent} %)
                      </span>
                    </p>

                    {session.testType === "TEST_2" && (
                      <p className="text-slate-600">
                        Aides IA utilisées :{" "}
                        <span className="font-bold text-black">
                          {session.aiUsageCount ?? 0}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100/70 text-slate-700">
                        <tr>
                          <th className="p-4">Question</th>
                          <th className="p-4">Votre réponse</th>
                          <th className="p-4">Bonne réponse</th>
                          <th className="p-4">Résultat</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {session.answers.map((answer: AnswerLike) => (
                          <tr key={answer.id} className="text-slate-800">
                            <td className="p-4">{answer.question}</td>
                            <td className="p-4">{answer.userAnswer}</td>
                            <td className="p-4">{answer.correctAnswer}</td>
                            <td className="p-4 font-semibold">
                              {answer.isCorrect ? (
                                <span className="text-green-600">Vrai</span>
                              ) : (
                                <span className="text-red-600">Faux</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <a
            href="/tests"
            className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Retour aux tests
          </a>
        </div>
      </section>
    </main>
  );
}