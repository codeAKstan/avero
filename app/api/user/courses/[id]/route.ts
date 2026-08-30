import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/userAuth";
import Course from "@/models/Course";
import ExamAttempt from "@/models/ExamAttempt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const course = await Course.findById(id)
      .populate("categoryId", "name slug icon")
      .lean();

    if (!course || course.status !== "Published") {
      return NextResponse.json(
        { error: "Course not found or unavailable." },
        { status: 404 }
      );
    }

    // Get user's previous attempts for this course
    const previousAttempts = await ExamAttempt.find({
      userId: user._id,
      courseId: course._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      course,
      previousAttempts,
    });
  } catch (error: any) {
    console.error("Error in /api/user/courses/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch course details." },
      { status: 500 }
    );
  }
}
