"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_AI_USAGE = 6;

const questions = [
  {
    question:
      "Une IA affirme : 'Tous les étudiants qui utilisent l’IA réussissent mieux.' Quelle est la meilleure analyse ?",
    aiHelp:
      "Cette affirmation semble générale. Il faudrait vérifier les données et les conditions avant de conclure.",
    options: [
      "C’est forcément vrai",
      "C’est une généralisation qui doit être vérifiée",
      "C’est faux dans tous les cas",
      "C’est une preuve scientifique",
    ],
    answer: "C’est une généralisation qui doit être vérifiée",
  },
  {
    question: "Une réponse IA est bien écrite mais ne cite aucune source. Que faire ?",
    aiHelp:
      "Même si une réponse est claire, elle doit être vérifiée avec des sources fiables.",
    options: [
      "La croire directement",
      "La vérifier avec d’autres sources",
      "La copier",
      "L’ignorer totalement",
    ],
    answer: "La vérifier avec d’autres sources",
  },
  {
    question: "Une IA donne une réponse très rapide. Cela signifie :",
    aiHelp:
      "La rapidité ne garantit pas la fiabilité ou la qualité du raisonnement.",
    options: [
      "Qu’elle est forcément correcte",
      "Qu’elle est fiable",
      "Que la vitesse ne garantit pas la qualité",
      "Qu’elle remplace l’analyse humaine",
    ],
    answer: "Que la vitesse ne garantit pas la qualité",
  },
  {
    question: "Pourquoi faut-il garder un esprit critique face à l’IA ?",
    aiHelp:
      "Les IA peuvent produire des erreurs ou des biais, même si elles semblent convaincantes.",
    options: [
      "Parce qu’elle est lente",
      "Parce qu’elle peut se tromper",
      "Parce qu’elle est inutile",
      "Parce qu’elle est difficile à utiliser",
    ],
    answer: "Parce qu’elle peut se tromper",
  },
  {
    question: "Si tous les A sont B et que certains B sont C, alors :",
    aiHelp:
      "Il faut faire attention aux relations logiques : 'certains' ne signifie pas 'tous'.",
    options: [
      "Tous les A sont C",
      "Certains A peuvent être C",
      "Aucun A n’est C",
      "On ne peut pas conclure",
    ],
    answer: "Certains A peuvent être C",
  },
  {
    question:
      "Un étudiant obtient une bonne réponse grâce à l’IA sans comprendre. Quel est le risque principal ?",
    aiHelp:
      "Comprendre le raisonnement est essentiel pour développer ses compétences.",
    options: [
      "Il devient expert",
      "Il ne développe pas ses compétences",
      "Il gagne en autonomie",
      "Il apprend plus vite",
    ],
    answer: "Il ne développe pas ses compétences",
  },
  {
    question:
      "Une IA propose deux solutions différentes au même problème. Que faire ?",
    aiHelp:
      "Comparer les solutions et analyser leur cohérence est essentiel.",
    options: [
      "Choisir au hasard",
      "Analyser les deux réponses",
      "Prendre la première",
      "Ignorer les deux",
    ],
    answer: "Analyser les deux réponses",
  },
  {
    question:
      "Une IA affirme : '2 + 2 = 5 car dans certains systèmes alternatifs c’est possible.' Que faire ?",
    aiHelp:
      "Même si une explication semble complexe, il faut vérifier les bases logiques.",
    options: ["Accepter", "Vérifier les bases mathématiques", "Copier", "Ignorer"],
    answer: "Vérifier les bases mathématiques",
  },
  {
    question: "Une IA invente une source crédible mais fausse. Cela s’appelle :",
    aiHelp:
      "Les IA peuvent générer des informations plausibles mais incorrectes.",
    options: ["Une erreur logique", "Une hallucination", "Une preuve", "Une source fiable"],
    answer: "Une hallucination",
  },
  {
    question: "Pourquoi une IA peut-elle donner une mauvaise réponse ?",
    aiHelp:
      "Les IA apprennent à partir de données qui peuvent contenir des erreurs ou des biais.",
    options: [
      "Parce qu’elle est lente",
      "Parce qu’elle ne réfléchit pas comme un humain",
      "Parce qu’elle est parfaite",
      "Parce qu’elle est humaine",
    ],
    answer: "Parce qu’elle ne réfléchit pas comme un humain",
  },
  {
    question:
      "Un utilisateur suit toujours les réponses de l’IA sans réfléchir. Cela montre :",
    aiHelp:
      "L’absence d’analyse critique peut entraîner une dépendance cognitive.",
    options: [
      "Une autonomie forte",
      "Une dépendance cognitive",
      "Une intelligence élevée",
      "Une capacité critique élevée",
    ],
    answer: "Une dépendance cognitive",
  },
  {
    question: "Quel est le rôle idéal de l’IA dans un processus de réflexion ?",
    aiHelp:
      "L’IA doit être un outil d’aide, pas un remplacement du raisonnement.",
    options: [
      "Remplacer l’utilisateur",
      "Aider à réfléchir",
      "Donner uniquement des réponses",
      "Décider à la place de l’utilisateur",
    ],
    answer: "Aider à réfléchir",
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
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[current];

  async function askAi() {
    if (aiUsageCount >= MAX_AI_USAGE) return;

    setShowAiHelp(true);
    setAiUsageCount((prev) => prev + 1);

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

    setAiInteractions((prev) => [
      ...prev,
      {
        question: question.question,
        prompt: "Demande d’aide IA",
        aiResponse: data.result,
      },
    ]);
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

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setQuestionStartTime(Date.now());
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
          disabled={aiUsageCount >= MAX_AI_USAGE}
          className="mb-4 rounded-xl border border-slate-300 bg-white/80 backdrop-blur px-4 py-2 text-black font-semibold hover:bg-slate-100 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💡 Demander l’aide de l’IA
        </button>

        {showAiHelp && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <p className="text-blue-900">{aiInteractions[aiInteractions.length - 1]?.aiResponse}</p>
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

        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold"
        >
          {current === questions.length - 1
            ? "Terminer le test"
            : "Question suivante"}
        </button>
      </section>
    </main>
  );
}