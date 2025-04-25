import express from 'express';
import {
  createComment,
  deleteComment,
  getAllComment,
  publishedComment,
  updateComment,
} from '../controllers/commentCtrl';
const route = express.Router();
route.route('/').post(createComment).get(getAllComment).put(publishedComment);
route.route('/:id').put(updateComment);
route.route('/delete').post(deleteComment);
export = route;
