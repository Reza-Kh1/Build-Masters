import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

const getAllPost = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = "tag:all"
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.tag.findMany({ where: {} })
        setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const getSinglePost = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = "tag:all"
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.tag.findMany({ where: {} })
        setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const createPost = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = "tag:all"
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.tag.findMany({ where: {} })
        setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updatePost = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = "tag:all"
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.tag.findMany({ where: {} })
        setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const deletePost = expressAsyncHandler(async (req, res) => {
    try {
        const keyCache = "tag:all"
        const cache = await getCache(keyCache)
        if (cache) {
            res.send(cache)
            return
        }
        const data = await prisma.tag.findMany({ where: {} })
        setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

export {
    getAllPost,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
}