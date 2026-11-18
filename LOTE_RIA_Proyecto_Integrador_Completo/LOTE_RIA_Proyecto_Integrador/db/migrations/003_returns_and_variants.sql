-- ============================================================================
-- MIGRACIÓN 003: Variantes, Devoluciones/Garantías, Tickets de Soporte y Reembolsos
-- LOTE RIA — Cumplimiento rúbrica 4.1, 4.2, 5.1, 6.3, 7.2, 7.3, 7.4 y 9
-- ============================================================================

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'reembolsado' AND enumtypid = 'order_status'::regtype) THEN
    ALTER TYPE order_status ADD VALUE 'reembolsado';
  END IF;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'reembolsado' AND enumtypid = 'payment_status'::regtype) THEN
    ALTER TYPE payment_status ADD VALUE 'reembolsado';
  END IF;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  atributo VARCHAR(80) NOT NULL DEFAULT 'Color / Paquete',
  valor VARCHAR(140) NOT NULL,
  precio_extra NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (precio_extra >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('Devolución', 'Cambio', 'Garantía')),
  supuesto VARCHAR(120) NOT NULL,
  motivo TEXT NOT NULL,
  evidencia_url TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'En revisión'
    CHECK (status IN ('En revisión', 'Info adicional solicitada', 'Autorizada', 'Rechazada', 'Resuelta')),
  dictamen_inspeccion TEXT,
  resolucion VARCHAR(60)
    CHECK (resolucion IS NULL OR resolucion IN ('Reparación en taller', 'Reposición / Cambio', 'Saldo a favor', 'Reembolso')),
  explicacion_admin TEXT,
  resuelto_por UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES return_requests(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0)
);

CREATE INDEX IF NOT EXISTS idx_return_requests_user ON return_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_order ON return_requests(order_id);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('Duda', 'Aclaración', 'Queja', 'Reclamación')),
  order_folio VARCHAR(32),
  mensaje TEXT NOT NULL,
  nivel_escalamiento VARCHAR(60) NOT NULL DEFAULT 'Nivel 1 · Soporte General',
  status VARCHAR(30) NOT NULL DEFAULT 'Abierto'
    CHECK (status IN ('Abierto', 'En revisión', 'Escalado', 'Resuelto')),
  resolucion TEXT,
  atendido_por UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO permissions (clave, descripcion) VALUES
  ('devoluciones.gestionar', 'Autorizar, rechazar y resolver devoluciones y garantías'),
  ('soporte.gestionar', 'Atender y escalar tickets de soporte'),
  ('resenas.moderar', 'Aprobar u ocultar reseñas de clientes')
ON CONFLICT (clave) DO NOTHING;

COMMIT;
