import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();

const getAllProject = expressAsyncHandler(async (req, res) => {
    const { } = req.query
    try {
        // const keyCache = "tag:all"
        // const cache = await getCache(keyCache)
        // if (cache) {
        //     res.send(cache)
        //     return
        // }
        const data = await prisma.project.findMany({ where: {} })
        // setCache(keyCache, data)
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const createProject = expressAsyncHandler(async (req, res) => {
    const { name, slug, address, image, gallery, video, description, stratDate, endDate, price, isPublished, categoryId, tags, contractorId } = req.body
    try {

        await prisma.project.create({
            data: {
                name, slug, address, image, gallery, video, description, stratDate, endDate, price, isPublished, categoryId,
                Tags: {
                    connect: tags.map((id: string) => ({ id }))
                },
                contractorId
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const getSingleProject = expressAsyncHandler(async (req, res) => {
    const { slug } = req.params
    try {
        const data = await prisma.project.findUnique({
            where: { slug }, include: {
                Category: true,
                Contractor: true,
                Tags: true
            }
        })
        res.send(data);
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const updateProject = expressAsyncHandler(async (req, res) => {
    const { name, slug, address, image, gallery, video, description, stratDate, endDate, price, isPublished, categoryId, tags, contractorId } = req.body
    const { id } = req.params
    try {
        await prisma.project.update({
            where: { id: Number(id) },
            data: {
                name, slug, address, image, gallery, video, description, stratDate, endDate, price, isPublished, categoryId,
                Tags: {
                    connect: tags.map((id: string) => ({ id }))
                },
                contractorId
            }
        })
        res.send({ success: true });
    } catch (err) {
        throw customError('خطا در دیتابیس', 500, err);
    }
});

const deleteProject = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        await prisma.project.delete({ where: { id: Number(id) } })
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
    deleteProject
}