import express from 'express';
import { getPageData, savePageData } from '../controllers/pageDataCtrl';
const route = express.Router();
route.route('/').post(savePageData).get(getPageData);
export = route;
