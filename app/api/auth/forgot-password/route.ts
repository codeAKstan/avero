import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

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
    const user = await User.findOne({ email: normalizedEmail });

    // To prevent user enumeration, return success even if user doesn't exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate random 32-byte hex token
    const unhashedToken = crypto.randomBytes(32).toString("hex");
    // Hash token to store in DB
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    // Token expires in 1 hour
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    // Construct reset URL
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${unhashedToken}`;

    // Send email
    let emailResult = null;
    try {
      emailResult = await sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        resetUrl,
      });
    } catch (emailErr) {
      console.error("Error sending password reset email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
      debugResetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred processing password reset request." },
      { status: 500 }
    );
  }
}
