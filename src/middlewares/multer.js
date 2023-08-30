import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cd) => cb(null, `./public`),
  filename: (req, file, cb) => cb(null, filename.originalname),
});

export const uploader = multer({ storage });
