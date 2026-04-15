import cloudinary from "../config/cloudinary";

export const extractPublicIdFromUrl = (url: string) => {
  try {
    const splitUrl = url.split("/upload/");
    if (splitUrl.length > 1) {
      const parts = splitUrl[1].split("/");
      if (parts[0].startsWith("v") && !isNaN(Number(parts[0].substring(1)))) {
        parts.shift();
      }
      const publicIdWithExtension = parts.join("/");
      return publicIdWithExtension.split(".")[0];
    }
    return null;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  const publicId = extractPublicIdFromUrl(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }
};
