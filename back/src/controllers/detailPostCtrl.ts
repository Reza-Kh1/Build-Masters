import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce } from '../utils/deleteCache';
const prisma = new PrismaClient();

const createDetailPost = expressAsyncHandler(async (req, res) => {
  const { content, title, keyword, postId } = req.body;
  try {
    await prisma.detailPost.create({
      data: {
        content,
        title,
        keyword,
        postId,
      },
    });
    deleteCahce(`posts:${postId}`);
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const updateDetailPost = expressAsyncHandler(async (req, res) => {
  const { content, title, keyword, postId } = req.body;
  try {
    await prisma.detailPost.update({
      where: {
        postId: Number(postId),
      },
      data: {
        content,
        title,
        keyword,
      },
    });
    deleteCahce(`posts:${postId}`);
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export { createDetailPost, updateDetailPost };