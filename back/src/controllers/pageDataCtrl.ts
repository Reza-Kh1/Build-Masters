import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const createPageData = expressAsyncHandler(async (req, res) => {
    const { page, conetent, keyword, description, title, name, canonicalUrl } = req.body
    try {
        await prisma.pageData.create({
            data: {
                page, conetent, keyword, description, title, name, canonicalUrl
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const getPageData = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const data = await prisma.pageData.findMany({ where: { page: id } })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updatePageData = expressAsyncHandler(async (req, res) => {
    const { conetent, keyword, description, title, name, canonicalUrl } = req.body
    const { id } = req.params
    try {
        await prisma.pageData.update({
            where: {
                id: Number(id)
            },
            data: {
                conetent, keyword, description, title, name, canonicalUrl
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

export {
    createPageData,
    getPageData,
    updatePageData
}