import express from 'express';
import {
  createTag,
  deleteTag,
  getAllTag,
  updateTag,
} from '../controllers/tagCtrl';
const route = express.Router();
route.route('/').post(createTag).get(getAllTag);
route.route('/:id').put(updateTag).delete(deleteTag);
export = route;
