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

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: "Name and Email are required" }, { status: 400 });
    }

    // Check if email is taken by another user
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } }
    });

    if (existing) {
      return NextResponse.json({ message: "Email is already taken" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email } 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
