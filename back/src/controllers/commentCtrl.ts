import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
import pagination from '../utils/pagination';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const getAllComment = expressAsyncHandler(async (req, res) => {
    const { page = 1, postId, contractorId, isPublished, type, name, order } = req.query
    let search = {} as any;
    let includeFilter = {} as any
    try {
        if (postId || contractorId) {
            includeFilter = {
                CommentReplys: true
            }
            search = {
                postId: Number(postId) || undefined,
                commentReply: null,
                contractorId: Number(contractorId) || undefined
            }
        } else {
            search = {
                isPublished: isPublished || undefined,
                type: type || undefined
            }
        }
        const data = await prisma.comment.findMany({
            where: search,
            include: includeFilter,
            skip: (Number(page) - 1) * pageLimit,
            orderBy: { createdAt: "desc" },
            take: pageLimit,
        })
        const count = await prisma.comment.count({ where: search });
        const pages = pagination(count, Number(page), pageLimit);
        res.send({ data, pagination: pages });
    } catch (err) {
        console.log(err);

        throw customError('خطا در دیتابیس', 500, err);
    }
});

const createComment = expressAsyncHandler(async (req, res) => {
    const { isPublished, name, phone, content, rating, postId, contractorId, commentReply } = req.body
    try {
        await prisma.comment.create({
            data: {
                isPublished, name, phone, content, rating, postId, contractorId, commentReply
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
    const { isPublished, name, phone, content, rating, commentReply } = req.body
    const { id } = req.params
    try {
        await prisma.comment.update({
            where: {
                id: Number(id)
            },
            data: {
                isPublished, name, phone, content, rating, commentReply
            }
        })
        deleteCahce("Contractor:*")
        res.send({ success: true });
    } catch (err) {
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
        throw customError('خطا در دیتابیس', 500, err);
    }
});

export {
    getAllComment,
    createComment,
    updateComment,
    deleteComment
}