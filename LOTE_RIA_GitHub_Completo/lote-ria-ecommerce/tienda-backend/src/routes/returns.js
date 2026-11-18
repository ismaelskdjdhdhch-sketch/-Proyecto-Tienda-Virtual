import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { query, tx } from '../db.js';

const router = Router();

const safeHttpsUrl = z
  .string()
  .url()
  .refine((val) => {
    try {
      const u = new URL(val);
      if (u.protocol !== 'https:') return false;
      const host = u.hostname.toLowerCase();
      if (
        host === 'localhost' ||
        host.startsWith('127.') ||
        host.startsWith('10.') ||
        host.startsWith('192.168.') ||
        host === '169.254.169.254'
      ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, 'Solo se permiten URLs HTTPS públicas válidas');

const createReturnSchema = z.object({
  order_id: z.string().uuid(),
  tipo: z.enum(['Devolución', 'Cambio', 'Garantía']),
  supuesto: z.string().min(5).max(120),
  motivo: z.string().min(10).max(2000),
  evidencia_url: safeHttpsUrl.optional(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createReturnSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() });

    const { order_id, tipo, supuesto, motivo, evidencia_url } = parsed.data;
    const prefix = tipo === 'Garantía' ? 'GAR' : 'DEV';
    const folio = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await tx(req.user.id, async (client) => {
      const ordRes = await client.query('SELECT id, user_id, status FROM orders WHERE id = $1', [order_id]);
      if (ordRes.rowCount === 0) return { status: 404, body: { error: 'Pedido no encontrado' } };
      if (ordRes.rows[0].user_id !== req.user.id) return { status: 403, body: { error: 'Sin permiso sobre este pedido' } };

      const ins = await client.query(
        `INSERT INTO return_requests (folio, order_id, user_id, tipo, supuesto, motivo, evidencia_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, folio, tipo, supuesto, status, created_at`,
        [folio, order_id, req.user.id, tipo, supuesto, motivo, evidencia_url || null]
      );

      await client.query(
        `INSERT INTO audit_logs (actor_user_id, accion, entidad, entidad_id, metadatos)
         VALUES ($1, 'CREAR_DEVOLUCION', 'return_requests', $2, $3)`,
        [req.user.id, ins.rows[0].id, JSON.stringify({ folio, tipo, supuesto })]
      );

      return { status: 201, body: ins.rows[0] };
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT r.*, o.folio AS order_folio
       FROM return_requests r
       JOIN orders o ON o.id = r.order_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/admin', requireAuth, requirePerm('devoluciones.gestionar'), async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT r.*, o.folio AS order_folio, u.nombre AS cliente_nombre, u.email AS cliente_email
       FROM return_requests r
       JOIN orders o ON o.id = r.order_id
       JOIN users u ON u.id = r.user_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows.rows);
  } catch (err) {
    next(err);
  }
});

const resolveReturnSchema = z.object({
  status: z.enum(['En revisión', 'Info adicional solicitada', 'Autorizada', 'Rechazada', 'Resuelta']),
  dictamen_inspeccion: z.string().max(1000).optional(),
  resolucion: z.enum(['Reparación en taller', 'Reposición / Cambio', 'Saldo a favor', 'Reembolso']).optional(),
  explicacion_admin: z.string().min(5).max(1500),
});

router.patch('/:id', requireAuth, requirePerm('devoluciones.gestionar'), async (req, res, next) => {
  try {
    const parsed = resolveReturnSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Datos inválidos' });

    const { status, dictamen_inspeccion, resolucion, explicacion_admin } = parsed.data;

    const result = await tx(req.user.id, async (client) => {
      const cur = await client.query('SELECT * FROM return_requests WHERE id = $1 FOR UPDATE', [req.params.id]);
      if (cur.rowCount === 0) return { status: 404, body: { error: 'Solicitud no encontrada' } };

      const upd = await client.query(
        `UPDATE return_requests
         SET status = $1,
             dictamen_inspeccion = COALESCE($2, dictamen_inspeccion),
             resolucion = COALESCE($3, resolucion),
             explicacion_admin = $4,
             resuelto_por = $5,
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [status, dictamen_inspeccion || null, resolucion || null, explicacion_admin, req.user.id, req.params.id]
      );

      if (status === 'Resuelta' && resolucion === 'Reembolso') {
        await client.query(`UPDATE orders SET status = 'reembolsado' WHERE id = $1`, [cur.rows[0].order_id]);
        await client.query(`UPDATE payments SET status = 'reembolsado' WHERE order_id = $1`, [cur.rows[0].order_id]);
      }

      await client.query(
        `INSERT INTO audit_logs (actor_user_id, accion, entidad, entidad_id, metadatos)
         VALUES ($1, 'RESOLVER_DEVOLUCION', 'return_requests', $2, $3)`,
        [req.user.id, req.params.id, JSON.stringify({ status, resolucion })]
      );

      return { status: 200, body: upd.rows[0] };
    });

    res.status(result.status).json(result.body);
  } catch (err) {
    next(err);
  }
});

export default router;
