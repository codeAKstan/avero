import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
  telegram?: string;
}

export interface ISetting extends Document {
  key: string;
  socialLinks: ISocialLinks;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  copyrightText: string;
  updatedAt: Date;
}

const SettingSchema: Schema<ISetting> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site_settings",
    },
    socialLinks: {
      twitter: { type: String, default: "https://twitter.com" },
      facebook: { type: String, default: "https://facebook.com" },
      instagram: { type: String, default: "https://instagram.com" },
      linkedin: { type: String, default: "https://linkedin.com" },
      youtube: { type: String, default: "https://youtube.com" },
      whatsapp: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      telegram: { type: String, default: "" },
    },
    siteName: { type: String, default: "AVERO ACADEMY" },
    contactEmail: { type: String, default: "support@avero.academy" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    copyrightText: { type: String, default: "AVERO ACADEMY Technologies Inc. All rights reserved." },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
