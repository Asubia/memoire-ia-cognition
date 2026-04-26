"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_AI_USAGE = 6;

const questions = [
  {
    question:
      "Une personne lit une information sur Internet sans vérifier la source. Quel est le comportement le plus prudent ?",
    aiHelp:
      "Il faut distinguer une affirmation d’une preuve. Une information fiable doit pouvoir être vérifiée.",
    options: [
      "La partager directement",
      "La vérifier avec une source fiable",
      "La croire si elle est bien écrite",
      "L’ignorer sans réfléchir",
    ],
    answer: "La vérifier avec une source fiable",
  },
  {
    question:
      "Si une solution semble rapide et facile, cela signifie-t-il forcément qu’elle est correcte ?",
    aiHelp:
      "La rapidité d’une solution ne garantit pas sa validité. Il faut vérifier le raisonnement.",
    options: [
      "Oui, toujours",
      "Non, il faut vérifier",
      "Oui, si elle est courte",
      "Non, une solution rapide est toujours fausse",
    ],
    answer: "Non, il faut vérifier",
  },
  {
    question:
      "Une IA donne une réponse très convaincante, mais sans justification. Quelle attitude adopter ?",
    aiHelp:
      "Une réponse convaincante peut être fausse. Il faut chercher les raisons qui la soutiennent.",
    options: [
      "L’accepter directement",
      "Demander ou chercher une justification",
      "La copier telle quelle",
      "La considérer comme une preuve",
    ],
    answer: "Demander ou chercher une justification",
  },
  {
    question:
      "Dans une décision importante, quel est le rôle idéal d’un outil numérique ?",
    aiHelp:
      "Un outil peut aider à organiser les informations, mais la décision doit rester réfléchie.",
    options: [
      "Décider à la place de l’utilisateur",
      "Aider à comparer les options",
      "Remplacer totalement la réflexion",
      "Donner toujours la bonne réponse",
    ],
    answer: "Aider à comparer les options",
  },
  {
    question:
      "Si deux personnes ont des avis opposés sur un sujet, que faut-il faire pour mieux comprendre ?",
    aiHelp:
      "Comparer les arguments permet souvent de mieux évaluer une situation.",
    options: [
      "Choisir l’avis le plus populaire",
      "Comparer les arguments et les preuves",
      "Ignorer les deux avis",
      "Croire la personne la plus sûre d’elle",
    ],
    answer: "Comparer les arguments et les preuves",
  },
  {
    question:
      "Une personne réussit un exercice grâce à une aide, mais ne sait pas l’expliquer. Quel est le principal problème ?",
    aiHelp:
      "Réussir une tâche ne signifie pas toujours comprendre le raisonnement.",
    options: [
      "Elle a forcément compris",
      "Elle risque de ne pas savoir refaire seule",
      "Elle devient plus autonome",
      "Elle n’a plus besoin d’apprendre",
    ],
    answer: "Elle risque de ne pas savoir refaire seule",
  },
  {
    question:
      "Pourquoi est-il important de reformuler une réponse avec ses propres mots ?",
    aiHelp:
      "Reformuler permet de vérifier si l’on a réellement compris.",
    options: [
      "Pour écrire plus vite",
      "Pour vérifier sa compréhension",
      "Pour éviter de réfléchir",
      "Pour rendre la réponse plus longue",
    ],
    answer: "Pour vérifier sa compréhension",
  },
  {
    question:
      "Si une information est répétée plusieurs fois sur différents sites, cela signifie-t-il forcément qu’elle est vraie ?",
    aiHelp:
      "La répétition d’une information ne suffit pas. Il faut vérifier l’origine et la fiabilité.",
    options: [
      "Oui, forcément",
      "Non, elle doit être vérifiée",
      "Oui, si elle apparaît souvent",
      "Non, une information répétée est toujours fausse",
    ],
    answer: "Non, elle doit être vérifiée",
  },
  {
    question:
      "Une IA propose une réponse qui semble correcte, mais vous avez un doute. Que faire ?",
    aiHelp:
      "Le doute peut être utile. Il pousse à vérifier et à analyser.",
    options: [
      "Ignorer le doute",
      "Vérifier la réponse",
      "Prendre la réponse directement",
      "Changer de sujet",
    ],
    answer: "Vérifier la réponse",
  },
  {
    question:
      "Quel comportement montre le plus d’autonomie cognitive ?",
    aiHelp:
      "L’autonomie consiste à utiliser une aide sans abandonner son propre jugement.",
    options: [
      "Suivre l’IA sans réfléchir",
      "Comparer l’aide avec son propre raisonnement",
      "Demander toutes les réponses à l’IA",
      "Ne jamais vérifier",
    ],
    answer: "Comparer l’aide avec son propre raisonnement",
  },
  {
    question:
      "Une personne utilise l’IA pour comprendre une notion difficile. Quelle est la meilleure utilisation ?",
    aiHelp:
      "L’IA peut être utile si elle sert à apprendre et non seulement à obtenir une réponse.",
    options: [
      "Copier la réponse",
      "Demander une explication et essayer de comprendre",
      "Éviter de lire la réponse",
      "Utiliser l’IA pour tout faire",
    ],
    answer: "Demander une explication et essayer de comprendre",
  },
  {
    question:
      "Si une conclusion est basée sur un seul exemple, quel est le risque ?",
    aiHelp:
      "Un seul exemple ne suffit généralement pas à établir une conclusion générale.",
    options: [
      "La conclusion est forcément vraie",
      "La conclusion peut être trop générale",
      "La conclusion est une preuve scientifique",
      "L’exemple suffit toujours",
    ],
    answer: "La conclusion peut être trop générale",
  },
  {
    question:
      "Pourquoi faut-il parfois prendre du temps avant de répondre ?",
    aiHelp:
      "Prendre du temps permet d’éviter les réponses automatiques ou impulsives.",
    options: [
      "Pour compliquer la réponse",
      "Pour réfléchir et éviter les erreurs",
      "Pour répondre plus lentement sans raison",
      "Pour éviter de comprendre",
    ],
    answer: "Pour réfléchir et éviter les erreurs",
  },
  {
    question:
      "Une IA donne une explication longue. Cela signifie-t-il qu’elle est forcément meilleure ?",
    aiHelp:
      "La longueur d’une explication ne garantit pas sa qualité.",
    options: [
      "Oui, plus c’est long, plus c’est vrai",
      "Non, il faut juger la qualité du raisonnement",
      "Oui, si le vocabulaire est compliqué",
      "Non, une explication longue est toujours fausse",
    ],
    answer: "Non, il faut juger la qualité du raisonnement",
  },
  {
    question:
      "Quel est le risque principal d’utiliser une IA pour répondre à toutes les questions sans effort personnel ?",
    aiHelp:
      "Une utilisation excessive peut réduire l’effort de raisonnement personnel.",
    options: [
      "Développer automatiquement son esprit critique",
      "Devenir dépendant de l’aide extérieure",
      "Mieux mémoriser sans travailler",
      "Ne jamais faire d’erreur",
    ],
    answer: "Devenir dépendant de l’aide extérieure",
  },
  {
    question:
      "Face à une réponse IA, quelle question faut-il se poser en priorité ?",
    aiHelp:
      "Il est utile de questionner la fiabilité et la logique de la réponse.",
    options: [
      "Est-ce que la réponse est jolie ?",
      "Est-ce que la réponse est logique et vérifiable ?",
      "Est-ce que la réponse est longue ?",
      "Est-ce que je peux la copier vite ?",
    ],
    answer: "Est-ce que la réponse est logique et vérifiable ?",
  },
  {
    question:
      "Si une personne comprend mieux après avoir comparé sa réponse avec celle de l’IA, que montre cela ?",
    aiHelp:
      "L’IA peut servir de support d’apprentissage si elle est utilisée activement.",
    options: [
      "L’IA a remplacé sa réflexion",
      "L’IA a servi d’aide à la réflexion",
      "La personne n’a rien appris",
      "La personne doit toujours suivre l’IA",
    ],
    answer: "L’IA a servi d’aide à la réflexion",
  },
  {
    question:
      "Pourquoi est-il utile de vérifier plusieurs sources avant de conclure ?",
    aiHelp:
      "Comparer plusieurs sources réduit le risque de se baser sur une information fausse ou isolée.",
    options: [
      "Pour perdre du temps",
      "Pour renforcer la fiabilité de l’information",
      "Pour éviter de réfléchir",
      "Pour choisir la source la plus courte",
    ],
    answer: "Pour renforcer la fiabilité de l’information",
  },
  {
    question:
      "Une personne accepte une réponse uniquement parce qu’elle vient d’une IA. Quel biais cela peut-il montrer ?",
    aiHelp:
      "Il peut y avoir une confiance excessive envers l’autorité perçue de l’outil.",
    options: [
      "Un esprit critique élevé",
      "Une confiance excessive dans l’outil",
      "Une autonomie totale",
      "Une absence d’influence",
    ],
    answer: "Une confiance excessive dans l’outil",
  },
  {
    question:
      "Quelle phrase décrit le mieux une bonne utilisation de l’IA dans un apprentissage ?",
    aiHelp:
      "Une bonne utilisation garde l’humain actif dans le raisonnement.",
    options: [
      "L’IA fait tout à ma place",
      "L’IA m’aide, mais je garde mon jugement",
      "Je copie sans vérifier",
      "Je ne réfléchis plus",
    ],
    answer: "L’IA m’aide, mais je garde mon jugement",
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