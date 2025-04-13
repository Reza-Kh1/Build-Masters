import express from 'express';
import { createContractor, deleteContractor, getAllContractor, updateContractor, getSingleContractor } from '../controllers/contractorCtrl';
const route = express.Router();
route.route('/').post(createContractor).get(getAllContractor);
route.route('/:id').put(updateContractor).delete(deleteContractor).get(getSingleContractor);
export = route;
