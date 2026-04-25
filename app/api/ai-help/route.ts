import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Clé OpenAI manquante dans le fichier .env" },
        { status: 500 }
      );
    }

    const { question } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
      Tu es une intelligence artificielle utilisée dans une étude universitaire.

      Ton rôle est d'aider l'utilisateur à réfléchir, SANS jamais donner directement la bonne réponse.

      Règles strictes :
      - Tu ne dois PAS donner la bonne réponse
      - Tu ne dois PAS dire "la bonne réponse est..."
      - Tu dois poser une piste de réflexion
      - Tu dois rester neutre
      - Réponse courte (2 à 4 phrases maximum)

Question :
${question}

Réponds en 3 à 5 phrases maximum, de manière pédagogique.`,
    });

    const text = response.output_text;

    return NextResponse.json({
      result: text,
    });
  } catch (error) {
    console.error("Erreur OpenAI :", error);

    return NextResponse.json(
      { error: "Erreur lors de l'appel à l'IA. Vérifie ta clé API et ton solde OpenAI." },
      { status: 500 }
    );
  }
}