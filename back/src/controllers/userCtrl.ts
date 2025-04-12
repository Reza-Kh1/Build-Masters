import { customError } from '../middlewares/globalError';
import { comaprePassword, createHash } from '../utils/hashPassword';
import pagination from '../utils/pagination';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import redis from '../utils/redisClient';
import createToken from '../utils/createToken';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
// const cacheKey = `users:${email}:${phone}:${role}:${page}`;
// const cachedData = await redis.get(cacheKey);
// await redis.setex(cacheKey, Number(process.env.REDIS_TIMER), JSON.stringify(responseData));
// const keys = await redis.keys(pattern);
// if (keys.length > 0) {
//     await redis.del(keys);
// }
const getUsers = expressAsyncHandler(async (req, res) => {
  const { email, phone, role, page = 1 } = req.query;
  const cacheKey = `users:${email}:${phone}:${role}:${page}`;
  const cache = await getCache(cacheKey);
  if (cache) {
    res.send(cache);
    return;
  }
  try {
    const search = {} as any;
    if (email || phone) {
      search.OR = [
        { email: email ? { contains: email.toString() } : {} },
        { phone: phone ? { contains: phone.toString() } : {} },
      ];
    }
    if (role) search.role = role.toString();
    const data = await prisma.user.findMany({
      where: search,
      select: {
        role: true,
        email: true,
        name: true,
        id: true,
        createdAt: true,
        phone: true,
      },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
    });
    const count = await prisma.user.count({ where: search });
    const pages = pagination(count, Number(page), pageLimit);
    setCache(cacheKey, JSON.stringify({ data: data, pagination: pages }));
    res.send({ data: data, pagination: pages });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const signUpUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).send({ message: 'با این ایمیل ثبت نام شده است' });
        return;
      }
      if (existingUser.phone === phone) {
        res.status(400).send({ message: 'بااین شماره تلفن ثبت نام شده است' });
        return;
      }
    }
    deleteCahce('users:*');
    const userCount = await prisma.user.count();
    const finalRole = userCount === 0 ? 'ADMIN' : role || 'AUTHOR';
    const hash = await createHash(password);
    const data = (await prisma.user.create({
      data: { name, email, password: hash, phone, role: finalRole },
    })) as any;
    const token = createToken({
      id: data.id,
      name: data.name,
      role: data.role,
    });
    delete data.password;
    res.send({ token, data });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const updateUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const { id } = req.params;
  try {
    const hash = await createHash(password);
    const data = (await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        password: hash || undefined,
        role: role || undefined,
      },
    })) as any;
    delete data.password;
    deleteCahce('users:*');
    const token = createToken({
      id: data.id,
      name: data.name,
      role: data.role,
    });
    res.send({ token, data });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    deleteCahce('users:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});
const forgetPassword = expressAsyncHandler(async (req, res) => {
  res.send({ msg: 'ok' });
});
const signInUser = expressAsyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;
  const data = (await prisma.user.findUnique({
    where: {
      email: email || undefined,
      phone: phone || undefined,
    },
  })) as any;
  if (!data) {
    res.status(404).send({ msg: 'کاربری با این مشخصات یافت نشد !' });
  }
  await comaprePassword(password, data?.password || '');
  try {
    if (!data.password) return;
    delete data.password;
    const token = createToken({
      id: data.id,
      name: data.name,
      role: data.role,
    });
    res.send({ token, data });
  } catch (err) {
    throw customError('با خطا روبرو شدیم', 500, err);
  }
});

export {
  getUsers,
  signUpUser,
  updateUser,
  deleteUser,
  forgetPassword,
  signInUser,
};
