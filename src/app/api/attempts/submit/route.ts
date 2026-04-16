import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { examId, answers: finalAnswers } = await req.json();

    const attempt = await prisma.attempt.findFirst({
      where: { examId, userId, submitted: false },
      include: { exam: { include: { questions: true } } }
    });

    if (!attempt) return NextResponse.json({ error: "No active attempt found" }, { status: 400 });

    let totalScore = 0;
    let maxPoints = 0;

    const evaluatedAnswers = await Promise.all(attempt.exam.questions.map(async (q) => {
      const studentAns = finalAnswers[q.id] || "";
      let isCorrect = false;

      if (q.type === "MCQ") {
        isCorrect = studentAns === q.correctAnswer;
      } else if (q.type === "SHORT") {
        isCorrect = studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      } else if (q.type === "CODE") {
        // In a real app, we'd run test cases. For this MVP, we consider it correct if it's not empty
        // Or we could do a simple string check if the user provided one.
        isCorrect = studentAns.length > 20; 
      }

      if (isCorrect) totalScore += q.points;
      maxPoints += q.points;

      // Sync and mark correct
      const existingAnswer = await prisma.answer.findFirst({
        where: { attemptId: attempt.id, questionId: q.id }
      });

      if (existingAnswer) {
        return prisma.answer.update({
          where: { id: existingAnswer.id },
          data: { studentAnswer: String(studentAns), isCorrect }
        });
      } else {
        return prisma.answer.create({
          data: {
            attemptId: attempt.id,
            questionId: q.id,
            studentAnswer: String(studentAns),
            isCorrect
          }
        });
      }
    }));

    // Calculate percentage score
    const finalPercentage = Math.round((totalScore / maxPoints) * 100);

    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        submitted: true,
        endTime: new Date(),
        score: finalPercentage
      }
    });

    return NextResponse.json({ success: true, score: finalPercentage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
