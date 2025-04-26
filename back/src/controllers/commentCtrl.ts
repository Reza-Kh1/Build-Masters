import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
import token from 'jsonwebtoken';
import path from 'path';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
type QueryComment = {
  page?: number;
  postId?: string;
  contractorId?: string;
  isPublished?: string;
  type?: 'post' | 'contractor';
  name?: string;
  order?: 'desc' | 'asc';
  isAdmin?: 'true' | 'false';
};

const getAllComment = expressAsyncHandler(async (req, res) => {
  const {
    page = 1,
    postId,
    contractorId,
    isPublished,
    type,
    order,
    isAdmin,
  }: QueryComment = req.query;
  let search = {} as any;
  let includeFilter = {} as any;
  if (isAdmin) {
    includeFilter = {
      Post: {
        select: {
          name: true,
        },
      },
      Contractor: {
        select: {
          name: true,
        },
      },
    };
  }
  if (postId) {
    search = {
      isPublished: true,
      postId: Number(postId),
    };
  }
  if (contractorId) {
    search = {
      isPublished: true,
      contractorId: Number(contractorId),
    };
  }
  if (type) {
    search =
      type === 'post'
        ? {
          contractorId: null,
        }
        : {
          postId: null,
        };
  }
  search.isPublished = isPublished === 'true' ? true : false
  try {
    const data = await prisma.comment.findMany({
      where: search,
      include: includeFilter,
      skip: (Number(page) - 1) * pageLimit,
      orderBy: { createdAt: order || 'desc' },
      take: pageLimit,
    });
    const count = await prisma.comment.count({ where: search });
    const pages = pagination(count, Number(page), pageLimit);
    res.send({ data, pagination: pages });
  } catch (err) {
    console.log(err);
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createComment = expressAsyncHandler(async (req, res) => {
  const { name, phone, content, rating, postId, contractorId, commentReply } =
    req.body;
  try {
    let isPublished = false;
    let roleType = 'USER' as any;
    const cookieKey = process.env.COOKIE_KEY as string;
    const cookie = req.cookies[cookieKey];
    if (cookie && commentReply) {
      const userInfo = token.verify(
        cookie,
        process.env.TOKEN_SECURITY as string
      ) as {
        id: string;
        role: 'ADMIN' | 'CONSTARCTOR' | 'AUTHOR';
      };
      roleType = userInfo.role;
      isPublished = true;
      if (postId) {
        await prisma.post.update({
          where: { id: postId },
          data: { totalComment: { increment: 1 } },
        });
      }
    }
    await prisma.comment.create({
      data: {
        isPublished,
        name,
        roleType: roleType || undefined,
        phone,
        content,
        rating,
        postId,
        contractorId,
        commentReply,
      },
    });
    deleteCahce('Contractor:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateComment = expressAsyncHandler(async (req, res) => {
  const { name, phone, content, rating, commentReply, isPublished } = req.body;
  const { id } = req.params;
  try {
    await prisma.comment.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        isPublished,
        phone,
        content,
        rating,
        commentReply,
      },
    });
    deleteCahce('Contractor:*');
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const publishedComment = expressAsyncHandler(async (req, res) => {
  const { isPublished, rating, postId, contractorId, id } = req.body;
  try {
    if (postId) {
      if (isPublished) {
        await prisma.post.update({
          where: { id: postId },
          data: { totalComment: { increment: 1 } },
        });
      } else {
        await prisma.post.update({
          where: { id: postId },
          data: { totalComment: { decrement: 1 } },
        });
      }
    }
    if (contractorId) {
      const data = await prisma.contractor.findUnique({
        where: { id: contractorId },
        select: { rating: true, totalComment: true },
      });
      const currentRating = Number(data?.rating) * Number(data?.totalComment);
      if (isPublished) {
        const newRating =
          (currentRating + Number(rating)) / (Number(data?.totalComment) + 1);
        await prisma.contractor.update({
          data: {
            rating: Number(newRating.toFixed(1)),
            totalComment: { increment: 1 },
          },
          where: {
            id: contractorId,
          },
        });
      } else {
        const newRating =
          (currentRating - Number(rating)) / (Number(data?.totalComment) - 1);
        await prisma.contractor.update({
          data: {
            rating: Number(newRating.toFixed(1)),
            totalComment: { decrement: 1 },
          },
          where: {
            id: contractorId,
          },
        });
      }
    }
    await prisma.comment.update({
      data: { isPublished: isPublished ? true : false },
      where: { id: Number(id) },
    });
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteComment = expressAsyncHandler(async (req, res) => {
  const { id, rating, postId, isPublished, contractorId } = req.body;
  try {
    if (isPublished) {
      if (postId) {
        await prisma.post.update({
          where: { id: postId },
          data: { totalComment: { decrement: 1 } },
        });
      } else {
        const data = await prisma.contractor.findUnique({
          where: { id: contractorId },
          select: { rating: true, totalComment: true },
        });
        const currentRating = Number(data?.rating) * Number(data?.totalComment);
        const newRating =
          (currentRating - Number(rating)) / (Number(data?.totalComment) - 1);
        await prisma.contractor.update({
          data: {
            rating: Number(newRating.toFixed(1)),
            totalComment: { decrement: 1 },
          },
          where: {
            id: contractorId,
          },
        });
      }
    }
    await prisma.comment.delete({
      where: {
        id: Number(id),
      },
    });
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export {
  getAllComment,
  createComment,
  updateComment,
  deleteComment,
  publishedComment,
};
