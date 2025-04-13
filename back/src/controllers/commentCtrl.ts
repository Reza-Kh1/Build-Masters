import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const getAllComment = expressAsyncHandler(async (req, res) => {
    const { page = 1, postId, contractorId } = req.query
    try {
        const data = await prisma.comment.findMany({ where: {} })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const createComment = expressAsyncHandler(async (req, res) => {
    const { isPublished, name, phone, email, content, rating, postId, contractorId, commentReply } = req.body
    try {
        await prisma.comment.create({
            data: {
                isPublished, name, phone, email, content, rating, postId, contractorId, commentReply
            }
        })
        deleteCahce("Contractor:*")
        res.send({ success: true });
    } catch (err) {
        console.log(err);

        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updateComment = expressAsyncHandler(async (req, res) => {
    const { isPublished, name, phone, email, content, rating, postId, contractorId, commentReply } = req.body
    try {
        await prisma.comment.create({
            data: {
                isPublished, name, phone, email, content, rating, postId, contractorId, commentReply
            }
        })
        deleteCahce("Contractor:*")
        res.send({ success: true });
    } catch (err) {
        console.log(err);

        throw customError('خطا در دیتابیس', 500, err);
    }
});

const deleteComment = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        })
        res.send({ success: true });
    } catch (err) {
        console.log(err);

        throw customError('خطا در دیتابیس', 500, err);
    }
});
export {
    getAllComment,
    createComment,
    updateComment,
    deleteComment
}