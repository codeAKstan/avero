import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch announcements." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, type, targetRole, isActive } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and Message are required." }, { status: 400 });
    }

    await connectToDatabase();

    const announcement = await Announcement.create({
      title,
      message,
      type: type || "info",
      targetRole: targetRole || "all",
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create announcement." }, { status: 500 });
  }
}
