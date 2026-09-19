import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./User";
import "./Course";

export interface IFlaggedQuestion extends Document {
  userId?: Types.ObjectId;
  userName?: string;
  userEmail?: string;
  courseId?: Types.ObjectId;
  courseTitle?: string;
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  reason: string;
  details?: string;
  status: "Pending" | "Reviewed" | "Resolved" | "Dismissed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FlaggedQuestionSchema: Schema<IFlaggedQuestion> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type: String,
      default: "Student",
    },
    userEmail: {
      type: String,
      default: "",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    courseTitle: {
      type: String,
      default: "General Question Bank",
    },
    questionId: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "Flagged for review",
    },
    details: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved", "Dismissed"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.FlaggedQuestion) {
  delete mongoose.models.FlaggedQuestion;
}

const FlaggedQuestion: Model<IFlaggedQuestion> =
  mongoose.models.FlaggedQuestion ||
  mongoose.model<IFlaggedQuestion>("FlaggedQuestion", FlaggedQuestionSchema);

export default FlaggedQuestion;
