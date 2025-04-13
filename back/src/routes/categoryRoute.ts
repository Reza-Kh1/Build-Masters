import express from 'express';
import { getCategory, createCategory, deleteCategory, updateCategory, getSingleCategory } from '../controllers/categoryCtrl';
const route = express.Router();
route.route('/').post(createCategory).get(getCategory);
route.route('/:id').put(updateCategory).delete(deleteCategory).get(getSingleCategory);
export = route;
