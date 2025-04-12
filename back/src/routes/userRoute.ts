import express from 'express';
import {
  getUsers,
  signUpUser,
  deleteUser,
  updateUser,
  signInUser,
} from '../controllers/userCtrl';
const route = express.Router();
route.route('/').post(signUpUser).get(getUsers).put(signInUser);
route.route('/:id').put(updateUser).delete(deleteUser);
export = route;
