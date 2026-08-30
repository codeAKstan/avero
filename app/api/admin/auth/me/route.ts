import { NextResponse } from "next/server";
import { getAdminFromSession } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
