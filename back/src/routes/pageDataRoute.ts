import express from 'express';
import {
  createPageData,
  getPageData,
  updatePageData,
} from '../controllers/pageDataCtrl';
const route = express.Router();
route.route('/').post(createPageData).get(getPageData);
route.route('/:id').put(updatePageData);
export = route;
