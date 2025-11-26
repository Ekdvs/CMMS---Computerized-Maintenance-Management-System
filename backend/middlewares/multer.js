import multer from "multer";

// Memory storage for buffer uploads
const storage = multer.memoryStorage();

// Allowed file types for CMMS module
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime", 
  "video/x-msvideo", 
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP images, MP4/MOV/AVI videos, and PDF/DOCX documents are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export default upload;
