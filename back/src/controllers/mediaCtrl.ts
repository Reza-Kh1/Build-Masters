import { customError } from '../middlewares/globalError';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { deleteCahce, getCache, setCache } from '../utils/deleteCache';
const {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const pagination = require("../utils/pagination");
const limit = process.env.LIMIT;
const client = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});
const uploadMediaAdmin = expressAsyncHandler(async (req, res) => {
  if (!req.files.length) throw customError("هیچ عکسی انتخاب نشده", 401);
  const getUrl = req.files.map((i) => {
    const fileType = i.mimetype;
    let type;
    if (fileType.startsWith("image/")) {
      type = "image";
    } else if (fileType.startsWith("video/")) {
      type = "video";
    }
    const position = {
      status: true,
      url: i.location,
      type: type,
    }
    return position
  })
  try {
    await mediaModel.bulkCreate(getUrl)
    return res.send({ url: getUrl });
  } catch (error) {
    await Promise.all(
      getUrl.map(async (imageUrl) => {
        const key = decodeURIComponent(imageUrl.url.split("/").slice(-1)[0])
        await client.send(new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: key
        }));
      })
    );
    throw customError(error.message, 400);
  }
});
const uploadMediaUser = asyncHandler(async (req, res) => {
  if (!req.files.length) throw customError("هیچ عکسی انتخاب نشده", 401);
  const getUrl = req.files.map((i) => {
    let type;
    if (i.mimetype.startsWith("image/")) {
      type = "image";
    } else if (i.mimetype.startsWith("video/")) {
      type = "video";
    }
    const position = {
      status: false,
      url: i.location,
      type
    }
    return position
  })
  try {
    await mediaModel.bulkCreate(getUrl)
    return res.send({ url: getUrl });
  } catch (error) {
    await Promise.all(
      getUrl.map(async (imageUrl) => {
        const key = decodeURIComponent(imageUrl.url.split("/").slice(-1)[0])
        await client.send(new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: key
        }));
      })
    );
    throw customError(error.message, 400);
  }
});
const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const transaction = await dataBase.transaction();
  try {
    const media = await mediaModel.findByPk(id, { transaction });
    const key = decodeURIComponent(media?.url.split("/").slice(-1)[0]);
    await media.destroy(transaction);
    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key,
    };
    await client.send(new DeleteObjectCommand(params));
    await transaction.commit();
    res.send({ success: true });
  } catch (err) {
    await transaction.rollback()
    throw customError(err);
  }
});
const getAllMedia = asyncHandler(async (req, res) => {
  let { next, order, status, type } = req.query;
  const filterSearch = {}
  page = next || 1;
  let orderFilter = [];
  if (status !== undefined && status) {
    filterSearch.status = status
  }
  if (type !== undefined && type) {
    filterSearch.type = type
  }
  if (order) {
    const length1 = order.split("-")[0];
    const length2 = order.split("-")[1];
    orderFilter.push(length1);
    orderFilter.push(length2);
  } else {
    orderFilter.push(["createdAt", "DESC"]);
  }
  try {
    const data = await mediaModel.findAndCountAll({
      where: filterSearch,
      offset: (page - 1) * limit,
      limit: limit,
      order: [orderFilter],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const paginate = pagination(data.count, page, limit);
    res.send({ ...data, next: paginate?.nextPage });
  } catch (err) {
    throw customError(err);
  }
});
const deleteDBaaS = asyncHandler(async (req, res) => {
  const { url } = req.query;
  const key = url.split("/").slice(-1)[0];
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
  };
  try {
    await client.send(new DeleteObjectCommand(params));
    res.send({ success: true });
  } catch (error) {
    throw customError(error.message, 400);
  }
});
const getDBaaS = asyncHandler(async (req, res) => {
  const { next } = req.query;
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    MaxKeys: 2,
    ContinuationToken: next,
  };
  try {
    const data = await client.send(new ListObjectsV2Command(params));
    const files = data?.Contents?.map((file) => file.Key);
    const urls = files?.map((i) => {
      return process.env.URL_IMAGE_LIARA + i;
    });
    res.send({ urls, next: data.NextContinuationToken });
  } catch (err) {
    throw customError(err);
  }
});
module.exports = {
  uploadMediaAdmin,
  deleteMedia,
  getAllMedia,
  getDBaaS,
  uploadMediaUser,
  deleteDBaaS
};
