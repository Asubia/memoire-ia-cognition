import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const existing = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existing) {
    return NextResponse.json({ message: "Admin déjà existant" });
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      pseudo: "Admin",
      username: "admin",
      passwordHash,
      age: 25,
      educationLevel: "BAC_5",
      aiUsageFrequency: "SOUVENT",
      role: "ADMIN",
    },
  });

  return NextResponse.json({ message: "Admin créé" });
}