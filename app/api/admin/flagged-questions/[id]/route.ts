import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import FlaggedQuestion from "@/models/FlaggedQuestion";
import Course from "@/models/Course";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request as any);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes, questionText, options, correctAnswer, explanation } = body;

    await connectToDatabase();
    const flagRecord = await FlaggedQuestion.findById(id);
    if (!flagRecord) {
      return NextResponse.json({ error: "Flagged question not found" }, { status: 404 });
    }

    if (status !== undefined) flagRecord.status = status;
    if (adminNotes !== undefined) flagRecord.adminNotes = adminNotes;

    // Check if admin is editing question content
    const isQuestionEdit =
      questionText !== undefined ||
      options !== undefined ||
      correctAnswer !== undefined ||
      explanation !== undefined;

    if (isQuestionEdit) {
      const oldQuestionText = flagRecord.questionText;

      if (questionText !== undefined) flagRecord.questionText = questionText;
      if (options !== undefined) flagRecord.options = options;
      if (correctAnswer !== undefined) flagRecord.correctAnswer = correctAnswer;
      if (explanation !== undefined) flagRecord.explanation = explanation;

      // Automatically mark resolved when question edited
      flagRecord.status = "Resolved";

      // If tied to a course, update the question in the Course model!
      if (flagRecord.courseId) {
        const course = await Course.findById(flagRecord.courseId);
        if (course && course.questions) {
          let updatedInCourse = false;
          course.questions = course.questions.map((q: any) => {
            const matchesId = q._id && q._id.toString() === flagRecord.questionId;
            const matchesText = q.question === oldQuestionText;

            if (matchesId || matchesText) {
              updatedInCourse = true;
              return {
                ...q,
                question: questionText !== undefined ? questionText : q.question,
                options: options !== undefined ? options : q.options,
                correctAnswer: correctAnswer !== undefined ? correctAnswer : q.correctAnswer,
                explanation: explanation !== undefined ? explanation : q.explanation,
              };
            }
            return q;
          });

          if (updatedInCourse) {
            await course.save();
          }
        }
      }
    }

    await flagRecord.save();

    return NextResponse.json({
      success: true,
      message: "Flagged question updated successfully.",
      flag: flagRecord,
    });
  } catch (error: any) {
    console.error("Error updating flagged question:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update flagged question." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request as any);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    await FlaggedQuestion.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Flagged question deleted.",
    });
  } catch (error: any) {
    console.error("Error deleting flagged question:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete flagged question." },
      { status: 500 }
    );
  }
}
