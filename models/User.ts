import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  role: "student" | "educator" | "admin";
  passwordHash?: string;
  studentType?: string;
  university?: string;
  gradYear?: string;
  isOnboarded: boolean;
  isSuspended?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },
    passwordHash: {
      type: String,
      select: false,
    },
    studentType: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    gradYear: {
      type: String,
      trim: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
