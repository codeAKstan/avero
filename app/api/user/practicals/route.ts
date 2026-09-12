import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/userAuth";
import { isProUser } from "@/lib/subscription";
import Course from "@/models/Course";

export async function GET(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPro = isProUser(user);

    await connectToDatabase();

    // Fetch published courses containing practical questions
    const courses = await Course.find({
      status: "Published",
      "questions.questionType": "practical",
    })
      .populate("categoryId", "name slug icon")
      .lean();

    // Aggregate practical question modules
    const practicalModules: any[] = [];

    courses.forEach((course: any) => {
      const practicalQuestions = (course.questions || []).filter(
        (q: any) => q.questionType === "practical"
      );

      // Group questions by practicalTitle or flashcardImageUrl
      const grouped: { [key: string]: any } = {};

      practicalQuestions.forEach((q: any) => {
        const titleKey = q.practicalTitle || "General Practical";
        if (!grouped[titleKey]) {
          grouped[titleKey] = {
            id: q._id ? String(q._id) : `${course._id}-${titleKey}`,
            practicalTitle: titleKey,
            courseId: course._id,
            courseTitle: course.title,
            category: course.categoryId?.name || "Nursing Practical",
            flashcardImageUrl: isPro ? (q.flashcardImageUrl || "") : "",
            markingSchemeImageUrl: isPro ? (q.markingSchemeImageUrl || "") : "",
            questions: [],
            questionsCount: 0,
          };
        }
        if (isPro) {
          if (!grouped[titleKey].flashcardImageUrl && q.flashcardImageUrl) {
            grouped[titleKey].flashcardImageUrl = q.flashcardImageUrl;
          }
          if (!grouped[titleKey].markingSchemeImageUrl && q.markingSchemeImageUrl) {
            grouped[titleKey].markingSchemeImageUrl = q.markingSchemeImageUrl;
          }
          grouped[titleKey].questions.push(q);
        }
        grouped[titleKey].questionsCount += 1;
      });

      Object.values(grouped).forEach((mod) => {
        practicalModules.push(mod);
      });
    });

    return NextResponse.json({
      success: true,
      isPro,
      practicalModules,
    });
  } catch (error: any) {
    console.error("Error fetching practical modules:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch practical modules." },
      { status: 500 }
    );
  }
}
