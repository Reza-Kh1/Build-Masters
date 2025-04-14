import expressAsyncHandler from "express-async-handler";
import { Client } from "basic-ftp"
import fs from "fs"
import { customError } from "../middlewares/globalError";

const uploadMedia = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).send("فایلی ارسال نشده.");
    return
  }
  const localPath = req.file.path;
  const remoteFilePath = `/public_html/uploads/${req.file.filename}`;

  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_ADDRESS,
      user: process.env.FTP_NAME,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    // await client.uploadFrom(localPath, remoteFilePath);
    // client.close();
    // await client.remove(`/public_html/uploads/1744613773524-apex.png`);
    // client.close()
    // حذف فایل موقت بعد از آپلود موفق
    fs.unlinkSync(localPath);

    const fileUrl = {
      1: `https://2193182641.cloudydl.com:3333/CMD_FILE_MANAGER/domains/pz%32%31%30%37%32.parspack.net/public%5Fhtml/uploads/${req.file.filename}`,
    }

    res.json({ success: true, url: fileUrl });

  } catch (err) {
    console.error("❌ خطا در آپلود:", err);
    res.status(500).send("آپلود ناموفق بود.");
  }
})

const getAllMedia = expressAsyncHandler(async (req, res) => {
  try {

  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
})

const deleteMedia = expressAsyncHandler(async (req, res) => {
  try {

  } catch (err) {
    throw customError('خطا در دیتابیس', 500, err);
  }
})

export {
  uploadMedia, getAllMedia,
  deleteMedia
}