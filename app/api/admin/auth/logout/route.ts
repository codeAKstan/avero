import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminFromSession } from "@/lib/adminAuth";

export async function POST() {
  try {
    const admin = await getAdminFromSession();
    if (admin) {
      admin.currentSessionId = "";
      await admin.save();
    }
  } catch (error) {
    console.error("Error clearing admin session on logout:", error);
  }

  const response = NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
