import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./User";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  reference: string;
  amountNaira: number;
  plan: "pro_monthly" | "pro_annual";
  status: "pending" | "success" | "failed";
  paystackChannel?: string;
  paystackCustomerCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    amountNaira: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      enum: ["pro_monthly", "pro_annual"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paystackChannel: {
      type: String,
      default: "",
    },
    paystackCustomerCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
