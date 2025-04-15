import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString(36).slice(-5)}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single('file');
export default upload;
