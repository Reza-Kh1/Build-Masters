import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

const getAllProject = expressAsyncHandler(async (req, res) => {
  const {} = req.query;
  try {
    const keyCache = 'projects:all';
    const cache = await getCache(keyCache);
    if (cache) {
      res.send(cache);
      return;
    }
    const data = await prisma.project.findMany({
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
        description: true,
        isPublished: true,
        updateAt: true,
      },
    });
    setCache(keyCache, data);
    res.send(data);
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
    deleteCahce('projects:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const getSingleProject = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const keyCache = `projects:${id}`;
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
    deleteCahce('projects:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteProject = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    deleteCahce('projects:*');
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
