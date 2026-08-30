import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    if (body.title) announcement.title = body.title;
    if (body.message) announcement.message = body.message;
    if (body.type) announcement.type = body.type;
    if (body.targetRole) announcement.targetRole = body.targetRole;
    if (typeof body.isActive === "boolean") announcement.isActive = body.isActive;

    await announcement.save();

    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update announcement." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete announcement." }, { status: 500 });
  }
}
