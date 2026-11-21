-- LOTE RIA — ESQUEMA RELACIONAL POSTGRESQL (3FN)
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  status VARCHAR(20) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(80) UNIQUE NOT NULL,
  slug VARCHAR(90) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  sku VARCHAR(40) UNIQUE NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  marca VARCHAR(60) NOT NULL,
  anio INTEGER NOT NULL,
  condicion VARCHAR(30) NOT NULL DEFAULT 'Usado Certificado',
  kilometraje INTEGER NOT NULL DEFAULT 0 CHECK (kilometraje >= 0),
  precio NUMERIC(12,2) NOT NULL CHECK (precio > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'activo',
  descripcion TEXT,
  imagen_url TEXT,
  garantia_meses INTEGER NOT NULL DEFAULT 12,
  garantia_km INTEGER NOT NULL DEFAULT 20000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  atributo VARCHAR(80) NOT NULL DEFAULT 'Configuración / Paquete',
  valor VARCHAR(140) NOT NULL,
  precio_extra NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (precio_extra >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  metodo_entrega VARCHAR(60) NOT NULL,
  direccion_entrega TEXT NOT NULL,
  cp VARCHAR(10) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  descuento NUMERIC(12,2) NOT NULL DEFAULT 0,
  envio NUMERIC(12,2) NOT NULL DEFAULT 0,
  iva NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  referencia_externa VARCHAR(80) UNIQUE NOT NULL,
  monto NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES users(id),
  tipo VARCHAR(30) NOT NULL,
  supuesto VARCHAR(120) NOT NULL,
  motivo TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'En revisión',
  resolucion VARCHAR(60),
  explicacion_admin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio VARCHAR(32) UNIQUE NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  order_folio VARCHAR(32),
  mensaje TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Abierto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  accion VARCHAR(80) NOT NULL,
  entidad VARCHAR(60) NOT NULL,
  metadatos JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMIT;
