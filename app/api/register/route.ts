import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      pseudo,
      username,
      password,
      age,
      educationLevel,
      aiUsageFrequency,
    } = body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Identifiant déjà utilisé" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    await prisma.user.create({
      data: {
        pseudo,
        username,
        passwordHash: hashedPassword,
        age: Number(age),
        educationLevel,
        aiUsageFrequency,
      },
    });

    return NextResponse.json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}