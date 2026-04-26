"use client";

import { useRouter } from "next/navigation";

export default function ConsignesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-3xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">

        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Consignes de l’étude
        </h1>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">

          <p>
            Cette étude vise à analyser l’impact de l’intelligence artificielle
            sur le raisonnement et l’autonomie cognitive.
          </p>

          <p>
            Vous allez passer <strong>deux tests</strong> :
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Test 1 (sans IA)</strong> : vous devez répondre seul,
              sans aucune aide extérieure (ni IA, ni Google, ni autre personne).
            </li>
            <li>
              <strong>Test 2 (avec IA)</strong> : vous pouvez utiliser l’aide
              de l’IA, mais de manière limitée.
            </li>
          </ul>

          <p>
            ⚠️ Il est important de respecter ces consignes afin de garantir
            la validité des résultats.
          </p>

          <p>
            Prenez le temps de réfléchir avant de répondre. Il n’y a pas de
            limite de temps, mais votre comportement est analysé.
          </p>

        </div>

        <button
          onClick={() => router.push("/tests")}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold"
        >
          J’ai compris, commencer les tests
        </button>

      </section>
    </main>
  );
}