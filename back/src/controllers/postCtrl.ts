import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

type QueryPost = {
  tags?: string;
  isPublished?: string;
  search?: string;
  category?: number;
  order?: 'desc' | 'asc';
  page?: number;
};

const getAllPost = expressAsyncHandler(async (req, res) => {
  const {
    tags,
    isPublished,
    search,
    category,
    order,
    page = 1,
  }: QueryPost = req.query;
  try {
    const keyCache = 'posts:all';
    // const cache = await getCache(keyCache);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
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
      isPublished: isPublished === 'false' ? false : true,
      categoryId: category ? Number(category) : undefined,
    } as any;
    if (search) {
      searchFilter.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const data = await prisma.post.findMany({
      where: searchFilter,
      include: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
    });
    // setCache(keyCache, data);
    const count = await prisma.post.count({ where: searchFilter });
    const pager = pagination(count, Number(page), pageLimit);
    res.send({ data, pagination: pager });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSinglePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const keyCache = `posts:${id}`;
    // const cache = await getCache(keyCache);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
    const data = await prisma.post.findUnique({
      where: { name: id },
      include: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
        Comment: true,
        DetailPost: true,
        Tags: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    // setCache(keyCache, data);
    if (!data) {
      res.status(404).json({ msg: 'Not Found' });
      return;
    }
    res.send(data || null);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createPost = expressAsyncHandler(async (req, res) => {
  const { name, image, description, isPublished, tags, userId, categoryId } =
    req.body;
  try {
    await prisma.post.create({
      data: {
        name,
        image,
        description,
        isPublished,
        Tags: {
          connect: tags.map((id: string) => ({ id })),
        },
        user: {
          connect: { id: userId },
        },
        Category: {
          connect: { id: Number(categoryId) },
        },
      },
    });
    deleteCahce('posts:*');
    res.send({ success: true });
  } catch (err) {
    console.log(err);

    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updatePost = expressAsyncHandler(async (req, res) => {
  const { name, image, description, isPublished, tags, userId, categoryId } =
    req.body;
  const { id } = req.params;
  try {
    await prisma.post.update({
      data: {
        name,
        image,
        description,
        isPublished,
        Tags: {
          set: tags.map((id: string) => ({ id })),
        },
        userId,
        categoryId,
      },
      where: {
        id: Number(id),
      },
    });
    deleteCahce('posts:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deletePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    deleteCahce('posts:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export { getAllPost, getSinglePost, createPost, updatePost, deletePost };
