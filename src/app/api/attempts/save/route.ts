import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { examId, questionId, answer } = await req.json();

    const attempt = await prisma.attempt.findFirst({
      where: { examId, userId, submitted: false }
    });

    if (!attempt) return NextResponse.json({ error: "No active attempt found" }, { status: 400 });

    const existingAnswer = await prisma.answer.findFirst({
      where: { attemptId: attempt.id, questionId }
    });

    if (existingAnswer) {
      await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: { studentAnswer: String(answer) }
      });
    } else {
      await prisma.answer.create({
        data: {
          attemptId: attempt.id,
          questionId,
          studentAnswer: String(answer)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
