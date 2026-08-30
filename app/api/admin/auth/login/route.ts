import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { ensureAdminUserExists } from "@/lib/seedAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Ensure superadmin account exists
    await ensureAdminUserExists();
    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid admin credentials or unauthorized account." },
        { status: 401 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: "This administrator account is suspended." },
        { status: 403 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Password not set for this admin account." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const token = signAdminToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin authentication successful.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred during admin authentication." },
      { status: 500 }
    );
  }
}
