// src/middlewares/multerCloudinary.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "social-media-users",
      format: "png", // or auto
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

export const upload = multer({ storage });
