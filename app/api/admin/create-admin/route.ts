import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      pseudo: "Admin",
      username: "admin",
      passwordHash,
      age: 25,
      educationLevel: "BAC_5",
      aiUsageFrequency: "SOUVENT",
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    message: "Admin créé ou mot de passe réinitialisé",
    username: admin.username,
  });
}