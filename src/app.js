import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
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
