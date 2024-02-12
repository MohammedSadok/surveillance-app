import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ])
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req }) => {

    // })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: "adminUcd" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
