import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import expressAsyncHandler from 'express-async-handler';
import { customError } from '../middlewares/globalError';
import { Client } from 'basic-ftp';
import { PrismaClient } from '@prisma/client';
const client = new Client();
const prisma = new PrismaClient();
const dbConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_Name,
  password: process.env.DATABASE_PASS,
};

const restorebackUp = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send({ error: 'فایل بکاپ ارسال نشده است' });
      return;
    }
    const restoreFilePath = path.normalize(
      path.join(__dirname, '../../public/backup', req.file.originalname)
    );
    const restoreCommand = `pg_restore --clean --if-exists -U ${dbConfig.user} -d ${dbConfig.database} -h ${dbConfig.host} "${restoreFilePath}"`;
    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        res.status(500).send({ error: error.message });
        return;
      }
      if (stderr) {
        console.warn('pg_restore stderr:', stderr);
      }
      fs.unlink(restoreFilePath, (err) => {
        if (err) {
          console.error('خطا در حذف فایل بکاپ:', err);
        }
      });
    });
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
});

const createBackUp = expressAsyncHandler(async (req, res) => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backup_${timestamp}.dump`;
  const backupPath = path.join(
    __dirname,
    '../../public/backup',
    backupFileName
  );
  const dumpCommand = `pg_dump -U ${dbConfig.user} -h ${dbConfig.host} -d ${dbConfig.database} -F c -f "${backupPath}"`;
  exec(dumpCommand, async (error, stdout, stderr) => {
    if (error) {
      res.status(500).send({ error: `Backup failed: ${error.message}` });
      return;
    }
    if (stderr) {
      console.warn('pg_dump stderr:', stderr);
    }
    try {
      const fileContent = require('fs').createReadStream(backupPath);

      ////// اپلود بک اپ
      const remoteFilePath = `/public_html/uploads/${backupFileName}`;
      const url = `http://${process.env.URL_IAMGE}/${backupFileName}`;
      await client.access({
        host: process.env.FTP_ADDRESS,
        user: process.env.FTP_NAME,
        password: process.env.FTP_PASSWORD,
        secure: false,
      });
      await client.uploadFrom(fileContent, remoteFilePath);
      client.close();

      ////// اضافه کردن به دیتابیس
      await prisma.backUp.create({
        data: {
          url,
        },
      });

      fs.unlink(backupPath, (err) => {
        if (err) {
          console.error('خطا در حذف فایل بکاپ:', err);
        }
      });
      res.send({ url });
    } catch (uploadError) {
      res.status(500).send({ error: `Upload failed: ${uploadError}` });
    }
  });
});

const deleteBackUp = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const key = id.split('/').pop();
    await client.access({
      host: process.env.FTP_ADDRESS,
      user: process.env.FTP_NAME,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    await client.remove(`/public_html/uploads/${key}`);
    client.close();
    await prisma.backUp.delete({ where: { url: key?.toString() } });
    res.send({ success: true });
  } catch (err) {
    throw customError('خطا در ارتباط با دیتابیس', 400, err);
  }
});

const getAllBackUp = expressAsyncHandler(async (req, res) => {
  try {
    const data = await prisma.backUp.findMany({});
    res.send(data);
  } catch (err) {
    throw customError('خطا در ارتباط با دیتابیس', 400, err);
  }
});

export { createBackUp, deleteBackUp, getAllBackUp, restorebackUp };
