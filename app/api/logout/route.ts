import { NextResponse } from "next/server";
import { USER_COOKIE_NAME, getUserFromSession } from "@/lib/userAuth";

export async function POST() {
  try {
    const user = await getUserFromSession();
    if (user) {
      user.currentSessionId = "";
      await user.save();
    }
  } catch (error) {
    console.error("Error clearing session on logout:", error);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully." });
  response.cookies.set({
    name: USER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
