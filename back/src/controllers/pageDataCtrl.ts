import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PageData, PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

const createPageData = expressAsyncHandler(async (req, res) => {
  const { page, conetent, keyword, description, title, name, canonicalUrl } =
    req.body;
  try {
    await prisma.pageData.create({
      data: {
        page,
        conetent,
        keyword,
        description,
        title,
        name,
        canonicalUrl,
      },
    });
    deleteCahce('pageData:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getPageData = expressAsyncHandler(async (req, res) => {
  const { page } = req.query;
  try {
    const keyCache = `pageData:${page ? page : 'all'}`;
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    let data: PageData | PageData[] | null | { page: string }[];
    if (!page) {
      data = await prisma.pageData.findMany({
        where: {},
        select: {
          page: true,
        },
      });
    } else {
      data = await prisma.pageData.findUnique({
        where: { page: page?.toString() },
      });
    }
    setCache(keyCache, data);
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updatePageData = expressAsyncHandler(async (req, res) => {
  const { conetent, keyword, description, title, name, canonicalUrl } =
    req.body;
  const { id } = req.params;
  try {
    await prisma.pageData.update({
      where: {
        id: Number(id),
      },
      data: {
        conetent,
        keyword,
        description,
        title,
        name,
        canonicalUrl,
      },
    });
    deleteCahce('pageData:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export { createPageData, getPageData, updatePageData };
