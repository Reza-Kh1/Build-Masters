import express from 'express';
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/userCtrl';
const route = express.Router();
route.route('/').post(createUser).get(getUsers);
route.route('/:id').put(updateUser).delete(deleteUser);
export = route;
