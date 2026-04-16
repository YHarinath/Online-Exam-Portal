import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const examId = url.searchParams.get("examId");

    const where: any = { submitted: true };
    if (examId) where.examId = examId;

    const attempts = await prisma.attempt.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        exam: { select: { id: true, title: true } }
      },
      orderBy: [
        { score: "desc" },
        { endTime: "asc" }
      ]
    });

    // Get unique top attempts per user per exam
    const seen = new Map<string, any>();
    const ranked = attempts.reduce((acc: any[], attempt: any) => {
      const key = `${attempt.userId}-${attempt.examId}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        acc.push(attempt);
      }
      return acc;
    }, []);

    const leaderboard = ranked.map((attempt, idx) => {
      const timeTaken = attempt.endTime
        ? Math.floor((new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000)
        : 0;
      return {
        rank: idx + 1,
        userId: attempt.userId,
        name: attempt.user.name,
        examId: attempt.examId,
        examTitle: attempt.exam.title,
        score: attempt.score ?? 0,
        timeTakenSeconds: timeTaken,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
