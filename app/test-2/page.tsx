"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_AI_USAGE = 10;

const questions = [
  {
    question: "Une suite suit le modèle : 3, 6, 12, 24, ?",
    aiHelp: "Observe comment chaque terme évolue par rapport au précédent.",
    options: ["36", "48", "30", "60"],
    answer: "48",
  },
  {
    question: "Si tous les carrés sont des rectangles, alors :",
    aiHelp: "Réfléchis à la relation d’inclusion entre les ensembles.",
    options: [
      "Tous les rectangles sont des carrés",
      "Certains rectangles sont des carrés",
      "Aucun rectangle n’est un carré",
      "On ne peut pas savoir",
    ],
    answer: "Certains rectangles sont des carrés",
  },
  {
    question:
      "Un objet coûte 80€ après une réduction de 20%. Quel était son prix initial ?",
    aiHelp: "Attention : la réduction s’applique sur le prix de départ.",
    options: ["100€", "96€", "90€", "120€"],
    answer: "100€",
  },
  {
    question:
      "Si 5 machines produisent 5 pièces en 5 minutes, combien de pièces produisent 10 machines en 5 minutes ?",
    aiHelp: "Raisonne en termes de productivité individuelle.",
    options: ["5", "10", "20", "50"],
    answer: "10",
  },
  {
    question: "Quel mot ne correspond pas aux autres ?",
    aiHelp: "Cherche la catégorie commune.",
    options: ["Triangle", "Carré", "Cercle", "Voiture"],
    answer: "Voiture",
  },
  {
    question: "Si A → B et B → C, alors :",
    aiHelp: "Applique la transitivité logique.",
    options: ["A → C", "C → A", "A ↔ C", "Impossible"],
    answer: "A → C",
  },
  {
    question: "Un prix augmente de 10% puis diminue de 10%. Résultat ?",
    aiHelp: "Les pourcentages ne s’appliquent pas sur la même base.",
    options: ["Même prix", "Plus élevé", "Plus bas", "Impossible"],
    answer: "Plus bas",
  },
  {
    question: "Combien de diagonales possède un polygone à 6 côtés ?",
    aiHelp: "Utilise la formule liée au nombre de sommets.",
    options: ["6", "9", "12", "15"],
    answer: "9",
  },
  {
    question: "Si f(x) = 2x + 3 et f(x) = 11, alors x = ?",
    aiHelp: "Résous une équation simple.",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question:
      "Un événement a une probabilité de 0,2. Quelle est la probabilité qu’il ne se produise pas ?",
    aiHelp: "Utilise la complémentarité.",
    options: ["0,2", "0,8", "1", "0,5"],
    answer: "0,8",
  },
  {
    question:
      "Si une population double tous les 10 ans, par combien est-elle multipliée en 20 ans ?",
    aiHelp: "Attention à l’effet exponentiel.",
    options: ["2", "3", "4", "10"],
    answer: "4",
  },
  {
    question:
      "Une suite vérifie u(n+1) = u(n) + 3 avec u(0)=2. Quelle est la valeur de u(3) ?",
    aiHelp: "Calcule étape par étape.",
    options: ["8", "9", "10", "11"],
    answer: "11",
  },
  {
    question: "Si une fonction est dérivable, alors elle est :",
    aiHelp: "Pense aux propriétés mathématiques fondamentales.",
    options: ["Continue", "Discontinue", "Constante", "Bornée"],
    answer: "Continue",
  },
  {
    question: "Une variable suit une distribution uniforme. Que signifie cela ?",
    aiHelp: "Réfléchis à la répartition des probabilités.",
    options: [
      "Toutes les valeurs sont équiprobables",
      "Une valeur domine",
      "Distribution normale",
      "Distribution exponentielle",
    ],
    answer: "Toutes les valeurs sont équiprobables",
  },
  {
    question:
      "Si une hypothèse implique une conclusion fausse, que peut-on dire de l’hypothèse ?",
    aiHelp: "Raisonne en logique contraposée.",
    options: [
      "Elle est vraie",
      "Elle est fausse",
      "On ne peut pas conclure",
      "Elle est partiellement vraie",
    ],
    answer: "Elle est fausse",
  },
  {
    question:
      "Dans un raisonnement scientifique, une corrélation forte implique-t-elle une causalité ?",
    aiHelp: "Fais la distinction entre relation et cause.",
    options: ["Oui", "Non", "Toujours", "Seulement parfois"],
    answer: "Non",
  },
  {
    question:
      "Un algorithme donne toujours une réponse rapide mais parfois incorrecte. Que peut-on dire ?",
    aiHelp: "Analyse le compromis entre performance et fiabilité.",
    options: [
      "Il est optimal",
      "Il privilégie la vitesse",
      "Il est inutile",
      "Il est parfait",
    ],
    answer: "Il privilégie la vitesse",
  },
  {
    question:
      "Si une conclusion dépend fortement des hypothèses initiales, que faut-il faire ?",
    aiHelp: "Réfléchis à la robustesse d’un modèle.",
    options: [
      "Ignorer les hypothèses",
      "Tester différentes hypothèses",
      "Garder une seule hypothèse",
      "Arrêter l’analyse",
    ],
    answer: "Tester différentes hypothèses",
  },
  {
    question:
      "Une IA fournit une réponse plausible mais non vérifiable. Quel est le principal risque ?",
    aiHelp: "Pense au concept de confiance excessive.",
    options: [
      "Gain de temps",
      "Erreur acceptée comme vraie",
      "Amélioration de la réflexion",
      "Aucun risque",
    ],
    answer: "Erreur acceptée comme vraie",
  },
  {
    question:
      "Dans un modèle prédictif, que signifie un surapprentissage (overfitting) ?",
    aiHelp: "Réfléchis à la capacité de généralisation.",
    options: [
      "Le modèle apprend trop les données d’entraînement",
      "Le modèle ne fonctionne pas",
      "Le modèle est parfait",
      "Le modèle est trop simple",
    ],
    answer: "Le modèle apprend trop les données d’entraînement",
  },
];

