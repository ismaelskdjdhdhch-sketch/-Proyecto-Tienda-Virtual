import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.veloce_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_lote_ria_2026');
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión expirada o inválida' });
  }
}

export function requirePerm(permClave) {
  return async (req, res, next) => {
    try {
      const r = await query(
        `SELECT 1
         FROM users u
         JOIN role_permissions rp ON rp.role_id = u.role_id
         JOIN permissions p ON p.id = rp.permission_id
         WHERE u.id = $1 AND p.clave = $2`,
        [req.user.id, permClave]
      );
      if (r.rowCount === 0) return res.status(403).json({ error: 'Sin permiso administrativo' });
      next();
    } catch (err) {
      next(err);
    }
  };
}
