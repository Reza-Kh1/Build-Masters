import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);

const createOnlinePrice = expressAsyncHandler(async (req, res) => {
    const { name, phone, description, price, subject, images, size, isStatus } = req.body
    try {
        await prisma.onlinePrice.create({
            data: {
                name, phone, description, price, subject, images, size, isStatus
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const getAllOnlinePrice = expressAsyncHandler(async (req, res) => {
    const { page, isStatus } = req.query
    try {
        const data = await prisma.onlinePrice.findMany({
            where: {}
        })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updateOnlinePrice = expressAsyncHandler(async (req, res) => {
    const { name, phone, description, price, subject, images, size, isStatus } = req.body
    const { id } = req.params
    try {
        await prisma.onlinePrice.update({
            data: {
                name, phone, description, price, subject, images, size, isStatus
            },
            where: {
                id: Number(id)
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const deleteOnlinePrice = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        await prisma.onlinePrice.delete({
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
    createOnlinePrice,
    getAllOnlinePrice,
    updateOnlinePrice,
    deleteOnlinePrice
}