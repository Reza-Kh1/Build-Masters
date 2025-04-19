import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

const getAllTag = expressAsyncHandler(async (req, res) => {
  try {
    const keyCache = 'Tag:all';
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.tag.findMany({ where: {} });
    setCache(keyCache, data);
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createTag = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    await prisma.tag.create({
      data: {
        name,
      },
    });
    deleteCahce('Tag:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteTag = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tag.delete({
      where: {
        id: Number(id),
      },
    });
    deleteCahce('Tag:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateTag = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    await prisma.tag.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    deleteCahce('Tag:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export { getAllTag, createTag, deleteTag, updateTag };
