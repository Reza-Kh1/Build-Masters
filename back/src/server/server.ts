import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { globalHandler, notFound } from '../middlewares/globalError';
import userRoute from '../routes/userRoute';
import categoryRoute from '../routes/categoryRoute';
import contractorRoute from '../routes/contractorRoute';
import tagRoute from '../routes/tagRoute';
import postRoute from '../routes/postRoute';
import detailPost from '../routes/detailPost';
import projectRoute from '../routes/projectRoute';
import commentRoute from '../routes/commentRoute';
import onlinePriceRoute from '../routes/onlinePriceRoute';
import pageDataRoute from '../routes/pageDataRoute';
import mediaRoute from '../routes/mediaRoute';
///////////// config Security
dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(helmet.xssFilter());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
const defualtApi = process.env.API_VERSION;

///////////// Api Routes

app.use(defualtApi + 'user', userRoute);
app.use(defualtApi + 'tag', tagRoute);
app.use(defualtApi + 'category', categoryRoute);
app.use(defualtApi + 'contractor', contractorRoute);
app.use(defualtApi + 'post', postRoute);
app.use(defualtApi + 'detailPost', detailPost);
app.use(defualtApi + 'project', projectRoute);
app.use(defualtApi + 'onlinePrice', onlinePriceRoute);
app.use(defualtApi + 'pages', pageDataRoute);

app.use(defualtApi + 'comment', commentRoute);
app.use(defualtApi + 'media', mediaRoute);

app.use(globalHandler);
app.use(notFound);

///////////// Config Server
const server = http.createServer(app);
const hostName: string | undefined = process.env.HOST_NAME;
const port = Number(process.env.PORT_SERVER);
server.listen(port, hostName, () => {
  console.log(`server run in port ${port}`);
});
