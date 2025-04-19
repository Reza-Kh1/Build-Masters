import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

type QueryProject = {
  tags?: string;
  page?: number;
  order?: 'asc' | 'desc';
  category?: string;
  search?: string;
  isPublished?: string;
};

const getAllProject = expressAsyncHandler(async (req, res) => {
  const {
    tags,
    page = 1,
    order,
    category,
    search,
    isPublished,
  }: QueryProject = req.query;
  try {
    const keyCache = `Projects:${tags}&${page}&${order}&${category}&${search}&${isPublished}`;
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
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
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const data = await prisma.project.findMany({
      where: searchFilter,
      select: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
        Tags: {
          select: {
            name: true,
          },
        },
        Contractor: {
          select: {
            name: true,
            avatar: true,
          },
        },
        name: true,
        slug: true,
        image: true,
        id: true,
        address: true,
        isPublished: true,
        updateAt: true,
      },
      orderBy: { createdAt: order || 'desc' },
      skip: (Number(page) - 1) * pageLimit,
      take: pageLimit,
    });

    setCache(keyCache, data);
    const count = await prisma.post.count({ where: searchFilter });
    const pager = pagination(count, Number(page), pageLimit);
    res.send({ data, pagination: pager });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createProject = expressAsyncHandler(async (req, res) => {
  const {
    name,
    slug,
    address,
    image,
    gallery,
    video,
    description,
    stratDate,
    endDate,
    price,
    isPublished,
    categoryId,
    tags,
    contractorId,
  } = req.body;
  try {
    await prisma.project.create({
      data: {
        name,
        slug,
        address,
        image,
        gallery,
        video,
        description,
        stratDate,
        endDate,
        price,
        isPublished,
        categoryId,
        Tags: {
          connect: tags.map((id: string) => ({ id })),
        },
        contractorId,
      },
    });
    deleteCahce('Projects:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleProject = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const keyCache = `Projects:${id}`;
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.project.findUnique({
      where: { slug: id },
      include: {
        Category: {
          select: {
            name: true,
            slug: true,
          },
        },
        Contractor: {
          select: {
            name: true,
            rating: true,
            phone: true,
            createdAt: true,
          },
        },
        Tags: {
          select: {
            name: true,
          },
        },
      },
    });
    setCache(keyCache, data);
    res.send(data);
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateProject = expressAsyncHandler(async (req, res) => {
  const {
    name,
    slug,
    address,
    image,
    gallery,
    video,
    description,
    stratDate,
    endDate,
    price,
    isPublished,
    categoryId,
    tags,
    contractorId,
  } = req.body;
  const { id } = req.params;
  try {
    await prisma.project.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        address,
        image,
        gallery,
        video,
        description,
        stratDate,
        endDate,
        price,
        isPublished,
        categoryId,
        Tags: {
          set: tags.map((id: string) => ({ id })),
        },
        contractorId,
      },
    });
    deleteCahce('Projects:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteProject = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    deleteCahce('Projects:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  getAllProject,
  createProject,
  getSingleProject,
  updateProject,
  deleteProject,
};
