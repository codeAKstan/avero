import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { sanitizeQuestions } from "@/lib/questionUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "all";
    const subcategoryName = searchParams.get("subcategoryName") || searchParams.get("subcategoryId") || "all";
    const status = searchParams.get("status") || "all";

    await connectToDatabase();

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categoryId !== "all") {
      query.categoryId = categoryId;
    }

    if (subcategoryName !== "all") {
      query.subcategoryName = subcategoryName;
    }

    if (status !== "all") {
      query.status = status;
    }

    const courses = await Course.find(query)
      .populate("categoryId", "name slug icon subcategories")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch courses." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      categoryId,
      subcategoryName,
      subcategoryId,
      description,
      thumbnail,
      level,
      status,
      timeLimitMinutes,
      passingScorePercentage,
      allowedModes,
      modules,
      questions,
      sourceDocumentUrl,
      isFreeAccess,
      freeQuestionLimit,
      randomizeQuestions,
    } = body;

    if (!title || !categoryId || !description) {
      return NextResponse.json(
        { error: "Title, Category, and Description are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const formattedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Course.findOne({ slug: formattedSlug });
    if (existing) {
      return NextResponse.json(
        { error: "A course with this title/slug already exists." },
        { status: 400 }
      );
    }

    const course = await Course.create({
      title,
      slug: formattedSlug,
      categoryId,
      subcategoryName: subcategoryName || subcategoryId || "",
      description,
      thumbnail: thumbnail || "",
      level: level || "Intermediate",
      status: status || "Draft",
      timeLimitMinutes: typeof timeLimitMinutes === "number" ? timeLimitMinutes : 60,
      passingScorePercentage: typeof passingScorePercentage === "number" ? passingScorePercentage : 75,
      allowedModes: Array.isArray(allowedModes) ? allowedModes : ["Practice", "Exam"],
      modules: modules || [],
      questions: sanitizeQuestions(questions || []),
      sourceDocumentUrl: sourceDocumentUrl || "",
      isFreeAccess: isFreeAccess !== undefined ? Boolean(isFreeAccess) : true,
      freeQuestionLimit: typeof freeQuestionLimit === "number" ? freeQuestionLimit : 5,
      randomizeQuestions: Boolean(randomizeQuestions),
    });

    return NextResponse.json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create course." }, { status: 500 });
  }
}
