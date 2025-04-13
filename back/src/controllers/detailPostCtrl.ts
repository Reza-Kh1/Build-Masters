import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const createDetailPost = expressAsyncHandler(async (req, res) => {
    const { content, title, keyword, postId } = req.body
    try {
        const data = await prisma.detailPost.create({
            data: {
                content, title, keyword, postId
            }
        })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updateDetailPost = expressAsyncHandler(async (req, res) => {
    const { content, title, keyword, postId } = req.body
    try {
        const data = await prisma.detailPost.update({
            where: {
                postId: Number(postId)
            },
            data: {
                content, title, keyword
            }
        })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

export {
    createDetailPost,
    updateDetailPost
}