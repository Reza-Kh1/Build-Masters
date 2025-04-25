import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const backupFolder = path.join(__dirname, '../../public/backup');
    cb(null, backupFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const backupUploader = multer({ storage }).single('backUp');
export default backupUploader;
