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

function getPercent(session?: TestSessionWithAnswers) {
  if (!session || !session.total) return null;
  return Math.round((session.score / session.total) * 100);
}

function getTotalTime(session?: TestSessionWithAnswers) {
  if (!session) return 0;
  return session.answers.reduce(
    (sum: number, answer: AnswerLike) => sum + (answer.timeSpent ?? 0),
    0
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}min ${remainingSeconds}s`;
}

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

  const test1Percent = getPercent(test1);
  const test2Percent = getPercent(test2);

  const gap =
    test1Percent !== null && test2Percent !== null
      ? test2Percent - test1Percent
      : null;

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Espace participant
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Mes résultats
          </h1>

          <p className="text-slate-600 mt-3 max-w-3xl">
            Cette page récapitule vos performances aux différents tests, vos
            réponses et le temps passé sur chaque question.
          </p>
        </div>

        {displayedSessions.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
            <p className="text-slate-700">
              Vous n’avez encore effectué aucun test.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-5 mb-8">
              <ResultCard
                label="Score Test 1"
                value={test1Percent !== null ? `${test1Percent} %` : "-"}
                color="blue"
              />

              <ResultCard
                label="Score Test 2"
                value={test2Percent !== null ? `${test2Percent} %` : "-"}
                color="green"
              />

              <ResultCard
                label="Écart Test 2 - Test 1"
                value={gap !== null ? `${gap > 0 ? "+" : ""}${gap} %` : "-"}
                color={gap !== null && gap >= 0 ? "green" : "red"}
              />

              <ResultCard
                label="Aides IA utilisées"
                value={test2 ? `${test2.aiUsageCount ?? 0} / 10` : "-"}
                color="purple"
              />
            </div>

            {gap !== null && (
              <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl border border-white/50 p-6 mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Lecture rapide
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  {gap > 0
                    ? `Votre score est plus élevé au test avec IA de +${gap}%. Cela peut indiquer que l’assistance IA vous a aidé à structurer votre raisonnement.`
                    : gap < 0
                    ? `Votre score est plus faible au test avec IA de ${gap}%. Cela peut suggérer que l’aide IA n’a pas forcément amélioré votre raisonnement ou qu’elle a pu introduire une confusion.`
                    : "Votre score est identique entre les deux tests. L’assistance IA n’a donc pas modifié votre performance globale dans cette session."}
                </p>
              </div>
            )}

            <div className="space-y-8">
              {displayedSessions.map((session: TestSessionWithAnswers) => {
                const percent = getPercent(session) ?? 0;
                const totalTime = getTotalTime(session);

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

                      <div className="grid sm:grid-cols-3 gap-4 mt-4">
                        <MiniInfo
                          label="Score"
                          value={`${session.score} / ${session.total} (${percent} %)`}
                        />

                        <MiniInfo
                          label="Temps total"
                          value={formatTime(totalTime)}
                        />

                        <MiniInfo
                          label="Aides IA"
                          value={
                            session.testType === "TEST_2"
                              ? `${session.aiUsageCount ?? 0} / 10`
                              : "Non autorisée"
                          }
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100/70 text-slate-700">
                          <tr>
                            <th className="p-4">Question</th>
                            <th className="p-4">Votre réponse</th>
                            <th className="p-4">Bonne réponse</th>
                            <th className="p-4">Temps</th>
                            <th className="p-4">Résultat</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                          {session.answers.map((answer: AnswerLike) => (
                            <tr key={answer.id} className="text-slate-800">
                              <td className="p-4 max-w-md">
                                {answer.question}
                              </td>
                              <td className="p-4">{answer.userAnswer}</td>
                              <td className="p-4">{answer.correctAnswer}</td>
                              <td className="p-4">
                                {formatTime(answer.timeSpent ?? 0)}
                              </td>
                              <td className="p-4 font-semibold">
                                {answer.isCorrect ? (
                                  <span className="text-green-600">Correct</span>
                                ) : (
                                  <span className="text-red-600">Incorrect</span>
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
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="/tests"
            className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition text-center"
          >
            Retour aux tests
          </a>

          <a
            href="/"
            className="inline-block rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-black font-semibold hover:bg-slate-100 transition text-center"
          >
            Retour à l’accueil
          </a>
        </div>
      </section>
    </main>
  );
}

function ResultCard({
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
    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-extrabold mt-2 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}