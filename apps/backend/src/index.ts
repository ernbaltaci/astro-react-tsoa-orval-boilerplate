import path from 'path';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

import 'reflect-metadata';
import express, { urlencoded } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';
import { errorMiddleware } from './common/middlewares/error.middleware';
import { loggingMiddleware } from './common/middlewares/logging.middleware';
import './common/container';

const app = express();
// Start server
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  urlencoded({
    extended: true,
  }),
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:1571',
      'http://localhost:1571',
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  })
);
app.use(express.json());
app.use(loggingMiddleware);
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

// Register routes
RegisterRoutes(app);

// Error handling middleware (must be last)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorMiddleware(err, req, res, next);
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

