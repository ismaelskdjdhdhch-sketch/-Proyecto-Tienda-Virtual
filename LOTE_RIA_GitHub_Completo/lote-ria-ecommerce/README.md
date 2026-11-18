# LOTE RIA — Proyecto Integrador de Comercio Electrónico

Plataforma web B2C en paleta **Negro, Rojo y Blanco** para la comercialización de **vehículos seminuevos y usados certificados** en México, con identificación explícita de **unidades nuevas (0 km)**, desarrollada conforme a la rúbrica académica y al marco normativo vigente en México (**LFPC**, **LFPDPPP 2025**, **Código de Comercio** y **NOM-122-SCFI**).

## 1. Estructura del Repositorio
- `src/App.tsx`: Página principal completa en React + TypeScript + Tailwind CSS (Catálogo con filtros y paginación, PDP con variantes y reseñas, Carrito con bloqueo de sobreventa, Checkout con consentimiento informado y sandbox sin PAN/CVV, Comprobante interno con deslinde fiscal SAT, Mi Cuenta con devoluciones/garantías y CFDI 4.0, Ayuda/Políticas legales y Panel Administrativo RBAC).
- `db/schema/001_esquema_base_3fn.sql`: Esquema relacional completo en PostgreSQL (3FN).
- `db/seeds/002_datos_iniciales_prueba.sql`: Roles, permisos RBAC y catálogo inicial ficticio.
- `tienda-backend/`: Servidor Express con Helmet, CORS, Rate Limiting, validación Zod, anti-SSRF, rutas `/api/returns` y `/api/support`, `openapi.yaml` y script `security-check.mjs`.

## 2. Cómo ejecutar localmente y publicar en GitHub + Vercel
```bash
npm install
npm run dev
```
1. Sube toda esta carpeta a un repositorio en **GitHub**.
2. Importa el repositorio en **Vercel** (`vercel.com`) y haz clic en **Deploy** para obtener la URL navegable.

## 3. Respaldo y Restauración de Base de Datos (Caso #27)
```bash
pg_dump "$DATABASE_URL" -Fc -f respaldo_loteria_$(date +%Y%m%d).dump
pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" respaldo_loteria_YYYYMMDD.dump
```
