import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS Origins (Storefront, Admin, Local development)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://ambrosiavastra.com',
  'https://www.ambrosiavastra.com',
  'https://admin.ambrosiavastra.com',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.ambrosiavastra.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads fallback
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      service: 'Ambrosia Modular Backend',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: dbRes.rows[0].now,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'degraded',
      service: 'Ambrosia Modular Backend',
      error: error.message,
    });
  }
});

// Central API Routes
app.use('/api/v1', apiRouter);

// 404 Route Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Ambrosia Backend Server listening on http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server and database pool');
  server.close(async () => {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  });
});

export default app;
