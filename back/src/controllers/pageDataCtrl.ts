import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PageData, PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

type QueryPageData = {
  conetent: string
  keyword: string[]
  description: string
  title: string
  name: string
  canonicalUrl: string
  page: string
}

const savePageData = expressAsyncHandler(async (req, res) => {
  const { conetent, keyword, description, title, name, page, canonicalUrl }: QueryPageData = req.body;
  try {
    await prisma.pageData.upsert({
      where: { page },
      create: { conetent, keyword, description, title, name, page, canonicalUrl },
      update: { conetent, keyword, description, title, name, canonicalUrl },
    });
    deleteCahce('PageData:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getPageData = expressAsyncHandler(async (req, res) => {
  const { page } = req.query;
  try {
    const keyCache = `PageData:${page ? page : 'all'}`;
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

export { savePageData, getPageData };
