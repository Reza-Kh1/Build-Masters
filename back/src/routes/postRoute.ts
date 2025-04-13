import express from 'express';
import { createPost, deletePost, getAllPost, getSinglePost, updatePost } from '../controllers/postCtrl';
const route = express.Router();
route.route('/').post(createPost).get(getAllPost)
route.route('/:id').put(updatePost).delete(deletePost).get(getSinglePost)
export = route;
