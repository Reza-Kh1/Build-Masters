import express from 'express';
import { createComment, deleteComment, getAllComment, updateComment } from '../controllers/commentCtrl';
const route = express.Router();
route.route('/').post(createComment).get(getAllComment);
route.route('/:id').put(updateComment).delete(deleteComment)
export = route;
