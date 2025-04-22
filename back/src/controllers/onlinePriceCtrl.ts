import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

type QueryOnlinePrice = {
  page?: number;
  status?: string;
  order?: 'desc' | 'asc';
};

const createOnlinePrice = expressAsyncHandler(async (req, res) => {
  const { name, phone, description, price, subject, images, size } = req.body;
  try {
    await prisma.onlinePrice.create({
      data: {
        name,
        phone,
        description,
        price,
        subject,
        images,
        size,
      },
    });
    deleteCahce('onlinePrice:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getAllOnlinePrice = expressAsyncHandler(async (req, res) => {
  const { page = 1, status, order }: QueryOnlinePrice = req.query;
  try {
    const cacheKey = `onlinePrice:${page}&${status}${order}`;
    // const cache = await getCache(cacheKey);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
    const searchFilter = {
      isStatus: status === 'true' ? true : false,
    };
    const data = await prisma.onlinePrice.findMany({
      where: searchFilter,
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
    });

    const count = await prisma.onlinePrice.count({ where: searchFilter });
    const pager = pagination(count, Number(page), pageLimit);
    // setCache(cacheKey, data);
    res.send({ data, pagination: pager });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateOnlinePrice = expressAsyncHandler(async (req, res) => {
  const { isStatus } = req.body;
  const { id } = req.params;
  try {
    await prisma.onlinePrice.update({
      data: {
        isStatus,
      },
      where: {
        id: Number(id),
      },
    });
    deleteCahce('onlinePrice:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteOnlinePrice = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.onlinePrice.delete({
      where: {
        id: Number(id),
      },
    });
    deleteCahce('onlinePrice:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  createOnlinePrice,
  getAllOnlinePrice,
  updateOnlinePrice,
  deleteOnlinePrice,
};
