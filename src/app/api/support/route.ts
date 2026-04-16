import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ message: "Subject and Message are required" }, { status: 400 });
    }

    const inquiry = await prisma.supportInquiry.create({
      data: {
        userId,
        subject,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json({ message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    console.error("Support submission error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  // Admins can see all inquiries (handled by the page server component, but here if needed)
  try {
    const inquiries = await prisma.supportInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ inquiries });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
