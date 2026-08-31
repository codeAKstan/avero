import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./User";
import "./Course";

export interface IBookmark extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema: Schema<IBookmark> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [{ type: String }],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Bookmark) {
  delete mongoose.models.Bookmark;
}

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
