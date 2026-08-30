import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch active announcements." }, { status: 500 });
  }
}
