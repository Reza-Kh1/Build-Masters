import express from 'express';
import { createProject, deleteProject, getAllProject, getSingleProject, updateProject } from '../controllers/projectCtrl';
const route = express.Router();
route.route('/').post(createProject).get(getAllProject)
route.route('/:id').put(updateProject).delete(deleteProject).get(getSingleProject)
export = route;