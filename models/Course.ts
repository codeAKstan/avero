import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./Category";

export interface ICourseModule {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  order: number;
  estimatedMinutes?: number;
}

export interface IQuestion {
  _id?: Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  categoryId: Types.ObjectId;
  subcategoryName?: string;
  description: string;
  thumbnail?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Draft" | "Published" | "Archived";
  timeLimitMinutes: number;
  passingScorePercentage: number;
  allowedModes: ("Practice" | "Exam")[];
  modules: ICourseModule[];
  questions: IQuestion[];
  sourceDocumentUrl?: string;
  isFreeAccess?: boolean;
  freeQuestionLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema<ICourseModule>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  order: { type: Number, default: 0 },
  estimatedMinutes: { type: Number, default: 15 },
});

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true, trim: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true, trim: true },
  explanation: { type: String, default: "" },
});

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategoryName: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    timeLimitMinutes: {
      type: Number,
      default: 60,
    },
    passingScorePercentage: {
      type: Number,
      default: 75,
    },
    allowedModes: {
      type: [String],
      enum: ["Practice", "Exam"],
      default: ["Practice", "Exam"],
    },
    modules: {
      type: [CourseModuleSchema],
      default: [],
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    sourceDocumentUrl: {
      type: String,
      default: "",
    },
    isFreeAccess: {
      type: Boolean,
      default: true,
    },
    freeQuestionLimit: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Course) {
  delete mongoose.models.Course;
}

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
