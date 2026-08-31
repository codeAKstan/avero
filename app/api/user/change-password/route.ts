import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserFromSession } from "@/lib/userAuth";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Fetch user with passwordHash
    const user = await User.findById(sessionUser._id).select("+passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // If user currently has a password, verify currentPassword
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required." },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect current password." },
          { status: 400 }
        );
      }
    }

    // Hash and update to new password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to change password." },
      { status: 500 }
    );
  }
}
