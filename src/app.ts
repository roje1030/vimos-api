import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { loadEnv } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import userRoutes from './modules/users/userRoutes.js';
import orderRoutes from './modules/orders/orderRoutes.js';

export function createApp() {
  const env = loadEnv();
  const app = express();

  app.use(helmet());
  app.use(cors());

  const morganFormat = env.nodeEnv === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat));

  app.use(express.json());

  app.use(routes);
  app.use(userRoutes);
  app.use(errorHandler);

  app.use(routes);
  app.use(userRoutes);
  app.use(orderRoutes);
  app.use(errorHandler);

  return app;
}

export function startServer() {
  const env = loadEnv();
  const app = createApp();

  return app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

export default createApp;
