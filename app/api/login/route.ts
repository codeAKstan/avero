import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Auto-register user if logging in for the first time
      const nameFromEmail = email.split("@")[0].replace(".", " ");
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

      user = await User.create({
        fullName: capitalizedName,
        email: normalizedEmail,
        role: "student",
        isOnboarded: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          studentType: user.studentType,
          university: user.university,
          gradYear: user.gradYear,
          isOnboarded: user.isOnboarded,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred during authentication." },
      { status: 500 }
    );
  }
}
