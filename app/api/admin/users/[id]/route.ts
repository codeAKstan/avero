import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendSubscriptionActivatedEmail, sendSubscriptionExpiredEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      role,
      isSuspended,
      fullName,
      university,
      password,
      subscriptionPlan,
      subscriptionExpiresAt,
    } = body;

    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const previousPlan = user.subscriptionPlan;

    if (role) user.role = role;
    if (typeof isSuspended === "boolean") user.isSuspended = isSuspended;
    if (fullName) user.fullName = fullName;
    if (university) user.university = university;

    if (subscriptionPlan !== undefined) {
      user.subscriptionPlan = subscriptionPlan;
      if (subscriptionPlan === "pro") {
        user.subscriptionStatus = "active";
      } else {
        user.subscriptionStatus = null;
        user.subscriptionExpiresAt = undefined;
      }
    }

    if (subscriptionExpiresAt !== undefined) {
      user.subscriptionExpiresAt = subscriptionExpiresAt
        ? new Date(subscriptionExpiresAt)
        : undefined;
    }

    if (password && password.trim().length >= 6) {
      user.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    await user.save();

    // Trigger email notifications if subscription status changed
    if (subscriptionPlan === "pro" && (previousPlan !== "pro" || subscriptionExpiresAt !== undefined)) {
      try {
        await sendSubscriptionActivatedEmail({
          to: user.email,
          fullName: user.fullName,
          planName: "Pro Plan",
          expiresAt: user.subscriptionExpiresAt,
          isAdminGranted: true,
        });
      } catch (emailErr) {
        console.error("Failed to send admin subscription activation email:", emailErr);
      }
    } else if (subscriptionPlan === "free" && previousPlan === "pro") {
      try {
        await sendSubscriptionExpiredEmail({
          to: user.email,
          fullName: user.fullName,
        });
      } catch (emailErr) {
        console.error("Failed to send admin subscription revocation email:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete user." }, { status: 500 });
  }
}
