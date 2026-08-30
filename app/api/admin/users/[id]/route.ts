import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, isSuspended, fullName, university, password } = body;

    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (role) user.role = role;
    if (typeof isSuspended === "boolean") user.isSuspended = isSuspended;
    if (fullName) user.fullName = fullName;
    if (university) user.university = university;

    if (password && password.trim().length >= 6) {
      user.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    await user.save();

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
