"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InscriptionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    pseudo: "",
    username: "",
    password: "",
    age: "",
    educationLevel: "",
    aiUsageFrequency: "",
    consent: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.consent) {
      setError("Vous devez accepter l’utilisation anonyme de vos réponses.");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Une erreur est survenue.");
      return;
    }

    setSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.");

    setTimeout(() => {
      router.push("/");
    }, 1500);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-black placeholder:text-gray-400 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-2xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">
          Participation à l’étude
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Inscription participant
        </h1>

        <p className="text-slate-600 mb-8">
          Créez votre compte afin de participer à l’étude. Vous pourrez ensuite
          vous connecter avec votre identifiant et votre mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prénom ou pseudo
            </label>
            <input
              name="pseudo"
              value={form.pseudo}
              onChange={updateField}
              required
              type="text"
              className={inputClass}
              placeholder="Ex : Loïc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Identifiant
            </label>
            <input
              name="username"
              value={form.username}
              onChange={updateField}
              required
              type="text"
              className={inputClass}
              placeholder="Ex : loic22"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              name="password"
              value={form.password}
              onChange={updateField}
              required
              minLength={6}
              type="password"
              className={inputClass}
              placeholder="Choisissez un mot de passe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Âge
            </label>
            <input
              name="age"
              value={form.age}
              onChange={updateField}
              required
              type="number"
              min="15"
              max="50"
              className={inputClass}
              placeholder="Ex : 22"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Niveau d’étude
            </label>
            <select
              name="educationLevel"
              value={form.educationLevel}
              onChange={updateField}
              required
              className={inputClass}
            >
              <option value="">Sélectionner</option>
              <option value="COLLEGE">Collège</option>
              <option value="LYCEE">Lycée</option>
              <option value="BAC">Bac</option>
              <option value="BAC_2">Bac +2</option>
              <option value="BAC_3">Bac +3</option>
              <option value="BAC_5">Bac +5</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fréquence d’utilisation de l’IA
            </label>
            <select
              name="aiUsageFrequency"
              value={form.aiUsageFrequency}
              onChange={updateField}
              required
              className={inputClass}
            >
              <option value="">Sélectionner</option>
              <option value="JAMAIS">Jamais</option>
              <option value="RAREMENT">Rarement</option>
              <option value="PARFOIS">Parfois</option>
              <option value="SOUVENT">Souvent</option>
              <option value="TOUS_LES_JOURS">Tous les jours</option>
            </select>
          </div>

          <label className="flex gap-3 text-sm text-slate-600">
            <input
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={updateField}
              className="mt-1"
            />
            J’accepte que mes réponses soient utilisées anonymement dans le cadre
            de cette étude.
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl bg-green-50 border border-green-200 text-green-700 p-3 text-sm">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.01] hover:shadow-lg transition"
          >
            Créer mon compte
          </button>
        </form>
      </section>
    </main>
  );
}