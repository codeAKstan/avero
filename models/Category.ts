import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISubcategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  subcategories: ISubcategory[];
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true },
});

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    subcategories: {
      type: [SubcategorySchema],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: "BookOpen",
    },
    order: {
      type: Number,
      default: 0,
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

// Clear model cache in dev to avoid stale schema errors
if (mongoose.models && mongoose.models.Category) {
  delete mongoose.models.Category;
}

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
