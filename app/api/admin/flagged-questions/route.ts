import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import FlaggedQuestion from "@/models/FlaggedQuestion";

export async function GET(request: Request) {
  try {
    const admin = await verifyAdminRequest(request as any);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const courseId = searchParams.get("courseId") || "all";

    await connectToDatabase();

    const query: any = {};

    if (status !== "all") {
      query.status = status;
    }

    if (courseId !== "all") {
      query.courseId = courseId;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { questionText: searchRegex },
        { userName: searchRegex },
        { userEmail: searchRegex },
        { courseTitle: searchRegex },
        { reason: searchRegex },
        { details: searchRegex },
      ];
    }

    const flags = await FlaggedQuestion.find(query)
      .populate("userId", "fullName email role university")
      .populate("courseId", "title categoryId")
      .sort({ createdAt: -1 });

    // Aggregate summary counters
    const [total, pending, reviewed, resolved, dismissed] = await Promise.all([
      FlaggedQuestion.countDocuments({}),
      FlaggedQuestion.countDocuments({ status: "Pending" }),
      FlaggedQuestion.countDocuments({ status: "Reviewed" }),
      FlaggedQuestion.countDocuments({ status: "Resolved" }),
      FlaggedQuestion.countDocuments({ status: "Dismissed" }),
    ]);

    return NextResponse.json({
      success: true,
      flags,
      stats: {
        total,
        pending,
        reviewed,
        resolved,
        dismissed,
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin flagged questions:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch flagged questions." },
      { status: 500 }
    );
  }
}
