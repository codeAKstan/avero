import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/userAuth";
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

    const attempt = await ExamAttempt.findOne({
      _id: id,
      userId: user._id,
    })
      .populate("courseId", "title categoryId thumbnail level passingScorePercentage description")
      .lean();

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (error: any) {
    console.error("Error fetching attempt details:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch attempt details." },
      { status: 500 }
    );
  }
}
