export default function FinPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-xl w-full text-center bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10">

        <h1 className="text-4xl font-extrabold mb-4">
          Merci pour votre participation 🙏
        </h1>

        <p className="text-slate-600 mb-6">
          Vos réponses ont été enregistrées avec succès. Elles contribueront à
          l’analyse de l’impact de l’intelligence artificielle sur le
          raisonnement.
        </p>

        <a
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold"
        >
          Retour à l’accueil
        </a>
      </section>
    </main>
  );
}