export default function Test2Page() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
  const [aiInteractions, setAiInteractions] = useState<any[]>([]);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsedForCurrentQuestion, setAiUsedForCurrentQuestion] =
    useState(false);
  const [currentAiResponse, setCurrentAiResponse] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[current];

  async function askAi() {
    if (aiUsageCount >= MAX_AI_USAGE || aiUsedForCurrentQuestion || aiLoading) {
      return;
    }

    setShowAiHelp(true);
    setAiLoading(true);
    setCurrentAiResponse("");
    setAiUsageCount((prev) => prev + 1);
    setAiUsedForCurrentQuestion(true);

    try {
      const res = await fetch("/api/ai-help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.question,
        }),
      });

      const data = await res.json();

      const aiResponse =
        data.result ||
        "L’IA n’a pas pu répondre. Essayez d’analyser la logique de la question par vous-même.";

      setCurrentAiResponse(aiResponse);

      setAiInteractions((prev) => [
        ...prev,
        {
          questionIndex: current + 1,
          question: question.question,
          prompt: "Demande d’aide IA",
          aiResponse: aiResponse,
          usedAt: new Date().toISOString(),
        },
      ]);
    } catch {
      const fallback =
        "Erreur lors de l’appel à l’IA. Essayez de raisonner étape par étape à partir des informations données.";

      setCurrentAiResponse(fallback);

      setAiInteractions((prev) => [
        ...prev,
        {
          questionIndex: current + 1,
          question: question.question,
          prompt: "Demande d’aide IA",
          aiResponse: fallback,
          usedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleNext() {
    if (!selected) return;

    const isCorrect = selected === question.answer;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const newAnswers = [
      ...answers,
      {
        question: question.question,
        userAnswer: selected,
        correctAnswer: question.answer,
        isCorrect,
        timeSpent,
      },
    ];

    setAnswers(newAnswers);
    setSelected("");
    setShowAiHelp(false);
    setCurrentAiResponse("");

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setQuestionStartTime(Date.now());
      setAiUsedForCurrentQuestion(false);
      return;
    }

    setLoading(true);
    setError("");

    const score = newAnswers.filter((answer) => answer.isCorrect).length;

    const response = await fetch("/api/test-2/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: newAnswers,
        score,
        total: questions.length,
        aiUsageCount,
        aiInteractions,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erreur lors de l’enregistrement du test.");
      setLoading(false);
      return;
    }

    router.push("/fin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-3xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">
          Test 2 — Avec IA
        </p>

        <h1 className="text-3xl font-extrabold mb-4">
          Raisonnement assisté
        </h1>

        <div className="mb-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">Utilisations IA</p>
            <p className="text-xl font-bold text-black">
              {aiUsageCount} / {MAX_AI_USAGE}
            </p>
          </div>

          <div className="rounded-xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">Utilisations restantes</p>
            <p className="text-xl font-bold text-black">
              {MAX_AI_USAGE - aiUsageCount}
            </p>
          </div>
        </div>

        {aiUsageCount >= MAX_AI_USAGE && (
          <p className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 p-3 text-sm font-medium">
            Limite d’utilisation de l’IA atteinte.
          </p>
        )}

        <div className="bg-slate-100 rounded-xl p-4 mb-6">
          <p className="text-slate-500 mb-2">
            Question {current + 1} / {questions.length}
          </p>

          <h2 className="text-lg font-semibold text-black">
            {question.question}
          </h2>
        </div>

        <button
          onClick={askAi}
          disabled={
            aiUsageCount >= MAX_AI_USAGE ||
            aiUsedForCurrentQuestion ||
            aiLoading
          }
          className="mb-4 rounded-xl border border-slate-300 bg-white/80 backdrop-blur px-4 py-2 text-black font-semibold hover:bg-slate-100 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {aiLoading
            ? "L’IA réfléchit..."
            : aiUsedForCurrentQuestion
            ? "Aide IA déjà utilisée pour cette question"
            : "💡 Demander l’aide de l’IA"}
        </button>

        {showAiHelp && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Aide de l’IA :
            </p>
            <p className="text-blue-900">
              {aiLoading ? "L’IA prépare une piste de réflexion..." : currentAiResponse}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-full px-4 py-3 rounded-xl border transition ${
                selected === option
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-black hover:bg-slate-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleNext}
          disabled={!selected || loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Enregistrement..."
            : current === questions.length - 1
            ? "Terminer le test"
            : "Question suivante"}
        </button>
      </section>
    </main>
  );
}