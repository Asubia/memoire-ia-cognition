export default function FinPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-2xl w-full text-center bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">
          Test terminé
        </p>

        <h1 className="text-4xl font-extrabold mb-4 text-slate-900">
          Merci pour votre participation 🙏
        </h1>

        <p className="text-slate-600 leading-relaxed mb-6">
          Vos réponses ont bien été enregistrées. Elles contribueront à analyser
          l’impact de l’intelligence artificielle générative sur le
          raisonnement, l’autonomie cognitive et la prise de décision.
        </p>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-left mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Pourquoi cette étape est importante ?
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed">
            Les résultats collectés permettront de comparer les performances
            entre un raisonnement sans assistance et un raisonnement avec aide
            IA limitée, afin d’observer si l’IA agit comme un soutien, un
            amplificateur ou une source de dépendance cognitive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/mes-resultats"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Voir mes résultats
          </a>

          <a
            href="/tests"
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-black font-semibold hover:bg-slate-100 transition"
          >
            Retour aux tests
          </a>

          <a
            href="/"
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-black font-semibold hover:bg-slate-100 transition"
          >
            Retour à l’accueil
          </a>
        </div>
      </section>
    </main>
  );
}