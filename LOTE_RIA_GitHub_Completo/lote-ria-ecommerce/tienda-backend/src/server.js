import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { query } from './db.js';
import returnsRouter from './routes/returns.js';
import supportRouter from './routes/support.js';
import { requireAuth, requirePerm } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'LOTE RIA API', timestamp: new Date().toISOString() });
});

app.get('/api/products', async (_req, res, next) => {
  try {
    const r = await query('SELECT * FROM products WHERE status = $1 ORDER BY created_at DESC', ['activo']);
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
});

app.use('/api/returns', returnsRouter);
app.use('/api/support', supportRouter);

app.get('/api/admin/reports/ventas', requireAuth, requirePerm('reportes.ver'), async (_req, res, next) => {
  try {
    const r = await query('SELECT COUNT(*)::int AS total_pedidos, COALESCE(SUM(total),0) AS ingresos FROM orders');
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno controlado del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor LOTE RIA escuchando en http://localhost:${PORT}`);
});
