import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader for course thumbnails, category icons, etc.
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      if (!token) throw new UploadThingError("Unauthorized");

      const decoded = verifyAdminToken(token);
      if (!decoded || decoded.role !== "admin") throw new UploadThingError("Unauthorized admin access required");

      return { adminId: decoded.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = file.ufsUrl || file.url;
      console.log("Upload complete for adminId:", metadata.adminId);
      console.log("File URL:", fileUrl);
      return { uploadedBy: metadata.adminId, url: fileUrl, ufsUrl: fileUrl };
    }),

  // Document uploader for OCR AI extraction (PDF, DOCX, TXT)
  documentUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    text: { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      if (!token) throw new UploadThingError("Unauthorized");

      const decoded = verifyAdminToken(token);
      if (!decoded || decoded.role !== "admin") throw new UploadThingError("Unauthorized");

      return { adminId: decoded.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = file.ufsUrl || file.url;
      return { uploadedBy: metadata.adminId, url: fileUrl, ufsUrl: fileUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
