import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { query } from '../db.js';

const router = Router();

const ticketSchema = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email().max(160),
  tipo: z.enum(['Duda', 'Aclaración', 'Queja', 'Reclamación']),
  order_folio: z.string().max(32).optional(),
  mensaje: z
    .string()
    .min(10)
    .max(2000)
    .refine(
      (txt) => !/\b\d{13,19}\b/.test(txt.replace(/[\s-]/g, '')),
      'Por seguridad, no envíes números de tarjeta bancaria ni CVV.'
    ),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = ticketSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });

    const { nombre, email, tipo, order_folio, mensaje } = parsed.data;
    const folio = `ATN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nivel =
      tipo === 'Reclamación' || tipo === 'Queja' ? 'Nivel 2 · Postventa y Logística' : 'Nivel 1 · Soporte General';

    const ins = await query(
      `INSERT INTO support_tickets (folio, nombre, email, tipo, order_folio, mensaje, nivel_escalamiento)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, folio, tipo, nivel_escalamiento, status, created_at`,
      [folio, nombre, email, tipo, order_folio || null, mensaje, nivel]
    );

    res.status(201).json(ins.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/admin', requireAuth, requirePerm('soporte.gestionar'), async (_req, res, next) => {
  try {
    const rows = await query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireAuth, requirePerm('soporte.gestionar'), async (req, res, next) => {
  try {
    const { status, nivel_escalamiento, resolucion } = req.body;
    const upd = await query(
      `UPDATE support_tickets
       SET status = COALESCE($1, status),
           nivel_escalamiento = COALESCE($2, nivel_escalamiento),
           resolucion = COALESCE($3, resolucion),
           atendido_por = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [status || null, nivel_escalamiento || null, resolucion || null, req.user.id, req.params.id]
    );
    if (upd.rowCount === 0) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(upd.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
