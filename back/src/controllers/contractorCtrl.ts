import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import redis from '../utils/redisClient';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const getAllContractor = expressAsyncHandler(async (req, res) => {
  const { page = 1, order, tags, search, category } = req.query;
  try {
    const cacheKey = 'contractors:all';
    const cache = await getCache(cacheKey);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.contractor.findMany({ where: {} });
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createContractor = expressAsyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    socialMedia,
    bio,
    avatar,
    categoryId,
    tagName,
    userId,
  } = req.body;
  try {
    await prisma.contractor.create({
      data: {
        name,
        phone,
        email,
        socialMedia,
        bio,
        avatar,
        User: {
          connect: { id: userId },
        },
        Tags: {
          connect: tagName.map((id: string) => ({ id })),
        },
        Category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    deleteCahce('contractor:*');
    res.send({ success: true });
  } catch (err) {
    console.log(err);

    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateContractor = expressAsyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    socialMedia,
    bio,
    avatar,
    categoryId,
    tagName,
    userId,
  } = req.body;
  const { id } = req.params;
  try {
    await prisma.contractor.update({
      where: { id: Number(id) },
      data: {
        name,
        phone,
        email,
        socialMedia,
        bio,
        avatar,
        Tags: {
          set: tagName.map((id: string) => ({ id })),
        },
        userId: userId || undefined,
        categoryId: categoryId || undefined,
      },
    });
    deleteCahce('contractors:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteContractor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contractor.delete({ where: { id: Number(id) } });
    deleteCahce('contractors:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleContractor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const cacheKey = 'contractors:';
    const cache = await getCache(cacheKey);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.contractor.findUnique({
      where: { id: Number(id) },
      include: {
        Tags: true,
        Project: true,
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
        Comment: true,
      },
    });
    setCache(cacheKey, data);
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  createContractor,
  getAllContractor,
  updateContractor,
  deleteContractor,
  getSingleContractor,
};
