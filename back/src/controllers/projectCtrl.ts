import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
import { convertToNumberArray } from './contractorCtrl';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

type QueryProject = {
  tags?: string;
  page?: number;
  order?: 'asc' | 'desc';
  category?: string;
  search?: string;
  contractor?: string;
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
    contractor
  }: QueryProject = req.query;
  try {
    const keyCache = `Projects:${tags}&${page}&${order}&${category}&${search}&${isPublished}`;
    // const cache = await getCache(keyCache);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
    const numberTags = convertToNumberArray(tags)
    const searchFilter = {
      Tags:
        numberTags.length > 0
          ? {
            some: {
              id: { in: numberTags },
            },
          }
          : undefined,
      isPublished:
        isPublished === 'false'
          ? false
          : isPublished === 'true'
            ? true
            : undefined,
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
    if (contractor) {
      searchFilter.Contractor = {
        name: {
          contains: contractor, mode: 'insensitive'
        }
      }
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
            id: true,
          },
        },
        Contractor: {
          select: {
            name: true,
            id: true,
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
    const count = await prisma.project.count({ where: searchFilter });
    const pager = pagination(count, Number(page), pageLimit);
    res.send({ data, pagination: pager });
  } catch (err) {
    console.log(err);

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
        Category: {
          connect: { id: Number(categoryId) },
        },
        Contractor: {
          connect: { id: Number(contractorId) },
        },
        Tags: tags?.length
          ? {
            connect: tags.map((id: string | number) => ({ id: Number(id) })),
          }
          : undefined,
      },
    });
    deleteCahce('Projects:*');
    res.send({ success: true });
  } catch (err) {
    console.log(err);

    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleProject = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const keyCache = `Projects:${id}`;
    // const cache = await getCache(keyCache);
    // if (cache) {
    //   res.send(cache);
    //   return;
    // }
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
            id: true,
            name: true,
          },
        },
      },
    });
    const projects = await prisma.project.findMany({
      where: {
        NOT: { id: data?.id },
        categoryId: data?.categoryId
      },
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
            id: true,
          },
        },
        Contractor: {
          select: {
            name: true,
            id: true,
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
      take: 5,
      orderBy: { updateAt: 'desc' }
    })
    const body = {
      data,
      projects
    }
    // setCache(keyCache, data);
    res.send(body);
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
        categoryId: Number(categoryId),
        contractorId: Number(contractorId),
        Tags: tags?.length
          ? {
            set: tags.map((id: string | number) => ({ id: Number(id) })),
          }
          : undefined,
      },
    });
    deleteCahce('Projects:*');
    res.send({ success: true });
  } catch (err) {
    console.log(err);

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
