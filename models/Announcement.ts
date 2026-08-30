import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  targetRole: "all" | "student" | "educator";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema<IAnnouncement> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "urgent"],
      default: "info",
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "educator"],
      default: "all",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Announcement) {
  delete mongoose.models.Announcement;
}

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
