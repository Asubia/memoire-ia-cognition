import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        pseudo: user.pseudo,
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set("userId", String(user.id), {
      httpOnly: true,
      path: "/",
    });

    response.cookies.set("role", user.role, {
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}