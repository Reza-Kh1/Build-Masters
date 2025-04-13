import express from 'express';
import { createOnlinePrice, deleteOnlinePrice, getAllOnlinePrice, updateOnlinePrice } from '../controllers/onlinePriceCtrl';
const route = express.Router();
route.route('/').post(createOnlinePrice).get(getAllOnlinePrice);
route.route('/:id').put(updateOnlinePrice).delete(deleteOnlinePrice)
export = route;
