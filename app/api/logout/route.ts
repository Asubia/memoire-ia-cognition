import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/", req.url));

  response.cookies.set("userId", "", {
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("role", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}