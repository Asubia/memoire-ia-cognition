import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export default async function TestsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const role = cookieStore.get("role")?.value;

  if (!userId) redirect("/");
  if (role === "ADMIN") redirect("/admin/dashboard");

  const sessions = (await prisma.testSession.findMany({
    where: { userId: Number(userId) },
  })) as TestSessionLike[];

  const test1Done = sessions.some(
    (session: TestSessionLike) => session.testType === "TEST_1"
  );

  const test2Done = sessions.some(
    (session: TestSessionLike) => session.testType === "TEST_2"
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-3xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 text-center">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">
          Espace participant
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Sélection des tests
        </h1>

        <p className="text-slate-600 mb-8">
          Choisissez le test que vous souhaitez effectuer. Chaque test ne peut
          être réalisé qu’une seule fois.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="rounded-2xl bg-white/80 border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Test 1 — Sans IA
            </h2>

            <p className="text-slate-600 mb-5">
              Évalue votre raisonnement autonome, sans assistance.
            </p>

            {test1Done ? (
              <p className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-slate-700 font-medium">
                Vous avez déjà effectué ce test.
              </p>
            ) : (
              <a
                href="/test-1"
                className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition"
              >
                Commencer le test 1
              </a>
            )}
          </div>

          <div className="rounded-2xl bg-white/80 border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Test 2 — Avec IA
            </h2>

            <p className="text-slate-600 mb-5">
              Évalue votre raisonnement avec une aide IA limitée.
            </p>

            {test2Done ? (
              <p className="rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-slate-700 font-medium">
                Vous avez déjà effectué ce test.
              </p>
            ) : (
              <a
                href="/test-2"
                className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition"
              >
                Commencer le test 2
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <a
            href="/mes-resultats"
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-black font-semibold hover:bg-slate-100 transition text-center"
          >
            Voir mes résultats
          </a>

          <a
            href="/"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition text-center"
          >
            Retour à l’accueil
          </a>
        </div>
      </section>
    </main>
  );
}