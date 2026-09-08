import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/userAuth";
import Course from "@/models/Course";
import ExamAttempt from "@/models/ExamAttempt";
import { filterCourseQuestionsForUser } from "@/lib/subscription";

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

    const rawCourse = await Course.findById(id)
      .populate("categoryId", "name slug icon")
      .lean();

    if (!rawCourse || rawCourse.status !== "Published") {
      return NextResponse.json(
        { error: "Course not found or unavailable." },
        { status: 404 }
      );
    }

    // Apply course question filtering based on user subscription
    const accessInfo = filterCourseQuestionsForUser(rawCourse as any, user);
    
    if (!accessInfo.allowed) {
      return NextResponse.json(
        { error: accessInfo.reason || "This course requires a Pro membership.", code: "PRO_REQUIRED" },
        { status: 403 }
      );
    }

    const course = {
      ...rawCourse,
      questions: accessInfo.questions,
      totalOriginalQuestions: accessInfo.totalQuestions,
      isRestricted: accessInfo.isRestricted,
      freeQuestionLimit: accessInfo.freeLimit,
    };

    // Get user's previous attempts for this course
    const previousAttempts = await ExamAttempt.find({
      userId: user._id,
      courseId: rawCourse._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      course,
      previousAttempts,
      accessInfo,
    });
  } catch (error: any) {
    console.error("Error in /api/user/courses/[id]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch course details." },
      { status: 500 }
    );
  }
}
