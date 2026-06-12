import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';
import { errorResponse } from './utils/response';

const app = express();

// 1. helmet()
app.use(helmet());

// 2. cors({ origin: env.FRONTEND_URL, credentials: true })
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// 3. express.json()
app.use(express.json());

// 4. morgan('dev') // dev only
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. /api routes
app.use('/api', routes);

// 6. 404 handler
app.use((req, res) => {
  return errorResponse(res, `Cannot ${req.method} ${req.url}`, 404);
});

// 7. global error handler
app.use(errorHandler);

export default app;
