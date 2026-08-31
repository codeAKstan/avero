import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Hash token to match DB entry
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +passwordHash");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash new password and update user
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred resetting password." },
      { status: 500 }
    );
  }
}
