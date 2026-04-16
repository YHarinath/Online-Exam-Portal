import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { examId } = await req.json();
    if (!examId) return NextResponse.json({ error: "Exam ID missing" }, { status: 400 });

    const existingAttempt = await prisma.attempt.findFirst({
      where: { examId, userId }
    });

    if (existingAttempt) {
      return NextResponse.json({ attempt: existingAttempt });
    }

    const attempt = await prisma.attempt.create({
      data: {
        examId,
        userId
      }
    });

    return NextResponse.json({ attempt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
