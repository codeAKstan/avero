import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromSession } from "@/lib/userAuth";
import { isProUser } from "@/lib/subscription";
import Course, { ICourse, IQuestion } from "@/models/Course";
import Category from "@/models/Category";
import User from "@/models/User";
import { normalizeOptionText } from "@/lib/questionUtils";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isProUser(user)) {
      return NextResponse.json(
        {
          error: "Council Exam Simulator is exclusive to Avero Pro members. Please upgrade your account to access full 250-question mock exams.",
          isProRequired: true,
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paperType = searchParams.get("paperType") || "Paper1";
    const reqCount = parseInt(searchParams.get("count") || "250", 10);
    const reqTimeLimit = parseInt(searchParams.get("timeLimit") || "120", 10);

    // Fetch all published courses
    const courses = await Course.find({ status: "Published" })
      .select("_id title questions subcategoryName")
      .lean();

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: "No published courses found to pool exam questions from." },
        { status: 404 }
      );
    }

    // Collect all questions across published courses
    interface PooledQuestion {
      _id?: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation?: string;
      questionType?: "standard" | "practical";
      practicalTitle?: string;
      flashcardImageUrl?: string;
      markingSchemeImageUrl?: string;
      courseId: string;
      courseTitle: string;
    }

    const pooledQuestions: PooledQuestion[] = [];

    for (const course of courses) {
      if (course && Array.isArray(course.questions) && course.questions.length > 0) {
        const cId = course._id ? course._id.toString() : "";
        const cTitle = course.title || "General Subject";

        for (const q of course.questions) {
          if (q && q.question && Array.isArray(q.options) && q.correctAnswer) {
            pooledQuestions.push({
              _id: q._id ? q._id.toString() : "",
              question: q.question,
              options: Array.isArray(q.options) ? q.options.map((opt: string) => normalizeOptionText(opt)) : [],
              correctAnswer: normalizeOptionText(q.correctAnswer),
              explanation: q.explanation || "",
              questionType: q.questionType || "standard",
              practicalTitle: q.practicalTitle || "",
              flashcardImageUrl: q.flashcardImageUrl || "",
              markingSchemeImageUrl: q.markingSchemeImageUrl || "",
              courseId: cId,
              courseTitle: cTitle,
            });
          }
        }
      }
    }

    if (pooledQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found in published courses." },
        { status: 404 }
      );
    }

    // Shuffle questions uniformly (Fisher-Yates)
    for (let i = pooledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pooledQuestions[i], pooledQuestions[j]] = [pooledQuestions[j], pooledQuestions[i]];
    }

    // Take up to requested count
    const targetCount = Math.min(reqCount, pooledQuestions.length);
    const selectedQuestions = pooledQuestions.slice(0, targetCount);

    let paperTitle = "Council Paper 1 Mock Exam";
    if (paperType === "Paper2") {
      paperTitle = "Council Paper 2 Mock Exam";
    } else if (paperType === "Custom") {
      paperTitle = `Custom Mixed Mock Exam (${targetCount} Questions)`;
    }

    return NextResponse.json({
      success: true,
      paperTitle,
      paperType,
      timeLimitMinutes: reqTimeLimit,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
    });
  } catch (error: any) {
    console.error("Error generating mock exam:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate mock exam." },
      { status: 500 }
    );
  }
}
