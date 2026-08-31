import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ExamAttempt from "@/models/ExamAttempt";
import User from "@/models/User";
import Course from "@/models/Course";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();

    const attempts = await ExamAttempt.find()
      .populate("userId", "fullName email role university")
      .populate("courseId", "title categoryId subcategoryName")
      .sort({ createdAt: -1 });

    const totalAttempts = attempts.length;
    const passedCount = attempts.filter((a) => a.passed).length;
    const overallPassRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
    
    const sumScores = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = totalAttempts > 0 ? Math.round(sumScores / totalAttempts) : 0;

    // Track missed questions frequency
    const missedQuestionsMap: Record<string, { questionText: string; courseTitle: string; failCount: number }> = {};

    attempts.forEach((attempt) => {
      if (Array.isArray(attempt.answers)) {
        attempt.answers.forEach((ans) => {
          if (!ans.isCorrect) {
            const key = ans.questionText;
            if (!missedQuestionsMap[key]) {
              missedQuestionsMap[key] = {
                questionText: ans.questionText,
                courseTitle: (attempt.courseId as any)?.title || "General Exam",
                failCount: 0,
              };
            }
            missedQuestionsMap[key].failCount += 1;
          }
        });
      }
    });

    const topFailedQuestions = Object.values(missedQuestionsMap)
      .sort((a, b) => b.failCount - a.failCount)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      telemetry: {
        totalAttempts,
        passedCount,
        failedCount: totalAttempts - passedCount,
        overallPassRate,
        avgScore,
        topFailedQuestions,
        recentAttempts: attempts.slice(0, 15),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch candidate analytics." }, { status: 500 });
  }
}
