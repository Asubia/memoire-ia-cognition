import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-3xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 text-center">
        {userId && (
          <div className="flex justify-end mb-4">
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="rounded-xl bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </form>
          </div>
        )}

        <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">
          Mémoire de Master 2 MIAGE
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Étude expérimentale sur l’impact de l’
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            intelligence artificielle
          </span>
        </h1>

        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          Cette application permet de participer à une étude universitaire portant
          sur l’usage de l’intelligence artificielle, le raisonnement et
          l’autonomie cognitive des utilisateurs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/inscription"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition"
          >
            Commencer l’étude
          </a>

          <a
            href="/connexion"
            className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition"
          >
            Se connecter
          </a>
        </div>
      </section>
    </main>
  );
}