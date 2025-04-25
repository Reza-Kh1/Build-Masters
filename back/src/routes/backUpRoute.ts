import express from 'express';
import {
  createBackUp,
  deleteBackUp,
  getAllBackUp,
  restorebackUp,
} from '../controllers/backUpCtrl';
import backupUploader from '../middlewares/backUpUploader';
const route = express.Router();
route
  .route('/')
  .post(createBackUp)
  .get(getAllBackUp)
  .put(backupUploader, restorebackUp);
route.route('/:id').delete(deleteBackUp);
export = route;
