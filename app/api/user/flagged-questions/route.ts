import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/mongodb";
import FlaggedQuestion from "@/models/FlaggedQuestion";

export async function GET(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const flags = await FlaggedQuestion.find({ userId: sessionUser._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      flags,
      totalCount: flags.length,
    });
  } catch (error: any) {
    console.error("Error fetching user flagged questions:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load flagged questions." },
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

    const body = await request.json();
    const {
      courseId,
      courseTitle,
      questionId,
      questionText,
      options,
      correctAnswer,
      explanation,
      reason,
      details,
    } = body;

    if (!questionText || !correctAnswer) {
      return NextResponse.json(
        { error: "questionText and correctAnswer are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const qId = questionId || questionText.substring(0, 30);

    const filter: any = {
      userId: sessionUser._id,
      questionText,
    };
    if (courseId) filter.courseId = courseId;

    const existing = await FlaggedQuestion.findOne(filter);

    if (existing) {
      // Toggle off if explicit toggle requested or duplicate POST without new reason
      if (body.toggle === true) {
        await FlaggedQuestion.deleteOne({ _id: existing._id });
        return NextResponse.json({
          success: true,
          flagged: false,
          message: "Question unflagged.",
        });
      } else {
        // Update details/reason
        existing.reason = reason || existing.reason;
        existing.details = details !== undefined ? details : existing.details;
        existing.status = "Pending";
        await existing.save();

        return NextResponse.json({
          success: true,
          flagged: true,
          message: "Flag updated.",
          flag: existing,
        });
      }
    }

    const newFlag = await FlaggedQuestion.create({
      userId: sessionUser._id,
      userName: sessionUser.fullName || "Student",
      userEmail: sessionUser.email || "",
      courseId: courseId || null,
      courseTitle: courseTitle || "General Question Bank",
      questionId: qId,
      questionText,
      options: options || [],
      correctAnswer,
      explanation: explanation || "",
      reason: reason || "Flagged for review",
      details: details || "",
      status: "Pending",
    });

    return NextResponse.json({
      success: true,
      flagged: true,
      message: "Question flagged for review.",
      flag: newFlag,
    });
  } catch (error: any) {
    console.error("Error flagging question:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to flag question." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const flagId = searchParams.get("id");
    const questionText = searchParams.get("questionText");

    await connectToDatabase();

    if (flagId) {
      await FlaggedQuestion.deleteOne({ _id: flagId, userId: sessionUser._id });
    } else if (questionText) {
      await FlaggedQuestion.deleteOne({ questionText, userId: sessionUser._id });
    } else {
      return NextResponse.json(
        { error: "id or questionText required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question unflagged.",
    });
  } catch (error: any) {
    console.error("Error unflagging question:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to unflag question." },
      { status: 500 }
    );
  }
}
