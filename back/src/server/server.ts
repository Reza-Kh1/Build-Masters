import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { globalHandler, notFound } from '../middlewares/globalError';
import userRoute from '../routes/userRoute';
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

app.use(globalHandler);
app.use(notFound);

///////////// Config Server
const server = http.createServer(app);
const hostName: string | undefined = process.env.HOST_NAME;
const port = Number(process.env.PORT_SERVER);
server.listen(port, hostName, () => {
  console.log(`server run in port ${port}`);
});
