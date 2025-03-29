import multer, { type Multer } from "multer";
import type { Request } from "express";
import { ApiError } from "../lib/utils";

const multerFiltering = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    //@ts-ignore
    cb(new ApiError("Wrong file format", 400), false);
  }
};

export const upload: Multer = multer({
  fileFilter: multerFiltering,
  limits: {
    fileSize: 3000000,
  },
});
