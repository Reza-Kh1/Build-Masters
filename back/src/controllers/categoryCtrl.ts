import { customError } from '../middlewares/globalError';
import { comaprePassword, createHash } from '../utils/hashPassword';
import pagination from '../utils/pagination';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient, Category } from '@prisma/client';
import createToken from '../utils/createToken';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const getCategory = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = 'category:all'
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.category.findMany({ include: { subCategorys: true, subCategoryTo: true } })
        setCache(keyCache, data)
        res.send({ data: data });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const createCategory = expressAsyncHandler(async (req, res) => {
    const { name, slug, subCategoryId } = req.body
    try {
        await prisma.category.create({ data: { name, slug, subCategoryId: subCategoryId || undefined } })
        deleteCahce('category:*')
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updateCategory = expressAsyncHandler(async (req, res) => {
    const { name, slug, subCategoryId } = req.body
    const { id } = req.query
    try {
        await prisma.category.update({
            where: { id: Number(id) },
            data: { name, slug, subCategoryId: subCategoryId || undefined }
        })
        deleteCahce('category:*')
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        await prisma.category.delete({ where: { id: Number(id) } })
        deleteCahce('category:*')
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

export { getCategory, createCategory, updateCategory, deleteCategory };
