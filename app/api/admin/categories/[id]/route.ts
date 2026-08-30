import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, subcategories, description, icon, order, isActive } = body;

    await connectToDatabase();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    if (name) category.name = name;
    if (slug) {
      category.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
    }
    if (Array.isArray(subcategories)) {
      category.subcategories = subcategories
        .filter((sub: any) => typeof sub === "string" ? sub.trim() : sub?.name?.trim())
        .map((sub: any) => {
          const subName = typeof sub === "string" ? sub.trim() : sub.name.trim();
          const subSlug = (typeof sub === "object" && sub.slug)
            ? sub.slug
            : subName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
          return { name: subName, slug: subSlug };
        });
    }
    if (typeof description !== "undefined") category.description = description;
    if (icon) category.icon = icon;
    if (typeof order === "number") category.order = order;
    if (typeof isActive === "boolean") category.isActive = isActive;

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete category." }, { status: 500 });
  }
}
