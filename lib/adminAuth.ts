import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "avero_admin_secret_key_fallback";
export const ADMIN_COOKIE_NAME = "avero_admin_token";

export interface IAdminJwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export function signAdminToken(payload: IAdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): IAdminJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as IAdminJwtPayload;
  } catch (err) {
    return null;
  }
}

export async function getAdminFromSession(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyAdminToken(token);
    if (!decoded || decoded.role !== "admin") return null;

    await connectToDatabase();
    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== "admin" || admin.isSuspended) return null;

    // Enforce 1 active device session per admin account
    if (admin.currentSessionId && decoded.sessionId && decoded.sessionId !== admin.currentSessionId) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error("Error retrieving admin session:", error);
    return null;
  }
}

export async function verifyAdminRequest(request: NextRequest): Promise<IAdminJwtPayload | null> {
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;

  const decoded = verifyAdminToken(token);
  if (!decoded || decoded.role !== "admin") return null;

  return decoded;
}
