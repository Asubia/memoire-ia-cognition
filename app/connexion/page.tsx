"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  function updateField(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur de connexion");
      return;
    }

    if (data.user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/consignes");
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-black bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            placeholder="Identifiant"
            className={inputClass}
            value={form.username}
            onChange={updateField}
            required
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className={inputClass}
            value={form.password}
            onChange={updateField}
            required
          />

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4"
            />
            Afficher le mot de passe
          </label>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:scale-[1.02] transition">
            Se connecter
          </button>
        </form>
      </section>
    </main>
  );
}