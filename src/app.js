import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import config from './config';
import Logger from './utils/logger';
import { errorHandler, successHandler } from './middlewares/logger.middleware';
import Routes from './routes';

const app = express();
const logger = Logger('app');

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(successHandler);
app.use(errorHandler);

app.use('/', Routes);

app.listen(config.SERVER_PORT, async () => {
  logger.info(`server is up at ${config.SERVER_PORT}`);
  try {
    await config.DATABASE.authenticate();
    await config.DATABASE.sync({ force: false });
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

httpsServer.listen(8000, async () => {
  logger.info(`server is up at 8000`);
  // try {
  //   await config.DATABASE.authenticate();
  //   await config.DATABASE.sync({ force: false });
  //   logger.info(`DB connected`);
  // } catch (err) {
  //   logger.error(`${err}`);
  // }
});
