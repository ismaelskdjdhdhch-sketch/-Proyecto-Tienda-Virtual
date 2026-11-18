-- ============================================================================
-- LOTE RIA — DATOS INICIALES FICTICIOS DE PRUEBA (ROLES, PERMISOS, CATÁLOGO)
-- ============================================================================
BEGIN;

INSERT INTO roles (nombre, descripcion) VALUES
  ('cliente', 'Comprador registrado'),
  ('admin', 'Administrador general de LOTE RIA')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO permissions (clave, descripcion) VALUES
  ('productos.editar', 'Crear y editar vehículos del catálogo'),
  ('pedidos.gestionar', 'Actualizar estados y guías de pedidos'),
  ('inventario.ajustar', 'Registrar entradas y ajustes de inventario'),
  ('devoluciones.gestionar', 'Autorizar, rechazar y resolver devoluciones y garantías'),
  ('soporte.gestionar', 'Atender y escalar tickets de soporte'),
  ('reportes.ver', 'Consultar KPIs y reportes financieros')
ON CONFLICT (clave) DO NOTHING;

INSERT INTO categories (nombre, slug) VALUES
  ('SUV', 'suv'),
  ('Sedán', 'sedan'),
  ('Pickup', 'pickup'),
  ('Deportivo', 'deportivo'),
  ('Eléctrico', 'electrico')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, sku, nombre, marca, anio, condicion, kilometraje, precio, stock, descripcion, garantia_meses, garantia_km)
SELECT id, 'LRI-USD-2023-001', 'Mazda CX-5 Signature Turbo', 'Mazda', 2023, 'Usado Certificado', 24500, 549000.00, 2,
       'SUV seminuevo certificado con inspección multipunto de 150 puntos.', 12, 20000
FROM categories WHERE slug = 'suv'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, sku, nombre, marca, anio, condicion, kilometraje, precio, stock, descripcion, garantia_meses, garantia_km)
SELECT id, 'LRI-USD-2022-002', 'Toyota Corolla SE Hybrid', 'Toyota', 2022, 'Usado Certificado', 31200, 379000.00, 3,
       'Sedán híbrido seminuevo certificado de bajo consumo.', 12, 20000
FROM categories WHERE slug = 'sedan'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, sku, nombre, marca, anio, condicion, kilometraje, precio, stock, descripcion, garantia_meses, garantia_km)
SELECT id, 'LRI-NVO-2026-004', 'Porsche 911 Carrera S (Unidad Nueva)', 'Porsche', 2026, 'Nuevo', 0, 2890000.00, 1,
       'UNIDAD NUEVA (0 KM) con garantía integral de planta.', 36, 60000
FROM categories WHERE slug = 'deportivo'
ON CONFLICT (sku) DO NOTHING;

COMMIT;
