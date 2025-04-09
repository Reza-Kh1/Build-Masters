import { PrismaClient } from '@prisma/client';
import { customError } from '../middlewares/globalError';
import { Response } from 'express';
import { createHash } from '../utils/hashPassword';
import token from 'jsonwebtoken';
import pagination from '../utils/pagination';
import expressAsyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
// import redis from "../utils/redisClient"
// const cacheKey = `users:${email}:${phone}:${role}:${page}`;
// const cachedData = await redis.get(cacheKey);
// await redis.setex(cacheKey, Number(process.env.REDIS_TIMER), JSON.stringify(responseData));
// const keys = await redis.keys(pattern);
// if (keys.length > 0) {
//     await redis.del(keys);
// }
const getUsers = expressAsyncHandler(async (req, res) => {
  res.send({ msg: 'ok' });
});
const registerUser = expressAsyncHandler(async (req, res) => {
  // if (checkUser.role !== "USER") {
  //   res.cookie("user", token, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //     maxAge: 30 * 24 * 60 * 60 * 1000,
  //   });
  // }
  res.send({ msg: "ok" })
})
const updateUser = expressAsyncHandler(async (req, res) => {
  res.send({ msg: "ok" })
})
const deleteUser = expressAsyncHandler(async (req, res) => {
  res.send({ msg: "ok" })
})
const forgetPassword = expressAsyncHandler(async (req, res) => {
  res.send({ msg: "ok" })
})
const loginUser = expressAsyncHandler(async (req, res) => {
  res.send({ msg: "ok" })
})
export {
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
  forgetPassword,
  loginUser
};
