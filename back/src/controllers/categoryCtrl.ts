import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { Category, PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const getCategory = expressAsyncHandler(async (req, res) => {
  const { admin } = req.query;
  try {
    const keyCache = `Category:${admin ? 'admin' : 'all'}`;
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    let data: Category | Category[] | null;
    if (admin) {
      data = await prisma.category.findMany({
        select: {
          name: true,
          slug: true,
          id: true,
          subCategoryId: true,
          SubCategoryTo: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      data = await prisma.category.findMany({
        where: {
          subCategoryId: null,
        },
        include: {
          SubCategorys: {
            include: {
              SubCategorys: {
                include: {
                  SubCategorys: true,
                },
              },
            },
          },
        },
      });
    }
    setCache(keyCache, data);
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createCategory = expressAsyncHandler(async (req, res) => {
  const { name, slug, subCategoryId } = req.body;
  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        subCategoryId: Number(subCategoryId) || undefined,
      },
    });
    deleteCahce('Category:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateCategory = expressAsyncHandler(async (req, res) => {
  const { name, slug, subCategoryId } = req.body;
  const { id } = req.params;
  try {
    await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        subCategoryId: subCategoryId === null ? null : Number(subCategoryId),
      },
    });
    deleteCahce('Category:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    deleteCahce('Category:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const keyCache = `Category:${id}`;
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.category.findUnique({
      where: { slug: id },
      include: {
        Post: {
          orderBy: {
            createdAt: 'desc',
          },
          skip: (1 - 1) * pageLimit,
          take: pageLimit,
        },
        Contractor: {
          orderBy: {
            createdAt: 'desc',
          },
          skip: (1 - 1) * pageLimit,
          take: pageLimit,
        },
        Project: {
          orderBy: {
            createdAt: 'desc',
          },
          skip: (1 - 1) * pageLimit,
          take: pageLimit,
        },
      },
    });
    setCache(keyCache, data);
    res.send({ data: data });
  } catch (err) {
    console.log(err);

    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  getSingleCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
