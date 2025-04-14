import express from 'express';
import {
  createDetailPost,
  updateDetailPost,
} from '../controllers/detailPostCtrl';
const route = express.Router();
route.route('/').post(createDetailPost).put(updateDetailPost);
export = route;
