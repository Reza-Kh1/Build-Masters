import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
type QueryContractor = {
  page?: number;
  order?: 'desc' | 'asc';
  tags?: string;
  search?: string;
  category?: number;
  allContractorname?: string;
};

const getAllContractor = expressAsyncHandler(async (req, res) => {
  const {
    page = 1,
    order,
    tags,
    search,
    category,
    allContractorname,
  }: QueryContractor = req.query;
  try {
    const cacheKey = `Contractors:${page}&${order}&${tags}&${search}&${category}`;
    // const cache = await getCache(cacheKey);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
    if (allContractorname === 'true') {
      const data = await prisma.contractor.findMany({ select: { name: true, id: true } });
      res.send(data);
      return;
    }
    const tagFilter = tags
      ? JSON.parse(tags).map((i: number) => Number(i))
      : [];
    const searchFilter = {
      Tags:
        tagFilter.length > 0
          ? {
            some: {
              id: { in: tagFilter },
            },
          }
          : undefined,
      name: search
        ? {
          contains: search,
          mode: 'insensitive',
        }
        : undefined,
      categoryId: category ? Number(category) : undefined,
    } as any;
    const data = await prisma.contractor.findMany({
      where: searchFilter,
      select: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
        userId: true,
        id: true,
        Tags: true,
        avatar: true,
        name: true,
        createdAt: true,
        rating: true,
        totalComment: true,
      },
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
    });
    const count = await prisma.contractor.count({ where: searchFilter });
    const pager = pagination(count, Number(page), pageLimit);
    setCache(cacheKey, { data, pagination: pager });
    res.send({ data, pagination: pager });
  } catch (err) {
    console.log(err);

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
        Tags: tagName?.length
          ? {
            connect: tagName.map((id: string) => ({ id })),
          }
          : undefined,
        Category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    deleteCahce('Contractors:*');
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
        userId: userId || undefined,
        categoryId: Number(categoryId) || undefined,
        Tags: tagName?.length
          ? {
            set: tagName.map((id: string) => ({ id })),
          }
          : undefined,
      },
    });
    deleteCahce('Contractors:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteContractor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contractor.delete({ where: { id: Number(id) } });
    deleteCahce('Contractors:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleContractor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const cacheKey = `Contractors:${id}`;
    const cache = await getCache(cacheKey);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.contractor.findUnique({
      where: { name: id },
      include: {
        Tags: true,
        Project: true,
        Category: {
          select: {
            id: true,
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
