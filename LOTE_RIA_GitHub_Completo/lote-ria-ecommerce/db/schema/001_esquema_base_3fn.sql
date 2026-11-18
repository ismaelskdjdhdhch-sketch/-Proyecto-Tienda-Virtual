-- ============================================================================
-- LOTE RIA — ESQUEMA BASE DE BASE DE DATOS RELACIONAL (POSTGRESQL · 3FN)
-- ============================================================================
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_status AS ENUM ('activo', 'bloqueado', 'pendiente');
CREATE TYPE product_condition AS ENUM ('Usado Certificado', 'Nuevo');
CREATE TYPE product_status AS ENUM ('activo', 'descontinuado');
CREATE TYPE order_status AS ENUM ('pendiente', 'pagado', 'en_preparacion', 'enviado', 'entregado', 'cancelado', 'devuelto', 'reembolsado');
CREATE TYPE payment_status AS ENUM ('pendiente', 'capturado', 'fallido', 'reembolsado');

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(40) UNIQUE NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave VARCHAR(80) UNIQUE NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  telefono VARCHAR(25),
  password_hash TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'activo',
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(80) UNIQUE NOT NULL,
  slug VARCHAR(90) UNIQUE NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  sku VARCHAR(40) UNIQUE NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  marca VARCHAR(60) NOT NULL,
  anio INTEGER NOT NULL,
  condicion product_condition NOT NULL DEFAULT 'Usado Certificado',
  kilometraje INTEGER NOT NULL DEFAULT 0 CHECK (kilometraje >= 0),
  combustible VARCHAR(60),
  transmision VARCHAR(60),
  potencia_hp INTEGER,
  dimensiones VARCHAR(80),
  peso_kg INTEGER,
  precio NUMERIC(12,2) NOT NULL CHECK (precio > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status product_status NOT NULL DEFAULT 'activo',
  descripcion TEXT,
  imagen_url TEXT,
  garantia_meses INTEGER NOT NULL DEFAULT 12,
  garantia_km INTEGER NOT NULL DEFAULT 20000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  atributo VARCHAR(80) NOT NULL DEFAULT 'Color / Paquete',
  valor VARCHAR(140) NOT NULL,
  precio_extra NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (precio_extra >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  metodo_entrega VARCHAR(60) NOT NULL,
  direccion_entrega TEXT NOT NULL,
  cp VARCHAR(10) NOT NULL,
  plazo_estimado VARCHAR(80),
  subtotal NUMERIC(12,2) NOT NULL,
  descuento NUMERIC(12,2) NOT NULL DEFAULT 0,
  envio NUMERIC(12,2) NOT NULL DEFAULT 0,
  iva NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  proveedor VARCHAR(40) NOT NULL DEFAULT 'SANDBOX_SIMULATOR',
  referencia_externa VARCHAR(80) UNIQUE NOT NULL,
  monto NUMERIC(12,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pendiente',
  idempotency_key VARCHAR(80) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('entrada', 'salida_venta', 'devolucion', 'ajuste')),
  cantidad INTEGER NOT NULL,
  referencia VARCHAR(80),
  actor_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  documento_version VARCHAR(30) NOT NULL,
  aceptado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  accion VARCHAR(80) NOT NULL,
  entidad VARCHAR(60) NOT NULL,
  entidad_id UUID,
  metadatos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
