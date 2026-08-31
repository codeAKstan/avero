import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const course = await Course.findById(id).populate("categoryId", "name slug icon subcategories");
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch course." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    if (body.title) course.title = body.title;
    if (body.slug) {
      course.slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
    }
    if (body.categoryId) course.categoryId = body.categoryId;
    if (typeof body.subcategoryName !== "undefined") course.subcategoryName = body.subcategoryName;
    if (typeof body.subcategoryId !== "undefined") course.subcategoryName = body.subcategoryId;
    if (typeof body.description !== "undefined") course.description = body.description;
    if (typeof body.thumbnail !== "undefined") course.thumbnail = body.thumbnail;
    if (body.level) course.level = body.level;
    if (body.status) course.status = body.status;
    if (typeof body.timeLimitMinutes === "number") course.timeLimitMinutes = body.timeLimitMinutes;
    if (typeof body.passingScorePercentage === "number") course.passingScorePercentage = body.passingScorePercentage;
    if (Array.isArray(body.allowedModes)) course.allowedModes = body.allowedModes;
    if (body.modules) course.modules = body.modules;
    if (body.questions) course.questions = body.questions;
    if (typeof body.sourceDocumentUrl !== "undefined") course.sourceDocumentUrl = body.sourceDocumentUrl;

    await course.save();

    return NextResponse.json({
      success: true,
      message: "Course updated successfully.",
      course,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete course." }, { status: 500 });
  }
}
