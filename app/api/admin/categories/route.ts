import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch categories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, subcategories, description, icon, order, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    await connectToDatabase();

    const formattedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Category.findOne({ slug: formattedSlug });
    if (existing) {
      return NextResponse.json({ error: "Category with this slug already exists." }, { status: 400 });
    }

    const formattedSubcategories = Array.isArray(subcategories)
      ? subcategories
          .filter((sub: any) => typeof sub === "string" ? sub.trim() : sub?.name?.trim())
          .map((sub: any) => {
            const subName = typeof sub === "string" ? sub.trim() : sub.name.trim();
            const subSlug = (typeof sub === "object" && sub.slug)
              ? sub.slug
              : subName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
            return { name: subName, slug: subSlug };
          })
      : [];

    const category = await Category.create({
      name,
      slug: formattedSlug,
      subcategories: formattedSubcategories,
      description,
      icon: icon || "BookOpen",
      order: order || 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create category." }, { status: 500 });
  }
}
