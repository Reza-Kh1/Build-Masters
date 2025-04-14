import express from 'express';
import { deleteMedia, getAllMedia, uploadMedia } from '../controllers/mediaCtrl';
import upload from '../middlewares/upload';
const route = express.Router();
route.route('/').post(upload, uploadMedia).delete(deleteMedia).get(getAllMedia)
export = route;
