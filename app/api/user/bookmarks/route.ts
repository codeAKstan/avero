import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import { isProUser } from "@/lib/subscription";

export async function GET() {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isProUser(sessionUser)) {
      return NextResponse.json(
        { error: "Saving and viewing bookmarked questions is a Pro feature.", code: "PRO_REQUIRED" },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const bookmarks = await Bookmark.find({ userId: sessionUser._id })
      .populate("courseId", "title categoryId")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookmarks,
      totalCount: bookmarks.length,
    });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load bookmarks." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isProUser(sessionUser)) {
      return NextResponse.json(
        { error: "Saving and viewing bookmarked questions is a Pro feature.", code: "PRO_REQUIRED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, questionId, questionText, options, correctAnswer, explanation } = body;

    if (!courseId || !questionText || !correctAnswer) {
      return NextResponse.json(
        { error: "courseId, questionText, and correctAnswer are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const qId = questionId || questionText.substring(0, 30);

    const existing = await Bookmark.findOne({
      userId: sessionUser._id,
      courseId,
      questionText,
    });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: "Question removed from bookmarks.",
      });
    }

    const newBookmark = await Bookmark.create({
      userId: sessionUser._id,
      courseId,
      questionId: qId,
      questionText,
      options: options || [],
      correctAnswer,
      explanation: explanation || "",
    });

    return NextResponse.json({
      success: true,
      bookmarked: true,
      message: "Question saved to bookmarks.",
      bookmark: newBookmark,
    });
  } catch (error: any) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to toggle bookmark." },
      { status: 500 }
    );
  }
}
