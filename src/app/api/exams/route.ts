import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, duration, published, questions } = await req.json();

    if (!title || !duration || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        duration,
        published: published ?? false,
        createdBy: userId,
        questions: {
          create: questions.map((q: any) => ({
            type: q.type,
            text: q.text,
            options: q.options,
            correctAnswer: String(q.correctAnswer),
            points: Number(q.points) || 1,
          })),
        },
      },
    });

    return NextResponse.json({ exam });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
