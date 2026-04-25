"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  // LOGIQUE
  {
    question: "Si tous les A sont B et que tous les B sont C, alors :",
    options: [
      "Tous les A sont C",
      "Certains C sont A",
      "Aucun A n’est C",
      "On ne peut pas savoir",
    ],
    answer: "Tous les A sont C",
  },
  {
    question: "Quel nombre complète la suite : 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "20"],
    answer: "32",
  },
  {
    question: "Si 3 chats attrapent 3 souris en 3 minutes, combien de chats pour 6 souris en 6 minutes ?",
    options: ["3", "6", "9", "12"],
    answer: "3",
  },
  {
    question: "Tous les étudiants travaillent. Paul est étudiant. Donc :",
    options: [
      "Paul ne travaille pas",
      "Paul travaille",
      "Paul est professeur",
      "On ne peut pas savoir",
    ],
    answer: "Paul travaille",
  },
  {
    question: "Quel mot est différent des autres ?",
    options: ["Chien", "Chat", "Table", "Lion"],
    answer: "Table",
  },

  // CALCUL
  {
    question: "12 × 8 = ?",
    options: ["96", "88", "108", "92"],
    answer: "96",
  },
  {
    question: "100 - 25 × 2 = ?",
    options: ["150", "50", "75", "0"],
    answer: "50",
  },
  {
    question: "Si un produit coûte 20€ avec 50% de réduction, combien coûte-t-il ?",
    options: ["10€", "15€", "5€", "20€"],
    answer: "10€",
  },
  {
    question: "Quelle est la moitié de 3/4 ?",
    options: ["3/8", "1/2", "2/4", "1/4"],
    answer: "3/8",
  },
  {
    question: "2² + 3² = ?",
    options: ["13", "10", "12", "9"],
    answer: "13",
  },

  // COMPRÉHENSION
  {
    question: "Un texte dit : 'Il pleuvait, donc Paul a pris un parapluie.' Pourquoi ?",
    options: [
      "Parce qu’il faisait chaud",
      "Parce qu’il pleuvait",
      "Parce qu’il était en retard",
      "On ne sait pas",
    ],
    answer: "Parce qu’il pleuvait",
  },
  {
    question: "Si Marie arrive après Jean, qui est arrivé en premier ?",
    options: ["Marie", "Jean", "Les deux", "On ne sait pas"],
    answer: "Jean",
  },
  {
    question: "Un étudiant révise beaucoup mais échoue. Quelle est la conclusion logique ?",
    options: [
      "Réviser ne sert à rien",
      "Il a mal révisé",
      "Tous les étudiants échouent",
      "On ne peut pas conclure",
    ],
    answer: "On ne peut pas conclure",
  },
  {
    question: "Que signifie 'analyser' ?",
    options: [
      "Regarder rapidement",
      "Examiner en détail",
      "Copier",
      "Ignorer",
    ],
    answer: "Examiner en détail",
  },
  {
    question: "Si un texte est contradictoire, cela signifie :",
    options: [
      "Il est cohérent",
      "Il contient des erreurs logiques",
      "Il est simple",
      "Il est long",
    ],
    answer: "Il contient des erreurs logiques",
  },

  // RAISONNEMENT CRITIQUE
  {
    question: "Une IA donne une réponse sans source. Que faire ?",
    options: [
      "Accepter directement",
      "Vérifier",
      "Ignorer",
      "Copier",
    ],
    answer: "Vérifier",
  },
  {
    question: "Si une information semble fausse, il faut :",
    options: [
      "La croire",
      "La vérifier",
      "La partager",
      "L’ignorer",
    ],
    answer: "La vérifier",
  },
  {
    question: "Une réponse bien écrite est forcément vraie :",
    options: ["Vrai", "Faux"],
    answer: "Faux",
  },
  {
    question: "Pourquoi faut-il croiser les sources ?",
    options: [
      "Pour gagner du temps",
      "Pour vérifier la fiabilité",
      "Pour copier",
      "Pour écrire plus vite",
    ],
    answer: "Pour vérifier la fiabilité",
  },
  {
    question: "Un argument logique doit être :",
    options: [
      "Rapide",
      "Cohérent",
      "Long",
      "Compliqué",
    ],
    answer: "Cohérent",
  },
];

export default function Test1Page() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[current];

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

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setQuestionStartTime(Date.now());
      return;
    }

    setLoading(true);
    setError("");

    const score = newAnswers.filter((answer) => answer.isCorrect).length;

    const response = await fetch("/api/test-1/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: newAnswers,
        score,
        total: questions.length,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erreur lors de l’enregistrement du test.");
      setLoading(false);
      return;
    }

    router.push("/test-2");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <section className="max-w-3xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8">

        <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">
          Test 1 — Sans IA
        </p>

        <h1 className="text-3xl font-extrabold mb-4">
          Raisonnement autonome
        </h1>

        <div className="bg-slate-100 rounded-xl p-4 mb-6">
          <p className="text-slate-500 mb-2">
            Question {current + 1} / {questions.length}
          </p>
          <h2 className="text-lg font-semibold text-black">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-full px-4 py-3 rounded-xl border transition ${
                selected === option
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:bg-slate-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold"
        >
          {current === questions.length - 1
            ? "Terminer le test"
            : "Question suivante"}
        </button>
      </section>
    </main>
  );
}