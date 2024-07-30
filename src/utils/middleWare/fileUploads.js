import multer from "multer";
import AppError from "../appError.js";

export const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
};
let options = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("invalid image", 400), false);
    }
  }

  return multer({ storage,limits: {
    fileSize: 5000000 // 1MB
  }, fileFilter });
};

export const uploadSingleFile = (folderName, fieldName) =>
  options(folderName).single(fieldName);

export const uploadMixFile = (folderName, arrayFields) =>
  options(folderName).fields(arrayFields);
