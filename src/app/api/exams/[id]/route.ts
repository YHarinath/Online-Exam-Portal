import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            type: true,
            text: true,
            options: true,
            points: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
