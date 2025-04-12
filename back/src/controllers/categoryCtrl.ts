import { PrismaClient } from '@prisma/client';
import { customError } from '../middlewares/globalError';
import pagination from '../utils/pagination';
import expressAsyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
