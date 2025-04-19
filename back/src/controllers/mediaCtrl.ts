import expressAsyncHandler from 'express-async-handler';
import { Client } from 'basic-ftp';
import fs from 'fs';
import { customError } from '../middlewares/globalError';
import { PrismaClient } from '@prisma/client';
import token from 'jsonwebtoken';
import pagination from '../utils/pagination';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const prisma = new PrismaClient();
const pageLimit = Number(process.env.PAGE_LIMITE);
const client = new Client();

type QueryMedia = {
  page?: number;
  order?: 'desc' | 'asc';
  type?: 'IMAGE' | 'VIDEO';
  uploader?: 'USER' | 'ADMIN';
};

const uploadMedia = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).send('فایلی ارسال نشده.');
    return;
  }
  const remoteFilePath = `/public_html/uploads/${req.file.filename}`;
  const url = `http://${process.env.URL_IAMGE}/${req.file.filename}`;
  const mimeType = req.file.mimetype;
  let typeMedia: 'IMAGE' | 'VIDEO';
  let typeUploader: 'ADMIN' | 'USER';
  await client.access({
    host: process.env.FTP_ADDRESS,
    user: process.env.FTP_NAME,
    password: process.env.FTP_PASSWORD,
    secure: false,
  });

  try {
    if (mimeType.startsWith('image/')) {
      typeMedia = 'IMAGE';
    } else if (mimeType.startsWith('video/')) {
      typeMedia = 'VIDEO';
    } else {
      res.status(400).json({ msg: 'لطفا عکس یا فیلم ارسال کنید.' });
      return;
    }
    const cookieKey = process.env.COOKIE_KEY as string;
    const cookie = req.cookies[cookieKey];
    if (cookie) {
      token.verify(cookie, process.env.TOKEN_SECURITY as string) as {
        id: string;
        role: 'ADMIN' | 'CONSTARCTOR' | 'AUTHOR';
      };
      typeUploader = 'ADMIN';
    } else {
      typeUploader = 'USER';
    }
    await client.uploadFrom(req.file.path, remoteFilePath);
    client.close();
    await prisma.media.create({
      data: {
        url,
        type: typeMedia,
        uploader: typeUploader,
      },
    });
    fs.unlinkSync(req.file.path);
    deleteCahce('Media:*');
    res.json({ url });
  } catch (err) {
    await client.remove(`/public_html/uploads/${req.file.filename}`);
    client.close();
    const data = await prisma.media.findUnique({ where: { url } });
    if (data) {
      await prisma.media.delete({ where: { url } });
    }
    throw customError('خطا در دیتابیس', 400, err);
  }
});

const getAllMedia = expressAsyncHandler(async (req, res) => {
  const { page = 1, order, type, uploader } = req.query as QueryMedia;
  const keyCache = `Media:${page}&${order}&${type}&${uploader}`;
  const cache = await getCache(keyCache);
  if (cache) {
    res.send(cache);
    return;
  }
  try {
    let search = {
      type: type || undefined,
      uploader: uploader || undefined,
    };
    const data = await prisma.media.findMany({
      where: search,
      skip: (Number(page) - 1) * pageLimit,
      orderBy: { createdAt: order || 'desc' },
      take: pageLimit,
    });
    const count = await prisma.media.count({ where: search });
    const pager = pagination(count, Number(page), pageLimit);
    setCache(keyCache, { data, pagination: pager });
    res.send({ data, pagination: pager });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const deleteMedia = expressAsyncHandler(async (req, res) => {
  const { url }: { url?: string } = req.query;
  if (!url) {
    res.status(404).send({ msg: 'ادرسی ارسال نشده !' });
    return;
  }
  const key = url.split('/').pop();
  await client.access({
    host: process.env.FTP_ADDRESS,
    user: process.env.FTP_NAME,
    password: process.env.FTP_PASSWORD,
    secure: false,
  });
  try {
    await client.remove(`/public_html/uploads/${key}`);
    client.close();
    await prisma.media.delete({
      where: {
        url: url?.toString(),
      },
    });
    deleteCahce('Media:*');
    res.send({ sucess: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

export { uploadMedia, getAllMedia, deleteMedia };
