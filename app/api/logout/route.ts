import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/userAuth";

export async function POST() {
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
