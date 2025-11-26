import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileCloudinary = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const buffer = file.buffer;

    // Determine upload type based on mimetype
    let resourceType = "raw";
    if (file.mimetype.startsWith("image")) resourceType = "image";
    else if (file.mimetype.startsWith("video")) resourceType = "video";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cmms-files",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadFileCloudinary;
