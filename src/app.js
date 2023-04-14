import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import path from 'path';
import config from './config';
import database from './database';
import Logger from './utils/logger';
import { errorHandler, successHandler } from './middlewares/logger.middleware';
import Routes from './routes';

const app = express();
const logger = Logger('app');
// const allowedOrigins = config.ALLOWED_ORIGINS.split(',');

// app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(successHandler);
app.use(errorHandler);
app.use(fileUpload());

app.use('/', Routes);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(config.SERVER_PORT, async () => {
  logger.info(`server is up at ${config.SERVER_PORT}`);
  try {
    await database.authenticate();
    logger.info(`DB connected`);
  } catch (err) {
    logger.error(`${err}`);
  }
});

const key = fs.readFileSync(
  path.resolve(__dirname, '../certs/selfSigned.pkey')
);
const cert = fs.readFileSync(
  path.resolve(__dirname, '../certs/selfSigned.cer')
);
const options = {
  key,
  cert,
};
const httpsServer = https.createServer(options, app);

httpsServer.listen(config.HTTPS_SERVER_PORT, async () => {
  logger.info(`server is up at ${config.HTTPS_SERVER_PORT}`);
  // try {
  //   await config.DATABASE.authenticate();
  //   await config.DATABASE.sync({ force: false });
  //   logger.info(`DB connected`);
  // } catch (err) {
  //   logger.error(`${err}`);
  // }
});
