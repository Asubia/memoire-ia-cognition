export default function FinPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-xl w-full text-center bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10">
        <h1 className="text-4xl font-extrabold mb-4">
          Merci pour votre participation 🙏
        </h1>

        <p className="text-slate-600 mb-8">
          Vos réponses ont été enregistrées avec succès. Elles contribueront à
          l’analyse de l’impact de l’intelligence artificielle sur le
          raisonnement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Retour à l’accueil
          </a>

          <a
            href="/mes-resultats"
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-black font-semibold hover:bg-slate-100 transition"
          >
            Voir mes résultats
          </a>
        </div>
      </section>
    </main>
  );
}