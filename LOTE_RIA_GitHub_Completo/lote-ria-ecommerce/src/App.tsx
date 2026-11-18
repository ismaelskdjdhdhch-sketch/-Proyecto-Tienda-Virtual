import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// LOTE RIA — PROYECTO INTEGRADOR DE COMERCIO ELECTRÓNICO (MÉXICO)
// Diseño original en Negro, Blanco y Rojo (#DC2626)
// Lote de Seminuevos / Usados Certificados + Distinción de Unidades Nuevas (0 km)
// Cumplimiento académico: LFPC, LFPDPPP (2025), Código de Comercio, NOM-122-SCFI
// ============================================================================

export interface ProductVariant {
  id: string;
  atributo: string;
  valor: string;
  precio_extra: number;
  stock: number;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comentario: string;
  fecha: string;
  aprobada: boolean;
}

export interface Vehicle {
  id: string;
  sku: string;
  nombre: string;
  marca: string;
  categoria: 'Sedán' | 'SUV' | 'Deportivo' | 'Pickup' | 'Eléctrico';
  anio: number;
  condicion: 'Usado Certificado' | 'Nuevo';
  km: number;
  combustible: string;
  transmision: string;
  potencia_hp: number;
  dimensiones: string;
  peso_kg: number;
  precio: number;
  stock: number;
  status: 'activo' | 'descontinuado';
  imagen: string;
  atribucion_imagen: string;
  descripcion: string;
  garantia_meses: number;
  garantia_km: number;
  variantes: ProductVariant[];
  reviews: Review[];
}

export interface CartItem {
  product: Vehicle;
  variant: ProductVariant;
  cantidad: number;
}

export interface OrderItemSnapshot {
  sku: string;
  nombre: string;
  condicion: string;
  variante: string;
  cantidad: number;
  precio_unitario: number;
}

export type OrderStatus =
  | 'pendiente'
  | 'pagado'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'devuelto'
  | 'reembolsado';

export interface Order {
  folio: string;
  fecha: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  metodo_entrega: 'Madrina Asegurada' | 'Entrega Local' | 'Recolección en Showroom';
  direccion: string;
  cp: string;
  plazo_estimado: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  descuento: number;
  envio: number;
  iva: number;
  total: number;
  pago_estado: 'pendiente' | 'capturado' | 'fallido' | 'reembolsado';
  pago_referencia: string;
  status: OrderStatus;
  paqueteria?: string;
  guia?: string;
  evidencia_despacho?: string;
  incidencia_logistica?: string;
  terminos_version: string;
  terminos_timestamp: string;
  factura_solicitada?: {
    rfc: string;
    razon_social: string;
    cp_fiscal: string;
    regimen: string;
    uso_cfdi: string;
  };
}

export interface ReturnRequest {
  folio: string;
  order_folio: string;
  fecha: string;
  cliente_email: string;
  tipo: 'Devolución' | 'Cambio' | 'Garantía';
  supuesto: string;
  motivo: string;
  evidencia_url: string;
  status: 'En revisión' | 'Info adicional solicitada' | 'Autorizada' | 'Rechazada' | 'Resuelta';
  dictamen_inspeccion?: string;
  resolucion?: 'Reparación en taller' | 'Reposición / Cambio' | 'Saldo a favor' | 'Reembolso';
  explicacion_admin?: string;
}

export interface SupportTicket {
  folio: string;
  fecha: string;
  nombre: string;
  email: string;
  tipo: 'Duda' | 'Aclaración' | 'Queja' | 'Reclamación';
  order_folio?: string;
  mensaje: string;
  nivel_escalamiento: 'Nivel 1 · Soporte General' | 'Nivel 2 · Postventa y Logística' | 'Nivel 3 · Gerencia y Conciliación';
  status: 'Abierto' | 'En revisión' | 'Escalado' | 'Resuelto';
  resolucion?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  accion: string;
  entidad: string;
  detalle: string;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-101',
    sku: 'LRI-USD-2023-001',
    nombre: 'Mazda CX-5 Signature Turbo',
    marca: 'Mazda',
    categoria: 'SUV',
    anio: 2023,
    condicion: 'Usado Certificado',
    km: 24500,
    combustible: 'Gasolina 2.5L Turbo',
    transmision: 'Automática 6 vel.',
    potencia_hp: 228,
    dimensiones: '4,575 × 1,845 × 1,680 mm',
    peso_kg: 1735,
    precio: 549000,
    stock: 2,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Kindel Media / Unsplash (Licencia libre)',
    descripcion: 'SUV seminuevo certificado con inspección multipunto de 150 puntos, historial de agencia verificado y un solo dueño.',
    garantia_meses: 12,
    garantia_km: 20000,
    variantes: [
      { id: 'var-101a', atributo: 'Color / Paquete', valor: 'Rojo Brillante · Interior Piel Negra', precio_extra: 0, stock: 1 },
      { id: 'var-101b', atributo: 'Color / Paquete', valor: 'Gris Titanio · Kit Protección Cerámica', precio_extra: 12000, stock: 1 },
    ],
    reviews: [
      { id: 'rev-1', user_name: 'Carlos M. (Cliente verificado)', rating: 5, comentario: 'Excelente estado mecánico, entregaron reporte de escáner y duplicado de llaves.', fecha: '2026-10-18', aprobada: true },
    ],
  },
  {
    id: 'v-102',
    sku: 'LRI-USD-2022-002',
    nombre: 'Toyota Corolla SE Hybrid',
    marca: 'Toyota',
    categoria: 'Sedán',
    anio: 2022,
    condicion: 'Usado Certificado',
    km: 31200,
    combustible: 'Híbrido 1.8L',
    transmision: 'e-CVT',
    potencia_hp: 121,
    dimensiones: '4,630 × 1,780 × 1,435 mm',
    peso_kg: 1385,
    precio: 379000,
    stock: 3,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Obi Pixel / Unsplash (Licencia libre)',
    descripcion: 'Sedán híbrido seminuevo de bajo consumo urbano, batería híbrida diagnosticada al 96% de salud.',
    garantia_meses: 12,
    garantia_km: 20000,
    variantes: [
      { id: 'var-102a', atributo: 'Color / Paquete', valor: 'Blanco Perlado · Estándar Lote', precio_extra: 0, stock: 2 },
      { id: 'var-102b', atributo: 'Color / Paquete', valor: 'Plata Metálico · Película Antiasalto', precio_extra: 6500, stock: 1 },
    ],
    reviews: [
      { id: 'rev-2', user_name: 'Ana Sofía R.', rating: 5, comentario: 'Rendimiento de 22 km/l reales y trámite de baja de placas transparente.', fecha: '2026-10-25', aprobada: true },
    ],
  },
  {
    id: 'v-103',
    sku: 'LRI-USD-2021-003',
    nombre: 'Ford Ranger XLT 4x4 Diésel',
    marca: 'Ford',
    categoria: 'Pickup',
    anio: 2021,
    condicion: 'Usado Certificado',
    km: 48900,
    combustible: 'Diésel 3.2L TDCi',
    transmision: 'Automática 6 vel.',
    potencia_hp: 197,
    dimensiones: '5,354 × 1,860 × 1,821 mm',
    peso_kg: 2150,
    precio: 489000,
    stock: 1,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Caleb White / Unsplash (Licencia libre)',
    descripcion: 'Pickup doble cabina seminueva lista para trabajo o carretera, suspensión revisada y llantas todo terreno al 85%.',
    garantia_meses: 12,
    garantia_km: 20000,
    variantes: [
      { id: 'var-103a', atributo: 'Color / Paquete', valor: 'Azul Relámpago · Bedliner Incluido', precio_extra: 0, stock: 1 },
    ],
    reviews: [],
  },
  {
    id: 'v-104',
    sku: 'LRI-NVO-2026-004',
    nombre: 'Porsche 911 Carrera S (Unidad Nueva)',
    marca: 'Porsche',
    categoria: 'Deportivo',
    anio: 2026,
    condicion: 'Nuevo',
    km: 0,
    combustible: 'Gasolina 3.0L Twin-Turbo',
    transmision: 'PDK 8 vel.',
    potencia_hp: 443,
    dimensiones: '4,519 × 1,852 × 1,300 mm',
    peso_kg: 1515,
    precio: 2890000,
    stock: 1,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Campbell / Unsplash (Licencia libre)',
    descripcion: 'UNIDAD NUEVA (0 KM) de importación directa con factura de origen y garantía integral de planta por 36 meses.',
    garantia_meses: 36,
    garantia_km: 60000,
    variantes: [
      { id: 'var-104a', atributo: 'Configuración', valor: 'Negro Jet · Paquete Sport Chrono', precio_extra: 0, stock: 1 },
    ],
    reviews: [],
  },
  {
    id: 'v-105',
    sku: 'LRI-USD-2023-005',
    nombre: 'Volkswagen Jetta GLI 35 Aniversario',
    marca: 'Volkswagen',
    categoria: 'Sedán',
    anio: 2023,
    condicion: 'Usado Certificado',
    km: 19400,
    combustible: 'Gasolina 2.0L TSI',
    transmision: 'DSG 7 vel.',
    potencia_hp: 230,
    dimensiones: '4,747 × 1,799 × 1,470 mm',
    peso_kg: 1475,
    precio: 465000,
    stock: 2,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Martin Katler / Unsplash (Licencia libre)',
    descripcion: 'Sedán deportivo seminuevo certificado, servicios sellados en concesionario y sin reportes de siniestro.',
    garantia_meses: 12,
    garantia_km: 20000,
    variantes: [
      { id: 'var-105a', atributo: 'Color / Paquete', valor: 'Gris Puro · Rines 18" Negro', precio_extra: 0, stock: 2 },
    ],
    reviews: [],
  },
  {
    id: 'v-106',
    sku: 'LRI-NVO-2026-006',
    nombre: 'Tesla Model 3 Long Range AWD (Unidad Nueva)',
    marca: 'Tesla',
    categoria: 'Eléctrico',
    anio: 2026,
    condicion: 'Nuevo',
    km: 0,
    combustible: '100% Eléctrico (Dual Motor)',
    transmision: 'Automática 1 vel.',
    potencia_hp: 394,
    dimensiones: '4,720 × 1,850 × 1,441 mm',
    peso_kg: 1828,
    precio: 1049000,
    stock: 2,
    status: 'activo',
    imagen: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
    atribucion_imagen: 'Foto por Vlad Tchompalov / Unsplash (Licencia libre)',
    descripcion: 'UNIDAD NUEVA (0 KM). Autonomía WLTP de 629 km, incluye cargador móvil y garantía de fábrica.',
    garantia_meses: 36,
    garantia_km: 60000,
    variantes: [
      { id: 'var-106a', atributo: 'Configuración', valor: 'Blanco Perla Multicapa · Interior Negro', precio_extra: 0, stock: 2 },
    ],
    reviews: [],
  },
];

const BRAND_BAR = ['FORD', 'KIA', 'CHEVROLET', 'NISSAN', 'HONDA', 'PORSCHE', 'MAZDA', 'TOYOTA', 'VOLKSWAGEN', 'TESLA'];

const POSTAL_ZONES: Record<string, { ciudad: string; costo: number; plazo: string; metodo: 'Entrega Local' | 'Madrina Asegurada' }> = {
  '06': { ciudad: 'Ciudad de México (Zona Metropolitana)', costo: 0, plazo: '24–48 hrs hábiles', metodo: 'Entrega Local' },
  '64': { ciudad: 'Monterrey y Área Metropolitana, N.L.', costo: 0, plazo: '24–48 hrs hábiles', metodo: 'Entrega Local' },
  '88': { ciudad: 'Nuevo Laredo / Frontera Norte, Tamps.', costo: 2400, plazo: '2–3 días hábiles', metodo: 'Madrina Asegurada' },
  '44': { ciudad: 'Guadalajara, Jal.', costo: 2900, plazo: '2–3 días hábiles', metodo: 'Madrina Asegurada' },
  '76': { ciudad: 'Santiago de Querétaro, Qro.', costo: 1800, plazo: '1–2 días hábiles', metodo: 'Madrina Asegurada' },
  '72': { ciudad: 'Puebla, Pue.', costo: 1900, plazo: '1–2 días hábiles', metodo: 'Madrina Asegurada' },
  '20': { ciudad: 'Aguascalientes, Ags.', costo: 2500, plazo: '2–3 días hábiles', metodo: 'Madrina Asegurada' },
  '97': { ciudad: 'Mérida, Yuc.', costo: 4900, plazo: '4–6 días hábiles', metodo: 'Madrina Asegurada' },
};

const COUPONS: Record<string, { tipo: 'porcentaje' | 'fijo'; valor: number; minimo: number; descripcion: string }> = {
  LOTERIA2026: { tipo: 'fijo', valor: 15000, minimo: 300000, descripcion: 'Bono de $15,000 MXN en seminuevos certificados' },
  BONO5: { tipo: 'porcentaje', valor: 5, minimo: 400000, descripcion: '5% de descuento en compras mayores a $400,000 MXN' },
};

const formatMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

function AlertBanner({
  type,
  title,
  children,
}: {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-neutral-900 border-neutral-700 text-neutral-100',
    success: 'bg-neutral-900 border-white/50 text-white',
    warning: 'bg-neutral-900 border-red-600/60 text-neutral-100',
    error: 'bg-red-950/80 border-red-600 text-red-100',
  }[type];
  return (
    <div role="alert" className={`rounded-lg border p-4 text-sm leading-relaxed ${styles}`}>
      {title && <p className="font-bold uppercase tracking-wide text-white mb-1">{title}</p>}
      <div>{children}</div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-black uppercase tracking-wider text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="rounded border border-neutral-700 px-3 py-1 text-xs font-bold uppercase text-neutral-300 hover:border-red-600 hover:text-white"
          >
            ESC · Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  type Page = 'inicio' | 'catalogo' | 'pdp' | 'checkout' | 'cuenta' | 'nosotros' | 'ayuda' | 'admin';

  const [page, setPage] = useState<Page>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(INITIAL_VEHICLES[0].id);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(INITIAL_VEHICLES[0].variantes[0].id);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCondicion, setFilterCondicion] = useState<'Todos' | 'Usado Certificado' | 'Nuevo'>('Todos');
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [filterMarca, setFilterMarca] = useState<string>('Todas');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const PAGE_SIZE = 4;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['v-101']);
  const [favOpen, setFavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cookieBannerOpen, setCookieBannerOpen] = useState<boolean>(true);

  const [user, setUser] = useState<{ nombre: string; email: string; role: 'cliente' | 'admin' } | null>({
    nombre: 'Ismael Juárez (Cliente Prueba)',
    email: 'cliente.prueba@loteria.mx',
    role: 'cliente',
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      folio: 'LRI-2026-8841',
      fecha: '2026-11-10 14:22',
      cliente_nombre: 'Ismael Juárez (Cliente Prueba)',
      cliente_email: 'cliente.prueba@loteria.mx',
      cliente_telefono: '+52 867 123 4567',
      metodo_entrega: 'Madrina Asegurada',
      direccion: 'Av. Reforma 450, Col. Centro',
      cp: '88000',
      plazo_estimado: '2–3 días hábiles',
      items: [
        {
          sku: 'LRI-USD-2022-002',
          nombre: 'Toyota Corolla SE Hybrid',
          condicion: 'Usado Certificado',
          variante: 'Blanco Perlado · Estándar Lote',
          cantidad: 1,
          precio_unitario: 379000,
        },
      ],
      subtotal: 379000,
      descuento: 0,
      envio: 2400,
      iva: 52276,
      total: 381400,
      pago_estado: 'capturado',
      pago_referencia: 'SBX-9910283',
      status: 'entregado',
      paqueteria: 'Transportes Automotrices del Norte',
      guia: 'MAD-8841-MX',
      evidencia_despacho: 'Checklist Pre-Embarque #INSP-402 · VIN Verificado',
      terminos_version: 'v2026.1',
      terminos_timestamp: '2026-11-10T14:22:00Z',
    },
  ]);

  const [returnsList, setReturnsList] = useState<ReturnRequest[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      folio: 'ATN-2026-1001',
      fecha: '2026-11-12 10:15',
      nombre: 'Ismael Juárez (Cliente Prueba)',
      email: 'cliente.prueba@loteria.mx',
      tipo: 'Duda',
      order_folio: 'LRI-2026-8841',
      mensaje: 'Consulta sobre vigencia de garantía de tren motriz en seminuevos certificados.',
      nivel_escalamiento: 'Nivel 1 · Soporte General',
      status: 'Resuelto',
      resolucion: 'Se confirmó cobertura por 12 meses o 20,000 km conforme a póliza y art. 77 LFPC.',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: 'aud-1',
      timestamp: '2026-11-10 14:22:05',
      actor: 'cliente.prueba@loteria.mx',
      accion: 'CREAR_PEDIDO',
      entidad: 'orders',
      detalle: 'Folio LRI-2026-8841 confirmado y stock actualizado.',
    },
  ]);

  const [chkNombre, setChkNombre] = useState('Ismael Juárez (Cliente Prueba)');
  const [chkEmail, setChkEmail] = useState('cliente.prueba@loteria.mx');
  const [chkTelefono, setChkTelefono] = useState('8671234567');
  const [chkMetodoEntrega, setChkMetodoEntrega] = useState<'Madrina Asegurada' | 'Entrega Local' | 'Recolección en Showroom'>('Madrina Asegurada');
  const [chkDireccion, setChkDireccion] = useState('Av. Guerrero 1200, Col. Juárez');
  const [chkCp, setChkCp] = useState('88000');
  const [chkCoupon, setChkCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [chkTerms, setChkTerms] = useState(false);
  const [chkMarketing, setChkMarketing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState<'terminos' | 'privacidad' | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [busyCheckout, setBusyCheckout] = useState(false);
  const [ayudaTab, setAyudaTab] = useState<'soporte' | 'legal' | 'privacidad' | 'logistica' | 'garantias' | 'cfdi'>('soporte');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4200);
  };

  const logAudit = (accion: string, entidad: string, detalle: string) => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: user?.email || 'invitado@loteria.mx',
        accion,
        entidad,
        detalle,
      },
      ...prev,
    ]);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.status !== 'activo') return false;
      if (onlyAvailable && v.stock <= 0) return false;
      if (filterCondicion !== 'Todos' && v.condicion !== filterCondicion) return false;
      if (filterCategoria !== 'Todas' && v.categoria !== filterCategoria) return false;
      if (filterMarca !== 'Todas' && v.marca.toUpperCase() !== filterMarca.toUpperCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          v.nombre.toLowerCase().includes(q) ||
          v.marca.toLowerCase().includes(q) ||
          v.sku.toLowerCase().includes(q) ||
          v.categoria.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [vehicles, onlyAvailable, filterCondicion, filterCategoria, filterMarca, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));
  const paginatedVehicles = filteredVehicles.slice((currentPageNum - 1) * PAGE_SIZE, currentPageNum * PAGE_SIZE);

  const addToCart = (vehicle: Vehicle, variant?: ProductVariant) => {
    const chosenVar = variant || vehicle.variantes[0];
    if (vehicle.stock <= 0 || chosenVar.stock <= 0) {
      notify('Inventario insuficiente: esta unidad ya no cuenta con existencias.');
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === vehicle.id && i.variant.id === chosenVar.id);
      if (idx >= 0) {
        const currentQty = prev[idx].cantidad;
        const maxStock = Math.min(vehicle.stock, chosenVar.stock);
        if (currentQty + 1 > maxStock) {
          notify(`Límite de inventario alcanzado (${maxStock} disponibles).`);
          return prev;
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cantidad: currentQty + 1 };
        notify(`Cantidad actualizada: ${vehicle.nombre}`);
        return copy;
      }
      notify(`Añadido al carrito: ${vehicle.nombre}`);
      return [...prev, { product: vehicle, variant: chosenVar, cantidad: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQty = (productId: string, variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId || item.variant.id !== variantId) return item;
          const maxStock = Math.min(item.product.stock, item.variant.stock);
          const nextQty = item.cantidad + delta;
          if (nextQty > maxStock) {
            notify(`No puedes exceder el inventario disponible (${maxStock}).`);
            return item;
          }
          return { ...item, cantidad: nextQty };
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const postalInfo = POSTAL_ZONES[chkCp.slice(0, 2)] || null;
  const cartSubtotal = cart.reduce((acc, i) => acc + (i.product.precio + i.variant.precio_extra) * i.cantidad, 0);
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || !COUPONS[appliedCoupon]) return 0;
    const c = COUPONS[appliedCoupon];
    if (cartSubtotal < c.minimo) return 0;
    return c.tipo === 'fijo' ? c.valor : Math.round((cartSubtotal * c.valor) / 100);
  }, [appliedCoupon, cartSubtotal]);

  const shippingCost =
    chkMetodoEntrega === 'Recolección en Showroom' ? 0 : postalInfo ? postalInfo.costo : 3500;
  const estimatedDelivery =
    chkMetodoEntrega === 'Recolección en Showroom'
      ? 'Entrega inmediata tras validación de pago (24 hrs)'
      : postalInfo
      ? postalInfo.plazo
      : '3–5 días hábiles (sujeto a validación de cobertura)';

  const totalFinal = Math.max(0, cartSubtotal - couponDiscount + shippingCost);
  const ivaDesglosado = Math.round(totalFinal - totalFinal / 1.16);

  const handleConfirmSandboxOrder = (resultadoPago: 'aprobado' | 'rechazado') => {
    if (busyCheckout) return;
    setBusyCheckout(true);
    setConfirmModalOpen(false);

    setTimeout(() => {
      if (resultadoPago === 'rechazado') {
        setBusyCheckout(false);
        notify('Pago sandbox rechazado por el emisor simulado. Tu carrito e inventario permanecen intactos.');
        logAudit('PAGO_RECHAZADO', 'payments', `Intento fallido en sandbox para ${chkEmail}`);
        return;
      }

      for (const item of cart) {
        const currentV = vehicles.find((v) => v.id === item.product.id);
        if (!currentV || currentV.stock < item.cantidad) {
          setBusyCheckout(false);
          notify(`Error de concurrencia: stock insuficiente para ${item.product.nombre}.`);
          return;
        }
      }

      setVehicles((prev) =>
        prev.map((v) => {
          const inCart = cart.filter((c) => c.product.id === v.id);
          if (inCart.length === 0) return v;
          const totalBought = inCart.reduce((s, c) => s + c.cantidad, 0);
          return {
            ...v,
            stock: Math.max(0, v.stock - totalBought),
            variantes: v.variantes.map((vr) => {
              const found = inCart.find((c) => c.variant.id === vr.id);
              return found ? { ...vr, stock: Math.max(0, vr.stock - found.cantidad) } : vr;
            }),
          };
        })
      );

      const newFolio = `LRI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowIso = new Date().toISOString();
      const newOrder: Order = {
        folio: newFolio,
        fecha: nowIso.replace('T', ' ').slice(0, 16),
        cliente_nombre: chkNombre,
        cliente_email: chkEmail,
        cliente_telefono: chkTelefono,
        metodo_entrega: chkMetodoEntrega,
        direccion: chkMetodoEntrega === 'Recolección en Showroom' ? 'Showroom Central LOTE RIA · Monterrey / CDMX' : chkDireccion,
        cp: chkCp,
        plazo_estimado: estimatedDelivery,
        items: cart.map((c) => ({
          sku: c.product.sku,
          nombre: c.product.nombre,
          condicion: c.product.condicion,
          variante: c.variant.valor,
          cantidad: c.cantidad,
          precio_unitario: c.product.precio + c.variant.precio_extra,
        })),
        subtotal: cartSubtotal,
        descuento: couponDiscount,
        envio: shippingCost,
        iva: ivaDesglosado,
        total: totalFinal,
        pago_estado: 'capturado',
        pago_referencia: `SBX-${Date.now().toString().slice(-7)}`,
        status: 'pagado',
        terminos_version: 'v2026.1',
        terminos_timestamp: nowIso,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setLastCompletedOrder(newOrder);
      setCart([]);
      setAppliedCoupon(null);
      setBusyCheckout(false);
      logAudit('PEDIDO_CONFIRMADO', 'orders', `Folio ${newFolio} pagado en sandbox por ${formatMXN(totalFinal)}`);
      notify(`¡Pedido ${newFolio} confirmado! Se generó tu comprobante interno.`);
    }, 450);
  };

  const downloadOrderReceipt = (ord: Order) => {
    const content = `====================================================================
LOTE RIA S.A. DE C.V. (PROYECTO ACADÉMICO - COMERCIO ELECTRÓNICO)
RFC FICTICIO: LRI260101XYZ · Showroom Monterrey / CDMX
====================================================================
COMPROBANTE INTERNO DE PEDIDO (NO ES UN CFDI NI TIENE VALIDEZ FISCAL)
Folio de Pedido: ${ord.folio}
Fecha y Hora:    ${ord.fecha}
Referencia Pago: ${ord.pago_referencia} (${ord.pago_estado.toUpperCase()})
--------------------------------------------------------------------
CLIENTE Y ENTREGA:
Nombre:          ${ord.cliente_nombre}
Correo:          ${ord.cliente_email}
Teléfono:        ${ord.cliente_telefono}
Método Entrega:  ${ord.metodo_entrega}
Dirección / CP:  ${ord.direccion} (CP ${ord.cp})
Plazo Estimado:  ${ord.plazo_estimado}
--------------------------------------------------------------------
PARTIDAS ADQUIRIDAS:
${ord.items
  .map(
    (it) =>
      `• [${it.sku}] ${it.nombre} (${it.condicion}) | ${it.variante} x${it.cantidad} = ${formatMXN(
        it.precio_unitario * it.cantidad
      )}`
  )
  .join('\n')}
--------------------------------------------------------------------
Subtotal:        ${formatMXN(ord.subtotal)} MXN
Descuento:      -${formatMXN(ord.descuento)} MXN
Envío:           ${formatMXN(ord.envio)} MXN
IVA Incluido:    ${formatMXN(ord.iva)} MXN (16%)
TOTAL PAGADO:    ${formatMXN(ord.total)} MXN
--------------------------------------------------------------------
EVIDENCIA DE CONTRATACIÓN ELECTRÓNICA (CÓDIGO DE COMERCIO):
Términos y Condiciones aceptados: Versión ${ord.terminos_version}
Timestamp de acción afirmativa:   ${ord.terminos_timestamp}
Póliza de Garantía aplicable:     LFPC Arts. 77 y 78 (12 meses usados / 36 meses nuevos)
====================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_${ord.folio}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md rounded-lg border border-red-600 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl"
        >
          {toast}
        </div>
      )}

      <div className="border-b border-neutral-900 bg-neutral-950 px-4 py-2 text-center text-xs text-neutral-300">
        <span className="font-bold uppercase tracking-wider text-red-500">LOTE DE SEMINUEVOS CERTIFICADOS:</span> Comercializamos autos usados inspeccionados en 150 puntos; las unidades{' '}
        <span className="rounded bg-white px-1.5 py-0.5 font-extrabold text-black">NUEVAS (0 KM)</span> se señalan explícitamente. · Precios en MXN con IVA incluido.
      </div>

      <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5">
          <button
            type="button"
            onClick={() => setPage('inicio')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-sm font-black tracking-tighter text-white">
              LR
            </span>
            <span className="text-lg font-black uppercase tracking-wider text-white">
              LOTE RIA
            </span>
          </button>

          <nav aria-label="Navegación principal" className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider lg:flex">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'catalogo', label: 'Catálogo' },
              { id: 'nosotros', label: 'Nosotros' },
              { id: 'ayuda', label: 'Ayuda y Políticas' },
              { id: 'cuenta', label: 'Cuenta' },
              { id: 'admin', label: 'Admin' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id as Page)}
                className={`border-b-2 pb-1 transition-colors ${
                  page === item.id
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:block">
              <input
                type="search"
                aria-label="Buscar modelo o marca"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (page !== 'catalogo') setPage('catalogo');
                }}
                placeholder="Buscar modelo, marca..."
                className="w-48 rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-red-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setFavOpen(true)}
              aria-label={`Favoritos (${favorites.length})`}
              className="rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs font-bold text-white hover:border-red-600"
            >
              ♡ <span className="hidden sm:inline">Favoritos</span> ({favorites.length})
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito (${cart.reduce((s, i) => s + i.cantidad, 0)} unidades)`}
              className="rounded bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500"
            >
              Carrito ({cart.reduce((s, i) => s + i.cantidad, 0)})
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menú móvil"
              className="rounded border border-neutral-800 px-2.5 py-1.5 text-xs font-bold text-white lg:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        <div className="hidden border-t border-neutral-900 bg-neutral-950/90 py-2 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-[11px] font-bold tracking-widest text-neutral-400">
            {BRAND_BAR.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => {
                  setFilterMarca(brand);
                  setCurrentPageNum(1);
                  setPage('catalogo');
                }}
                className="transition-colors hover:text-red-500"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav aria-label="Menú móvil" className="border-t border-neutral-800 bg-neutral-950 px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
              {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'catalogo', label: 'Catálogo' },
                { id: 'nosotros', label: 'Nosotros' },
                { id: 'ayuda', label: 'Ayuda y Políticas' },
                { id: 'cuenta', label: 'Mi Cuenta' },
                { id: 'admin', label: 'Panel Admin' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPage(item.id as Page);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded px-3 py-2 text-left ${
                    page === item.id ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {page === 'inicio' && (
          <div className="space-y-12">
            <section className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 p-6 sm:p-12">
              <div className="relative z-10 max-w-2xl space-y-5">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500">
                  <span className="h-0.5 w-6 bg-red-600" />
                  <span>CONCESIONARIO SEMINUEVOS CERTIFICADOS · DESDE 1998</span>
                </div>
                <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
                  CONDUCE <br />
                  <span className="text-red-600">LO QUE</span> <br />
                  MERECES.
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Lote especializado en seminuevos certificados de Ford, Kia, Chevrolet, Nissan, Honda, Mazda y Toyota — y una selección exclusiva de unidades{' '}
                  <span className="font-bold text-white underline decoration-red-600">Nuevas (0 km)</span> debidamente señaladas. Todos verificados, con garantía legal LFPC desde el primer día.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterMarca('Todas');
                      setPage('catalogo');
                    }}
                    className="rounded bg-red-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-red-500"
                  >
                    VER CATÁLOGO
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAyudaTab('garantias');
                      setPage('ayuda');
                    }}
                    className="rounded border border-white/30 bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:border-white"
                  >
                    PÓLIZA DE GARANTÍA
                  </button>
                </div>
              </div>
            </section>

            <section aria-labelledby="destacados-heading" className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-neutral-900 pb-3">
                <div>
                  <h2 id="destacados-heading" className="text-2xl font-black uppercase tracking-wide text-white">
                    Unidades disponibles en patio
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Diferenciación explícita entre seminuevos certificados de lote y unidades nuevas de agencia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPage('catalogo')}
                  className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400"
                >
                  Ver todo el inventario →
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.slice(0, 6).map((v) => (
                  <article
                    key={v.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 transition hover:border-red-600/60"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img src={v.imagen} alt={`${v.nombre} ${v.anio}`} className="h-full w-full object-cover" />
                      <span
                        className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow ${
                          v.condicion === 'Nuevo'
                            ? 'bg-white text-black'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {v.condicion === 'Nuevo' ? 'NUEVO · 0 KM' : `USADO CERTIFICADO · ${v.km.toLocaleString()} KM`}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFavorites((prev) =>
                            prev.includes(v.id) ? prev.filter((x) => x !== v.id) : [...prev, v.id]
                          )
                        }
                        aria-label="Alternar favorito"
                        className="absolute right-3 top-3 rounded bg-black/80 px-2.5 py-1 text-xs text-white hover:bg-red-600"
                      >
                        {favorites.includes(v.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="font-bold uppercase">{v.marca} · {v.categoria} · {v.anio}</span>
                          <span className="font-mono text-[11px]">{v.sku}</span>
                        </div>
                        <h3 className="mt-1 text-lg font-extrabold text-white">{v.nombre}</h3>
                        <p className="mt-1 text-xs text-neutral-400">
                          {v.transmision} · {v.combustible} · Stock: <strong className="text-white">{v.stock}</strong>
                        </p>
                      </div>

                      <div className="space-y-3 border-t border-neutral-900 pt-3">
                        <div>
                          <p className="text-xl font-black text-white">{formatMXN(v.precio)}</p>
                          <p className="text-[11px] text-neutral-400">MXN · IVA (16%) incluido</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVehicleId(v.id);
                              setSelectedVariantId(v.variantes[0].id);
                              setPage('pdp');
                            }}
                            className="rounded border border-neutral-700 px-3 py-2 text-xs font-bold uppercase text-white hover:border-white"
                          >
                            Ver Ficha
                          </button>
                          <button
                            type="button"
                            disabled={v.stock <= 0}
                            onClick={() => addToCart(v)}
                            className="rounded bg-red-600 px-3 py-2 text-xs font-black uppercase text-white hover:bg-red-500 disabled:opacity-40"
                          >
                            {v.stock > 0 ? 'Añadir' : 'Agotado'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {page === 'catalogo' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">Inventario de Vehículos</h1>
              <p className="text-xs text-neutral-400">
                Filtra por condición (Usado Certificado de lote o Unidad Nueva 0 km), categoría, marca y disponibilidad.
              </p>
            </div>

            <div className="grid gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label htmlFor="flt-search" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Buscar modelo o SKU
                </label>
                <input
                  id="flt-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPageNum(1);
                  }}
                  placeholder="Ej. Mazda, Hybrid, LRI-USD..."
                  className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="flt-cond" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Condición
                </label>
                <select
                  id="flt-cond"
                  value={filterCondicion}
                  onChange={(e) => {
                    setFilterCondicion(e.target.value as any);
                    setCurrentPageNum(1);
                  }}
                  className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                >
                  <option value="Todos">Todos (Usados y Nuevos)</option>
                  <option value="Usado Certificado">Usado Certificado (Lote)</option>
                  <option value="Nuevo">Nuevo (0 km)</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-cat" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Categoría
                </label>
                <select
                  id="flt-cat"
                  value={filterCategoria}
                  onChange={(e) => {
                    setFilterCategoria(e.target.value);
                    setCurrentPageNum(1);
                  }}
                  className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                >
                  <option value="Todas">Todas</option>
                  <option value="Sedán">Sedán</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Deportivo">Deportivo</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-marca" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Marca
                </label>
                <select
                  id="flt-marca"
                  value={filterMarca}
                  onChange={(e) => {
                    setFilterMarca(e.target.value);
                    setCurrentPageNum(1);
                  }}
                  className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                >
                  <option value="Todas">Todas las marcas</option>
                  {Array.from(new Set([...vehicles.map((v) => v.marca.toUpperCase()), ...BRAND_BAR])).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => {
                      setOnlyAvailable(e.target.checked);
                      setCurrentPageNum(1);
                    }}
                    className="h-4 w-4 accent-red-600"
                  />
                  Solo con stock disponible
                </label>
              </div>
            </div>

            {paginatedVehicles.length === 0 ? (
              <AlertBanner type="warning" title="Sin resultados">
                No hay unidades que coincidan con los filtros seleccionados. Intenta limpiar la búsqueda o seleccionar &quot;Todas las marcas&quot;.
              </AlertBanner>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {paginatedVehicles.map((v) => (
                  <article key={v.id} className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                    <img src={v.imagen} alt={v.nombre} className="h-48 w-full sm:h-auto sm:w-48 object-cover" />
                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                      <div>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[11px] font-black uppercase ${
                            v.condicion === 'Nuevo' ? 'bg-white text-black' : 'bg-red-600 text-white'
                          }`}
                        >
                          {v.condicion === 'Nuevo' ? 'NUEVO · 0 KM' : `USADO CERTIFICADO · ${v.km.toLocaleString()} KM`}
                        </span>
                        <h2 className="mt-1 text-lg font-bold text-white">{v.nombre}</h2>
                        <p className="text-xs text-neutral-400">
                          SKU: {v.sku} · {v.anio} · {v.transmision} · Stock: {v.stock}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-neutral-900 pt-3">
                        <div>
                          <p className="text-lg font-black text-white">{formatMXN(v.precio)}</p>
                          <p className="text-[11px] text-neutral-400">MXN · IVA incl.</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVehicleId(v.id);
                              setSelectedVariantId(v.variantes[0].id);
                              setPage('pdp');
                            }}
                            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase hover:border-white"
                          >
                            Ficha
                          </button>
                          <button
                            type="button"
                            disabled={v.stock <= 0}
                            onClick={() => addToCart(v)}
                            className="rounded bg-red-600 px-3 py-1.5 text-xs font-black uppercase text-white hover:bg-red-500 disabled:opacity-40"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-neutral-900 pt-4 text-xs text-neutral-400">
              <span>
                Mostrando {paginatedVehicles.length} de {filteredVehicles.length} unidades
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPageNum <= 1}
                  onClick={() => setCurrentPageNum((p) => p - 1)}
                  className="rounded border border-neutral-700 px-3 py-1.5 font-bold text-white disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-2 py-1.5 font-bold text-white">
                  Página {currentPageNum} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPageNum >= totalPages}
                  onClick={() => setCurrentPageNum((p) => p + 1)}
                  className="rounded border border-neutral-700 px-3 py-1.5 font-bold text-white disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'pdp' && selectedVehicle && (
          <div className="space-y-8">
            <button
              type="button"
              onClick={() => setPage('catalogo')}
              className="text-xs font-bold uppercase tracking-wider text-red-500 hover:underline"
            >
              ← Volver al inventario
            </button>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                  <img src={selectedVehicle.imagen} alt={selectedVehicle.nombre} className="w-full object-cover aspect-video" />
                </div>
                <p className="text-[11px] text-neutral-500">{selectedVehicle.atribucion_imagen}</p>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-3 py-1 text-xs font-black uppercase ${
                      selectedVehicle.condicion === 'Nuevo'
                        ? 'bg-white text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {selectedVehicle.condicion === 'Nuevo'
                      ? 'UNIDAD NUEVA (0 KM)'
                      : `USADO CERTIFICADO · ${selectedVehicle.km.toLocaleString()} KM`}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">SKU: {selectedVehicle.sku}</span>
                </div>

                <h1 className="text-3xl font-black text-white">{selectedVehicle.nombre}</h1>
                <p className="text-sm text-neutral-300">{selectedVehicle.descripcion}</p>

                <div className="space-y-2">
                  <label htmlFor="pdp-variant" className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Selecciona Variante / Paquete
                  </label>
                  <select
                    id="pdp-variant"
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white"
                  >
                    {selectedVehicle.variantes.map((vr) => (
                      <option key={vr.id} value={vr.id}>
                        {vr.valor} {vr.precio_extra > 0 ? `(+${formatMXN(vr.precio_extra)})` : '(Sin costo extra)'} — Stock: {vr.stock}
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const activeVar =
                    selectedVehicle.variantes.find((x) => x.id === selectedVariantId) || selectedVehicle.variantes[0];
                  const unitPrice = selectedVehicle.precio + activeVar.precio_extra;
                  return (
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                      <p className="text-3xl font-black text-white">{formatMXN(unitPrice)}</p>
                      <p className="text-xs text-neutral-400">
                        Precio total en MXN · Incluye IVA (16%) · Garantía: {selectedVehicle.garantia_meses} meses o{' '}
                        {selectedVehicle.garantia_km.toLocaleString()} km (LFPC Arts. 77–78).
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={selectedVehicle.stock <= 0 || activeVar.stock <= 0}
                          onClick={() => addToCart(selectedVehicle, activeVar)}
                          className="flex-1 rounded bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-40"
                        >
                          {selectedVehicle.stock > 0 ? 'AÑADIR AL CARRITO' : 'SIN EXISTENCIAS'}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs">
                  <div>
                    <span className="text-neutral-400">Motor / Combustible:</span>
                    <p className="font-bold text-white">{selectedVehicle.combustible}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Transmisión / Potencia:</span>
                    <p className="font-bold text-white">
                      {selectedVehicle.transmision} · {selectedVehicle.potencia_hp} HP
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Dimensiones:</span>
                    <p className="font-bold text-white">{selectedVehicle.dimensiones}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Peso Vehicular:</span>
                    <p className="font-bold text-white">{selectedVehicle.peso_kg.toLocaleString()} kg</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
              <h2 className="text-lg font-black uppercase text-white">Reseñas y Opiniones de Compradores</h2>
              {selectedVehicle.reviews.filter((r) => r.aprobada).length === 0 ? (
                <p className="text-sm text-neutral-400">Aún no hay reseñas publicadas para esta unidad.</p>
              ) : (
                <div className="space-y-3">
                  {selectedVehicle.reviews
                    .filter((r) => r.aprobada)
                    .map((r) => (
                      <div key={r.id} className="rounded border border-neutral-800 bg-black p-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-red-500">
                            {'★'.repeat(r.rating)} · {r.user_name}
                          </span>
                          <span className="text-neutral-500">{r.fecha}</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-300">{r.comentario}</p>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {page === 'checkout' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">Finalizar Pedido y Pago Sandbox</h1>

            {lastCompletedOrder ? (
              <div className="rounded-xl border border-white/40 bg-neutral-950 p-6 space-y-4">
                <span className="inline-block rounded bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
                  PEDIDO CONFIRMADO · FOLIO {lastCompletedOrder.folio}
                </span>
                <h2 className="text-2xl font-bold text-white">¡Gracias por tu compra académica en LOTE RIA!</h2>
                <p className="text-sm text-neutral-300">
                  Referencia de pago sandbox: <strong>{lastCompletedOrder.pago_referencia}</strong> · Plazo estimado de entrega:{' '}
                  <strong>{lastCompletedOrder.plazo_estimado}</strong>.
                </p>
                <AlertBanner type="warning" title="Aviso Fiscal (SAT / CFDI)">
                  El comprobante generado es un <strong>comprobante interno de pedido académico</strong> y{' '}
                  <strong>no constituye un CFDI válido ante el SAT</strong>. Puedes registrar tus datos de solicitud de factura en la sección <em>Cuenta</em>.
                </AlertBanner>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => downloadOrderReceipt(lastCompletedOrder)}
                    className="rounded bg-red-600 px-5 py-3 text-xs font-black uppercase text-white hover:bg-red-500"
                  >
                    Descargar Comprobante de Pedido
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLastCompletedOrder(null);
                      setPage('cuenta');
                    }}
                    className="rounded border border-white/40 px-5 py-3 text-xs font-bold uppercase text-white hover:border-white"
                  >
                    Ver Seguimiento en Mi Cuenta
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <AlertBanner type="info" title="Tu carrito está vacío">
                Agrega al menos un vehículo del catálogo antes de iniciar el checkout.
              </AlertBanner>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-5">
                  <AlertBanner type="info" title="Aviso de Privacidad Simplificado (LFPDPPP 2025)">
                    <strong>LOTE RIA S.A. de C.V.</strong> (entorno académico) recabará tus datos de contacto y entrega únicamente para gestionar este pedido, logística y garantía.{' '}
                    <strong>Utiliza exclusivamente datos ficticios de prueba.</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setLegalModalDoc('privacidad')}
                      className="underline font-bold text-red-500"
                    >
                      Leer Aviso Integral
                    </button>
                    .
                  </AlertBanner>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                    <h2 className="text-lg font-black uppercase text-white">1. Datos de Contacto y Entrega</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="chk-nombre" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          id="chk-nombre"
                          value={chkNombre}
                          onChange={(e) => setChkNombre(e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="chk-email" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Correo electrónico *
                        </label>
                        <input
                          id="chk-email"
                          type="email"
                          value={chkEmail}
                          onChange={(e) => setChkEmail(e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="chk-tel" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Teléfono *
                        </label>
                        <input
                          id="chk-tel"
                          value={chkTelefono}
                          onChange={(e) => setChkTelefono(e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="chk-metodo" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Método de entrega (6.2)
                        </label>
                        <select
                          id="chk-metodo"
                          value={chkMetodoEntrega}
                          onChange={(e) => setChkMetodoEntrega(e.target.value as any)}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        >
                          <option value="Madrina Asegurada">Transporte Nacional en Madrina Asegurada</option>
                          <option value="Entrega Local">Entrega Local (CDMX / Monterrey)</option>
                          <option value="Recolección en Showroom">Recolección Presencial en Showroom ($0)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="chk-dir" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Calle, número y colonia *
                        </label>
                        <input
                          id="chk-dir"
                          value={chkDireccion}
                          onChange={(e) => setChkDireccion(e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="chk-cp" className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                          Código Postal (5 dígitos) *
                        </label>
                        <input
                          id="chk-cp"
                          maxLength={5}
                          value={chkCp}
                          onChange={(e) => setChkCp(e.target.value.replace(/\D/g, ''))}
                          className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <p className="text-xs text-neutral-300">
                          <strong>Cobertura:</strong> {postalInfo ? postalInfo.ciudad : 'Nacional estándar'} ·{' '}
                          <span className="text-red-500 font-bold">{estimatedDelivery}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
                    <h2 className="text-lg font-black uppercase text-white">2. Contratación Electrónica y Consentimiento</h2>
                    <label className="flex items-start gap-2.5 text-xs text-neutral-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chkTerms}
                        onChange={(e) => setChkTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-red-600"
                      />
                      <span>
                        He leído y acepto expresamente los{' '}
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('terminos')}
                          className="font-bold text-red-500 underline"
                        >
                          Términos y Condiciones (v2026.1)
                        </button>{' '}
                        y el{' '}
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('privacidad')}
                          className="font-bold text-red-500 underline"
                        >
                          Aviso de Privacidad Integral
                        </button>
                        , reconociendo la condición del vehículo (Usado Certificado / Nuevo según ficha). *
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chkMarketing}
                        onChange={(e) => setChkMarketing(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-red-600"
                      />
                      <span>
                        (Opcional) Deseo recibir promociones y disponibilidad de seminuevos de LOTE RIA (finalidad secundaria conforme a LFPDPPP).
                      </span>
                    </label>
                  </div>
                </div>

                <aside className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4 h-fit">
                  <h2 className="text-lg font-black uppercase text-white">Resumen del Pedido</h2>
                  <div className="space-y-2 border-b border-neutral-800 pb-3 text-xs">
                    {cart.map((c) => (
                      <div key={`${c.product.id}-${c.variant.id}`} className="flex justify-between gap-2">
                        <span>
                          {c.product.nombre} ({c.product.condicion}) ×{c.cantidad}
                        </span>
                        <span className="font-bold">
                          {formatMXN((c.product.precio + c.variant.precio_extra) * c.cantidad)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={chkCoupon}
                      onChange={(e) => setChkCoupon(e.target.value.toUpperCase())}
                      placeholder="Cupón (ej. LOTERIA2026)"
                      className="flex-1 rounded border border-neutral-700 bg-black px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (COUPONS[chkCoupon]) {
                          setAppliedCoupon(chkCoupon);
                          notify(`Cupón ${chkCoupon} aplicado.`);
                        } else {
                          notify('Cupón inválido o no cumple monto mínimo.');
                        }
                      }}
                      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase hover:border-white"
                    >
                      Aplicar
                    </button>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span>{formatMXN(cartSubtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-white font-semibold">
                        <span>Descuento ({appliedCoupon})</span>
                        <span>-{formatMXN(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-400">
                      <span>Envío ({chkMetodoEntrega})</span>
                      <span>{formatMXN(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>IVA incluido (16%)</span>
                      <span>{formatMXN(ivaDesglosado)}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-800 pt-2 text-lg font-black text-white">
                      <span>Total MXN</span>
                      <span>{formatMXN(totalFinal)}</span>
                    </div>
                  </div>

                  <AlertBanner type="info">
                    <strong>Pasarela Sandbox Segura:</strong> No solicitamos ni almacenamos números de tarjeta (PAN) ni CVV.
                  </AlertBanner>

                  <button
                    type="button"
                    disabled={!chkTerms || !chkNombre.trim() || !chkEmail.trim() || chkCp.length < 5}
                    onClick={() => setConfirmModalOpen(true)}
                    className="w-full rounded bg-red-600 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-40"
                  >
                    Revisar y Proceder al Pago Sandbox
                  </button>
                </aside>
              </div>
            )}
          </div>
        )}

        {page === 'cuenta' && (
          <AccountSection
            user={user}
            setUser={setUser}
            orders={orders}
            setOrders={setOrders}
            returnsList={returnsList}
            setReturnsList={setReturnsList}
            logAudit={logAudit}
            notify={notify}
            downloadOrderReceipt={downloadOrderReceipt}
          />
        )}

        {page === 'nosotros' && (
          <div className="space-y-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Identidad del Proveedor</span>
              <h1 className="text-3xl font-black uppercase text-white">Sobre LOTE RIA S.A. de C.V.</h1>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Somos una plataforma digital especializada en la comercialización B2C de{' '}
                <strong>vehículos seminuevos y usados certificados</strong> en México, complementada con un inventario selecto de{' '}
                <strong>unidades nuevas (0 km)</strong> debidamente identificadas. Cada vehículo usado pasa por una certificación mecánica y legal de 150 puntos antes de publicarse.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2 text-xs">
                <div className="rounded border border-neutral-800 bg-black p-4">
                  <p className="font-bold uppercase text-red-500">Razón Social y RFC Ficticio</p>
                  <p className="mt-1 text-neutral-300">LOTE RIA S.A. de C.V. (Entorno Académico)</p>
                  <p className="font-mono text-neutral-400">RFC: LRI260101XYZ</p>
                </div>
                <div className="rounded border border-neutral-800 bg-black p-4">
                  <p className="font-bold uppercase text-red-500">Domicilio Físico Showroom</p>
                  <p className="mt-1 text-neutral-300">Av. Constitución 2450 Pte., Col. Obispado, C.P. 64060, Monterrey, N.L., México.</p>
                </div>
                <div className="rounded border border-neutral-800 bg-black p-4">
                  <p className="font-bold uppercase text-red-500">Canales Oficiales (6.3)</p>
                  <p className="mt-1 text-neutral-300">soporte@loteria.mx · garantias@loteria.mx</p>
                  <p className="text-neutral-400">Tel: +52 81 1234 5678 · Lun–Sáb 9:00–19:00 hrs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 'ayuda' && (
          <AyudaPoliticasSection
            activeTab={ayudaTab}
            setActiveTab={setAyudaTab}
            tickets={tickets}
            setTickets={setTickets}
            notify={notify}
            logAudit={logAudit}
          />
        )}

        {page === 'admin' && (
          <AdminSection
            user={user}
            vehicles={vehicles}
            setVehicles={setVehicles}
            orders={orders}
            setOrders={setOrders}
            returnsList={returnsList}
            setReturnsList={setReturnsList}
            tickets={tickets}
            setTickets={setTickets}
            auditLogs={auditLogs}
            logAudit={logAudit}
            notify={notify}
          />
        )}
      </main>

      {cookieBannerOpen && (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-neutral-800 bg-black/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-black uppercase tracking-wider text-white">TU PRIVACIDAD IMPORTA</p>
              <p className="text-neutral-400">
                Usamos cookies esenciales para carrito y seguridad. Las analíticas y de marketing solo se activan con tu permiso (LFPDPPP 2025).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCookieBannerOpen(false)}
                className="rounded border border-neutral-700 px-3 py-1.5 font-bold uppercase text-white hover:border-white"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={() => setCookieBannerOpen(false)}
                className="rounded bg-red-600 px-3 py-1.5 font-black uppercase text-white hover:bg-red-500"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 py-10 text-xs text-neutral-400">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="font-black uppercase text-white">LOTE RIA S.A. DE C.V.</p>
            <p>Lote de seminuevos certificados y unidades nuevas seleccionadas. RFC ficticio: LRI260101XYZ.</p>
            <p>Av. Constitución 2450 Pte., Monterrey, N.L. · Tel. +52 81 1234 5678</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold uppercase text-white">Políticas y Marco Legal (México)</p>
            <button type="button" onClick={() => { setAyudaTab('legal'); setPage('ayuda'); }} className="block hover:text-red-500">
              Términos y Condiciones (v2026.1) · LFPC Art. 76 Bis
            </button>
            <button type="button" onClick={() => { setAyudaTab('privacidad'); setPage('ayuda'); }} className="block hover:text-red-500">
              Aviso de Privacidad Integral y Derechos ARCO (LFPDPPP 2025)
            </button>
            <button type="button" onClick={() => { setAyudaTab('garantias'); setPage('ayuda'); }} className="block hover:text-red-500">
              Cancelaciones, Devoluciones y Garantías (LFPC Arts. 56, 77–78)
            </button>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold uppercase text-white">Logística, Facturación y Soporte</p>
            <button type="button" onClick={() => { setAyudaTab('logistica'); setPage('ayuda'); }} className="block hover:text-red-500">
              Cobertura Geográfica, Plazos e Incidencias (6.2)
            </button>
            <button type="button" onClick={() => { setAyudaTab('cfdi'); setPage('ayuda'); }} className="block hover:text-red-500">
              Solicitud de Factura CFDI 4.0 y Deslinde Fiscal (8.4)
            </button>
            <button type="button" onClick={() => { setAyudaTab('soporte'); setPage('ayuda'); }} className="block hover:text-red-500">
              Centro de Atención al Cliente y Tickets (6.3)
            </button>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold uppercase text-white">Propiedad Intelectual y Licencias</p>
            <p>
              Las marcas automotrices mencionadas pertenecen a sus respectivos titulares y se usan únicamente con fines ilustrativos y académicos. Fotografías bajo licencia abierta Unsplash.
            </p>
          </div>
        </div>
      </footer>

      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirmación Final y Simulador de Pago Sandbox"
      >
        <div className="space-y-4 text-sm">
          <p className="text-neutral-300">Verifica los datos de tu orden antes de ejecutar el pago de prueba:</p>
          <div className="rounded border border-neutral-800 bg-black p-4 space-y-1 text-xs">
            <p><strong>Cliente:</strong> {chkNombre} ({chkEmail})</p>
            <p><strong>Entrega:</strong> {chkMetodoEntrega} · {chkDireccion} (CP {chkCp})</p>
            <p><strong>Plazo estimado:</strong> {estimatedDelivery}</p>
            <p><strong>Total a pagar:</strong> <span className="text-base font-black text-red-500">{formatMXN(totalFinal)} MXN</span> (IVA incluido)</p>
          </div>
          <AlertBanner type="info">
            Entorno Sandbox: No se capturan ni almacenan datos bancarios reales (PAN/CVV). Selecciona el resultado de simulación:
          </AlertBanner>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleConfirmSandboxOrder('aprobado')}
              className="rounded bg-white py-3 text-xs font-black uppercase text-black hover:bg-neutral-200"
            >
              ✓ SIMULAR PAGO APROBADO
            </button>
            <button
              type="button"
              onClick={() => handleConfirmSandboxOrder('rechazado')}
              className="rounded bg-red-600 py-3 text-xs font-black uppercase text-white hover:bg-red-500"
            >
              ✕ SIMULAR PAGO RECHAZADO
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={legalModalDoc !== null}
        onClose={() => setLegalModalDoc(null)}
        title={legalModalDoc === 'terminos' ? 'Términos y Condiciones (v2026.1)' : 'Aviso de Privacidad Integral (LFPDPPP 2025)'}
      >
        {legalModalDoc === 'terminos' ? (
          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
            <p><strong>1. Objeto y Naturaleza de las Unidades:</strong> LOTE RIA S.A. de C.V. comercializa vehículos seminuevos/usados certificados con inspección de 150 puntos y, cuando así se indique expresamente en la ficha, vehículos nuevos (0 km).</p>
            <p><strong>2. Precios y Pagos:</strong> Todos los importes se expresan en Pesos Mexicanos (MXN) con IVA (16%) incluido. El pago en esta plataforma académica opera en modo sandbox sin captura de tarjetas reales.</p>
            <p><strong>3. Cancelación y Devoluciones (LFPC):</strong> Cancelación sin costo antes del despacho. Derecho de revocación dentro de los 5 días hábiles siguientes a la entrega (art. 56 LFPC) y garantía legal mínima conforme a los arts. 77 y 78 LFPC.</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
            <p><strong>Responsable:</strong> LOTE RIA S.A. de C.V. (entorno académico), domicilio en Av. Constitución 2450 Pte., Monterrey, N.L.</p>
            <p><strong>Finalidades Primarias:</strong> Gestión de pedidos, entrega logística, garantías y atención al cliente. <strong>Finalidades Secundarias (opcionales):</strong> Envío de boletines y promociones.</p>
            <p><strong>Derechos ARCO:</strong> Puedes ejercer Acceso, Rectificación, Cancelación u Oposición escribiendo a <strong>arco@loteria.mx</strong> conforme a la LFPDPPP publicada el 20 de marzo de 2025.</p>
          </div>
        )}
      </Modal>

      <Modal open={cartOpen} onClose={() => setCartOpen(false)} title="Carrito de Compras">
        {cart.length === 0 ? (
          <p className="text-sm text-neutral-400">No tienes vehículos en el carrito.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((c) => {
              const maxStock = Math.min(c.product.stock, c.variant.stock);
              return (
                <div key={`${c.product.id}-${c.variant.id}`} className="flex items-center justify-between gap-3 rounded border border-neutral-800 bg-black p-3 text-xs">
                  <div>
                    <p className="font-bold text-white">{c.product.nombre}</p>
                    <p className="text-neutral-400">{c.variant.valor} · {formatMXN(c.product.precio + c.variant.precio_extra)} c/u</p>
                    <p className="text-[11px] text-red-500 font-bold">Stock disponible: {maxStock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateCartQty(c.product.id, c.variant.id, -1)}
                      className="rounded border border-neutral-700 px-2 py-1 font-bold"
                    >
                      −
                    </button>
                    <span className="font-bold">{c.cantidad}</span>
                    <button
                      type="button"
                      disabled={c.cantidad >= maxStock}
                      onClick={() => updateCartQty(c.product.id, c.variant.id, 1)}
                      className="rounded border border-neutral-700 px-2 py-1 font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
              <span className="text-sm font-black">Subtotal: {formatMXN(cartSubtotal)} MXN</span>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  setPage('checkout');
                }}
                className="rounded bg-red-600 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-red-500"
              >
                Ir a Checkout →
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={favOpen} onClose={() => setFavOpen(false)} title="Unidades Guardadas en Favoritos">
        <div className="space-y-3 text-xs">
          {vehicles.filter((v) => favorites.includes(v.id)).length === 0 ? (
            <p className="text-neutral-400">Aún no has guardado vehículos en favoritos.</p>
          ) : (
            vehicles
              .filter((v) => favorites.includes(v.id))
              .map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded border border-neutral-800 bg-black p-3">
                  <div>
                    <p className="font-bold text-white">{v.nombre}</p>
                    <p className="text-neutral-400">{v.condicion} · {formatMXN(v.precio)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFavOpen(false);
                      setSelectedVehicleId(v.id);
                      setSelectedVariantId(v.variantes[0].id);
                      setPage('pdp');
                    }}
                    className="rounded bg-red-600 px-3 py-1.5 font-bold uppercase text-white"
                  >
                    Ver ficha
                  </button>
                </div>
              ))
          )}
        </div>
      </Modal>
    </div>
  );
}

function AccountSection({
  user,
  setUser,
  orders,
  setOrders,
  returnsList,
  setReturnsList,
  logAudit,
  notify,
  downloadOrderReceipt,
}: any) {
  const [retOrderFolio, setRetOrderFolio] = useState('');
  const [retTipo, setRetTipo] = useState<'Devolución' | 'Cambio' | 'Garantía'>('Devolución');
  const [retSupuesto, setRetSupuesto] = useState('Defecto mecánico / vicio oculto');
  const [retMotivo, setRetMotivo] = useState('');
  const [retEvidencia, setRetEvidencia] = useState('');
  const [cfdiFolio, setCfdiFolio] = useState('');
  const [cfdiRfc, setCfdiRfc] = useState('');
  const [cfdiRazon, setCfdiRazon] = useState('');
  const [cfdiCp, setCfdiCp] = useState('');
  const [cfdiRegimen, setCfdiRegimen] = useState('612 - Personas Físicas con Actividades Empresariales');
  const [cfdiUso, setCfdiUso] = useState('I03 - Equipo de transporte');

  const handleCancelOrder = (folio: string) => {
    setOrders((prev: Order[]) =>
      prev.map((o) =>
        o.folio === folio ? { ...o, status: 'cancelado', pago_estado: o.pago_estado === 'capturado' ? 'reembolsado' : o.pago_estado } : o
      )
    );
    logAudit('CANCELACION_CLIENTE', 'orders', `Pedido ${folio} cancelado por cliente antes del envío.`);
    notify(`Pedido ${folio} cancelado. Reembolso programado en 3–7 días hábiles.`);
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retOrderFolio || !retMotivo.trim()) return;
    const prefix = retTipo === 'Garantía' ? 'GAR' : 'DEV';
    const newFolio = `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const req: ReturnRequest = {
      folio: newFolio,
      order_folio: retOrderFolio,
      fecha: new Date().toISOString().slice(0, 10),
      cliente_email: user?.email || 'cliente.prueba@loteria.mx',
      tipo: retTipo,
      supuesto: retSupuesto,
      motivo: retMotivo,
      evidencia_url: retEvidencia || 'Evidencia fotográfica adjunta en expediente',
      status: 'En revisión',
    };
    setReturnsList((prev: ReturnRequest[]) => [req, ...prev]);
    setRetMotivo('');
    setRetEvidencia('');
    logAudit('SOLICITUD_DEVOLUCION', 'return_requests', `Folio ${newFolio} creado para pedido ${retOrderFolio}`);
    notify(`Solicitud registrada con folio ${newFolio}.`);
  };

  const handleRequestCfdi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfdiFolio || !cfdiRfc || !cfdiRazon || cfdiCp.length < 5) return;
    setOrders((prev: Order[]) =>
      prev.map((o) =>
        o.folio === cfdiFolio
          ? {
              ...o,
              factura_solicitada: {
                rfc: cfdiRfc.toUpperCase(),
                razon_social: cfdiRazon,
                cp_fiscal: cfdiCp,
                regimen: cfdiRegimen,
                uso_cfdi: cfdiUso,
              },
            }
          : o
      )
    );
    logAudit('SOLICITUD_CFDI', 'orders', `Datos fiscales registrados para ${cfdiFolio} (RFC ${cfdiRfc.toUpperCase()})`);
    notify(`Solicitud de factura registrada para ${cfdiFolio}.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div>
          <h1 className="text-2xl font-black uppercase text-white">Mi Cuenta y Seguimiento</h1>
          <p className="text-xs text-neutral-400">
            Sesión activa: <strong>{user?.nombre}</strong> ({user?.email}) · Rol: <span className="uppercase text-red-500 font-bold">{user?.role}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setUser({ nombre: 'Ismael Juárez (Cliente Prueba)', email: 'cliente.prueba@loteria.mx', role: 'cliente' });
              notify('Cambiado a cuenta Cliente de prueba.');
            }}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase hover:border-white"
          >
            Usar Cuenta Cliente
          </button>
          <button
            type="button"
            onClick={() => {
              setUser({ nombre: 'Admin LOTE RIA (Prueba)', email: 'admin@loteria.mx', role: 'admin' });
              notify('Cambiado a cuenta Administrador de prueba.');
            }}
            className="rounded bg-red-600 px-3 py-1.5 text-xs font-black uppercase text-white"
          >
            Usar Cuenta Admin
          </button>
          <button
            type="button"
            onClick={() => notify('Recuperación simulada: se envió enlace temporal seguro a tu correo registrado.')}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-white"
          >
            ¿Olvidaste contraseña? (Simulado)
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase text-white">Historial de Pedidos ({orders.length})</h2>
        {orders.map((ord: Order) => (
          <div key={ord.folio} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <span className="font-mono text-sm font-black text-red-500">{ord.folio}</span>
                <span className="ml-3 text-xs text-neutral-400">{ord.fecha}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded bg-neutral-900 border border-neutral-700 px-3 py-1 font-bold uppercase text-white">
                  Estado: {ord.status}
                </span>
                <span className="rounded bg-white px-3 py-1 font-black uppercase text-black">
                  Pago: {ord.pago_estado}
                </span>
              </div>
            </div>
            <div className="text-xs text-neutral-300 space-y-1">
              {ord.items.map((it, idx) => (
                <p key={idx}>
                  • <strong>{it.nombre}</strong> ({it.condicion}) — {it.variante} ×{it.cantidad} · {formatMXN(it.precio_unitario)}
                </p>
              ))}
              <p className="text-neutral-400">
                Entrega: {ord.metodo_entrega} · {ord.direccion} (CP {ord.cp}) · Plazo: {ord.plazo_estimado}
              </p>
              {ord.guia && (
                <p className="text-white font-semibold">
                  Guía logística: <strong>{ord.guia}</strong> ({ord.paqueteria}) · {ord.evidencia_despacho}
                </p>
              )}
              {ord.incidencia_logistica && (
                <p className="text-red-500 font-bold">Incidencia reportada: {ord.incidencia_logistica}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span className="text-base font-black text-white">Total: {formatMXN(ord.total)} MXN</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadOrderReceipt(ord)}
                  className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-bold uppercase hover:border-white"
                >
                  Descargar Comprobante
                </button>
                {['pendiente', 'pagado', 'en_preparacion'].includes(ord.status) && (
                  <button
                    type="button"
                    onClick={() => handleCancelOrder(ord.folio)}
                    className="rounded bg-red-600 px-3 py-1.5 text-xs font-black uppercase text-white hover:bg-red-500"
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateReturn} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
          <h2 className="text-lg font-black uppercase text-white">Solicitar Devolución, Cambio o Garantía (7.4)</h2>
          <div>
            <label htmlFor="ret-ord" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Folio de Pedido</label>
            <select
              id="ret-ord"
              value={retOrderFolio}
              onChange={(e) => setRetOrderFolio(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
            >
              <option value="">Selecciona un pedido...</option>
              {orders.map((o: Order) => (
                <option key={o.folio} value={o.folio}>{o.folio} ({o.status})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ret-tipo" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Tipo de trámite</label>
              <select
                id="ret-tipo"
                value={retTipo}
                onChange={(e) => setRetTipo(e.target.value as any)}
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              >
                <option value="Devolución">Devolución</option>
                <option value="Cambio">Cambio de unidad</option>
                <option value="Garantía">Garantía mecánica/legal</option>
              </select>
            </div>
            <div>
              <label htmlFor="ret-sup" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Supuesto (7.2)</label>
              <select
                id="ret-sup"
                value={retSupuesto}
                onChange={(e) => setRetSupuesto(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              >
                <option>Defecto mecánico / vicio oculto</option>
                <option>Dañado en tránsito</option>
                <option>Unidad o versión incorrecta</option>
                <option>Documentación/accesorios incompletos</option>
                <option>Revocación (Art. 56 LFPC · 5 días)</option>
                <option>Devolución voluntaria por cortesía</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="ret-mot" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Descripción detallada y VIN *</label>
            <textarea
              id="ret-mot"
              rows={2}
              value={retMotivo}
              onChange={(e) => setRetMotivo(e.target.value)}
              placeholder="Describe la situación y evidencia..."
              className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label htmlFor="ret-ev" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Enlace HTTPS de evidencia (opcional)</label>
            <input
              id="ret-ev"
              value={retEvidencia}
              onChange={(e) => setRetEvidencia(e.target.value)}
              placeholder="https://..."
              className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
            />
          </div>
          <button type="submit" className="rounded bg-red-600 px-4 py-2.5 text-xs font-black uppercase text-white">
            Generar Solicitud con Folio
          </button>

          {returnsList.length > 0 && (
            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <p className="font-bold uppercase text-white">Mis Solicitudes Registradas:</p>
              {returnsList.map((r: ReturnRequest) => (
                <div key={r.folio} className="rounded border border-neutral-800 bg-black p-3">
                  <p className="font-bold text-red-500">{r.folio} · {r.tipo} ({r.status})</p>
                  <p className="text-neutral-400">Pedido: {r.order_folio} · {r.supuesto}</p>
                  {r.resolucion && <p className="text-white font-semibold mt-1">Resolución: {r.resolucion}</p>}
                  {r.explicacion_admin && <p className="text-neutral-300 mt-1">Nota soporte: {r.explicacion_admin}</p>}
                </div>
              ))}
            </div>
          )}
        </form>

        <form onSubmit={handleRequestCfdi} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
          <h2 className="text-lg font-black uppercase text-white">Solicitar Factura Fiscal (CFDI 4.0)</h2>
          <p className="text-xs text-neutral-400">
            Solo solicitamos los datos fiscales indispensables conforme al SAT. El comprobante interno del pedido no sustituye al CFDI.
          </p>
          <div>
            <label htmlFor="cfdi-ord" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Folio de Pedido Pagado</label>
            <select
              id="cfdi-ord"
              value={cfdiFolio}
              onChange={(e) => setCfdiFolio(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
            >
              <option value="">Selecciona pedido...</option>
              {orders.map((o: Order) => (
                <option key={o.folio} value={o.folio}>{o.folio}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfdi-rfc" className="block text-xs font-bold uppercase text-neutral-400 mb-1">RFC *</label>
              <input
                id="cfdi-rfc"
                value={cfdiRfc}
                onChange={(e) => setCfdiRfc(e.target.value)}
                placeholder="XAXX010101000"
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="cfdi-cp" className="block text-xs font-bold uppercase text-neutral-400 mb-1">C.P. Fiscal *</label>
              <input
                id="cfdi-cp"
                maxLength={5}
                value={cfdiCp}
                onChange={(e) => setCfdiCp(e.target.value.replace(/\D/g, ''))}
                placeholder="64060"
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="cfdi-razon" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Nombre o Razón Social *</label>
            <input
              id="cfdi-razon"
              value={cfdiRazon}
              onChange={(e) => setCfdiRazon(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cfdi-reg" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Régimen Fiscal</label>
              <input
                id="cfdi-reg"
                value={cfdiRegimen}
                onChange={(e) => setCfdiRegimen(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="cfdi-uso" className="block text-xs font-bold uppercase text-neutral-400 mb-1">Uso de CFDI</label>
              <input
                id="cfdi-uso"
                value={cfdiUso}
                onChange={(e) => setCfdiUso(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <button type="submit" className="rounded border border-red-600 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-red-600">
            Registrar Datos para CFDI
          </button>
        </form>
      </div>
    </div>
  );
}

function AyudaPoliticasSection({ activeTab, setActiveTab, tickets, setTickets, notify, logAudit }: any) {
  const [tNombre, setTNombre] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tTipo, setTTipo] = useState<'Duda' | 'Aclaración' | 'Queja' | 'Reclamación'>('Duda');
  const [tOrder, setTOrder] = useState('');
  const [tMsg, setTMsg] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tNombre.trim() || !tEmail.trim() || !tMsg.trim()) return;
    if (/\b\d{13,19}\b/.test(tMsg.replace(/[\s-]/g, ''))) {
      notify('Por seguridad, no ingreses números de tarjeta bancaria ni CVV en el formulario.');
      return;
    }
    const newFolio = `ATN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket: SupportTicket = {
      folio: newFolio,
      fecha: new Date().toISOString().replace('T', ' ').slice(0, 16),
      nombre: tNombre,
      email: tEmail,
      tipo: tTipo,
      order_folio: tOrder || undefined,
      mensaje: tMsg,
      nivel_escalamiento: tTipo === 'Reclamación' || tTipo === 'Queja' ? 'Nivel 2 · Postventa y Logística' : 'Nivel 1 · Soporte General',
      status: 'Abierto',
    };
    setTickets((prev: SupportTicket[]) => [ticket, ...prev]);
    setTMsg('');
    logAudit('TICKET_SOPORTE', 'support_tickets', `Ticket ${newFolio} (${tTipo}) creado por ${tEmail}`);
    notify(`Ticket ${newFolio} creado. Plazo objetivo de respuesta: ≤ 4 horas hábiles.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase text-white sm:text-3xl">Centro de Ayuda, Políticas y Cumplimiento Legal</h1>
        <p className="text-xs text-neutral-400">
          Documentación académica adaptada a la legislación vigente en México (LFPC, LFPDPPP 2025, Código de Comercio y NOM-122-SCFI).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3 text-xs font-bold uppercase">
        {[
          { id: 'soporte', label: '6.3 Atención y Tickets' },
          { id: 'garantias', label: '7. Cancelaciones, Devoluciones y Garantías' },
          { id: 'logistica', label: '6.2 Logística y Cobertura' },
          { id: 'legal', label: '8.1 / 8.3 Marco Legal y LFPC' },
          { id: 'privacidad', label: '8.2 Aviso de Privacidad (LFPDPPP 2025)' },
          { id: 'cfdi', label: '8.4 Fiscal (CFDI) y Propiedad Intelectual' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`rounded px-3 py-2 ${
              activeTab === t.id ? 'bg-red-600 text-white' : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'soporte' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-2 text-xs text-neutral-300">
              <h2 className="text-base font-black uppercase text-white">Canales Oficiales y Escalamiento (6.3)</h2>
              <p><strong>Correo de soporte:</strong> soporte@loteria.mx · <strong>Teléfono:</strong> +52 81 1234 5678</p>
              <p><strong>Horario de atención:</strong> Lunes a Sábado de 09:00 a 19:00 hrs (Tiempo del Centro).</p>
              <p><strong>Plazo objetivo de respuesta:</strong> Menor a 4 horas hábiles en Nivel 1.</p>
              <div className="mt-3 rounded border border-neutral-800 bg-black p-3 space-y-1">
                <p className="font-bold uppercase text-red-500">Procedimiento de Escalamiento:</p>
                <p>• <strong>Nivel 1 (≤ 4 hrs):</strong> Asesoría comercial y dudas generales.</p>
                <p>• <strong>Nivel 2 (≤ 12 hrs):</strong> Supervisión logística, envíos y postventa.</p>
                <p>• <strong>Nivel 3 (≤ 24 hrs):</strong> Gerencia comercial y conciliación de reclamaciones.</p>
              </div>
            </div>

            <AlertBanner type="warning" title="Advertencia de Seguridad">
              LOTE RIA <strong>nunca</strong> te solicitará contraseñas, NIP, códigos CVV ni números completos de tarjeta por formulario, correo o teléfono.
            </AlertBanner>

            <form onSubmit={handleCreateTicket} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
              <h3 className="text-base font-black uppercase text-white">Generar Folio de Atención</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={tNombre}
                  onChange={(e) => setTNombre(e.target.value)}
                  placeholder="Tu nombre *"
                  className="rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
                />
                <input
                  value={tEmail}
                  onChange={(e) => setTEmail(e.target.value)}
                  placeholder="Correo electrónico *"
                  className="rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={tTipo}
                  onChange={(e) => setTTipo(e.target.value as any)}
                  className="rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
                >
                  <option>Duda</option>
                  <option>Aclaración</option>
                  <option>Queja</option>
                  <option>Reclamación</option>
                </select>
                <input
                  value={tOrder}
                  onChange={(e) => setTOrder(e.target.value)}
                  placeholder="Folio de pedido (opcional)"
                  className="rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
                />
              </div>
              <textarea
                rows={3}
                value={tMsg}
                onChange={(e) => setTMsg(e.target.value)}
                placeholder="Describe tu solicitud (no incluyas datos bancarios) *"
                className="w-full rounded border border-neutral-700 bg-black px-3 py-2 text-xs text-white"
              />
              <button type="submit" className="rounded bg-red-600 px-4 py-2 text-xs font-black uppercase text-white">
                Enviar y Obtener Folio
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 text-xs text-neutral-300">
              <h2 className="text-base font-black uppercase text-white">Preguntas Frecuentes (FAQ)</h2>
              <details className="rounded border border-neutral-800 bg-black p-3" open>
                <summary className="font-bold text-white cursor-pointer">¿Los autos son usados o nuevos?</summary>
                <p className="mt-1">LOTE RIA es principalmente un lote de autos seminuevos/usados certificados (150 puntos). Cuando una unidad es Nueva (0 km), se indica explícitamente en su etiqueta y ficha.</p>
              </details>
              <details className="rounded border border-neutral-800 bg-black p-3">
                <summary className="font-bold text-white cursor-pointer">¿Cómo funciona la garantía en seminuevos?</summary>
                <p className="mt-1">Incluye póliza de 12 meses o 20,000 km en tren motriz conforme a los arts. 77 y 78 de la LFPC.</p>
              </details>
              <details className="rounded border border-neutral-800 bg-black p-3">
                <summary className="font-bold text-white cursor-pointer">¿El comprobante de compra es una factura CFDI?</summary>
                <p className="mt-1">No. El comprobante interno confirma tu pedido académico; la solicitud de CFDI 4.0 se gestiona con tus datos fiscales en <em>Cuenta</em>.</p>
              </details>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-2 text-xs">
              <h3 className="text-base font-black uppercase text-white">Seguimiento de Tickets Recientes</h3>
              {tickets.map((tk: SupportTicket) => (
                <div key={tk.folio} className="rounded border border-neutral-800 bg-black p-3">
                  <p className="font-bold text-red-500">{tk.folio} · {tk.tipo} ({tk.status})</p>
                  <p className="text-neutral-300">{tk.mensaje}</p>
                  {tk.resolucion && <p className="mt-1 text-white font-semibold">Resolución: {tk.resolucion}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'garantias' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h2 className="text-lg font-black uppercase text-white">Política de Cancelaciones, Devoluciones, Cambios y Garantías (LFPC México)</h2>
          <p><strong>1. Naturaleza del Lote:</strong> LOTE RIA opera como lote de vehículos seminuevos certificados y comercializa puntualmente unidades nuevas (0 km) debidamente identificadas. Ninguna cláusula limita los derechos irrenunciables previstos en la Ley Federal de Protección al Consumidor.</p>
          <p><strong>2. Cancelación (7.1):</strong> Puede solicitarse sin penalización desde <em>Cuenta</em> mientras el pedido esté en estado <em>Pendiente</em>, <em>Pagado</em> o <em>En preparación</em>. Si ya fue despachado, se gestiona devolución al remitente descontando únicamente fletes comprobables si no es imputable a LOTE RIA. Reembolso en 3 a 7 días hábiles.</p>
          <p><strong>3. Devoluciones y Cambios (7.2):</strong> Se reconocen 6 supuestos: (a) defecto mecánico/vicio oculto, (b) daño en tránsito, (c) unidad incorrecta, (d) accesorios/documentos incompletos, (e) incumplimiento de plazo de entrega, y (f) derecho de revocación dentro de 5 días hábiles (art. 56 LFPC) o devolución voluntaria hasta 15 días naturales (máx. 300 km de prueba, con llaves, manuales, factura/documentos y VIN íntegro). En los supuestos (a)–(e), LOTE RIA cubre el 100% del transporte de retorno.</p>
          <p><strong>4. Garantías (7.3 · Arts. 77 y 78 LFPC):</strong> Seminuevos certificados: <strong>12 meses o 20,000 km</strong> en motor, transmisión y diferencial. Unidades Nuevas (0 km): <strong>36 meses o 60,000 km</strong> defensa a defensa respaldada por armadora. Excluye piezas de desgaste natural (balatas, llantas, plumillas) o mal uso. Canal de reclamación: <strong>garantias@loteria.mx</strong> o en Showroom Monterrey, aplicando reparación sin costo, reposición equivalente o devolución íntegra.</p>
        </div>
      )}

      {activeTab === 'logistica' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h2 className="text-lg font-black uppercase text-white">Logística, Cobertura y Protocolo de Entrega (6.2)</h2>
          <p><strong>Cobertura y Zonas Excluidas:</strong> Cobertura nacional terrestre mediante madrina/plataforma asegurada y entrega local sin costo en CDMX (CP 06xxx) y Monterrey (CP 64xxx). Se excluyen zonas insulares o caminos rurales sin acceso para transporte nodriza (en cuyo caso aplica recolección en sucursal).</p>
          <p><strong>Preparación, Evidencia y Recepción:</strong> Cada unidad pasa por checklist pre-embarque, sellado de protección, carta porte, número de guía y póliza de seguro de tránsito al 100%. Al recibir, se firma acta de entrega con verificación de VIN y odómetro.</p>
          <p><strong>Retrasos e Incidencias:</strong> Ante retrasos mayores a 48 hrs o daño en tránsito, el cliente puede optar por reparación certificada sin costo, cambio de unidad o reembolso íntegro.</p>
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h2 className="text-lg font-black uppercase text-white">Marco Legal, LFPC Art. 76 Bis y Código de Comercio (8.1 y 8.3)</h2>
          <p><strong>LFPC (Arts. 7, 7 Bis, 32 y 76 Bis):</strong> Se exhiben precios totales en MXN con IVA incluido, características veraces, identidad y domicilio del proveedor antes de contratar.</p>
          <p><strong>Distinción con Código de Ética de PROFECO:</strong> LOTE RIA adopta voluntariamente las buenas prácticas del Código de Ética en Comercio Electrónico de PROFECO, distinguiéndolas de las obligaciones legales imperativas de la LFPC y de las reglas de contratos de adhesión para compraventa de vehículos usados (NOM-122-SCFI).</p>
          <p><strong>Contratación Electrónica (Código de Comercio Arts. 89–93):</strong> La aceptación se recaba mediante acción afirmativa (casilla desmarcada por defecto), conservando versión del documento, marca de tiempo (timestamp), identidad del cliente y folio de pedido.</p>
        </div>
      )}

      {activeTab === 'privacidad' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h2 className="text-lg font-black uppercase text-white">Aviso de Privacidad Integral (LFPDPPP vigente · DOF 20-03-2025)</h2>
          <p><strong>Responsable:</strong> LOTE RIA S.A. de C.V. (proyecto académico), Av. Constitución 2450 Pte., Monterrey, N.L.</p>
          <p><strong>Datos Tratados:</strong> Identificación, contacto y domicilio de entrega. No recabamos datos personales sensibles ni números de tarjeta bancaria (PAN/CVV).</p>
          <p><strong>Finalidades:</strong> Primarias (gestión de pedido, logística, garantía y facturación) y Secundarias opcionales (mercadotecnia mediante consentimiento separado).</p>
          <p><strong>Derechos ARCO y Revocación:</strong> Envía solicitud a <strong>arco@loteria.mx</strong> con identificación y descripción del derecho a ejercer (Acceso, Rectificación, Cancelación u Oposición). Plazo de respuesta: 20 días hábiles.</p>
        </div>
      )}

      {activeTab === 'cfdi' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 text-xs text-neutral-300 leading-relaxed">
          <h2 className="text-lg font-black uppercase text-white">Información Fiscal (CFDI) y Propiedad Intelectual (8.4)</h2>
          <p><strong>Deslinde Fiscal SAT:</strong> Esta tienda académica <strong>no emite CFDI timbrados ante el SAT</strong>; los comprobantes descargables son documentos internos de control académico. En operación real, la emisión de CFDI 4.0 se realiza conforme al régimen aplicable solicitando únicamente RFC, Razón Social, C.P. fiscal, Régimen Fiscal y Uso de CFDI.</p>
          <p><strong>Propiedad Intelectual y Licencias:</strong> El código fuente utiliza bibliotecas de código abierto (MIT), tipografías Google Fonts (OFL) y fotografías de Unsplash con atribución. Las marcas automotrices mencionadas son propiedad de sus titulares y se emplean solo como referencia académica.</p>
        </div>
      )}
    </div>
  );
}

function AdminSection({
  user,
  vehicles,
  setVehicles,
  orders,
  setOrders,
  returnsList,
  setReturnsList,
  tickets,
  setTickets,
  auditLogs,
  logAudit,
  notify,
}: any) {
  const [tab, setTab] = useState<'dashboard' | 'pedidos' | 'inventario' | 'devoluciones' | 'tickets' | 'auditoria'>('dashboard');
  const [guiaInput, setGuiaInput] = useState<Record<string, string>>({});
  const [incidenciaInput, setIncidenciaInput] = useState<Record<string, string>>({});

  if (!user || user.role !== 'admin') {
    return (
      <AlertBanner type="error" title="403 Forbidden · Acceso Denegado (Control RBAC)">
        Tu cuenta actual (<strong>{user?.email || 'Visitante'}</strong>) tiene rol <strong>{user?.role || 'invitado'}</strong> y no cuenta con permisos administrativos. Cambia a la cuenta Admin en <em>Cuenta</em> para probar este panel.
      </AlertBanner>
    );
  }

  const totalVentas = orders
    .filter((o: Order) => o.pago_estado === 'capturado')
    .reduce((s: number, o: Order) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black uppercase text-white">Panel Administrativo LOTE RIA</h1>
          <p className="text-xs text-neutral-400">Gestión operativa, logística, inventario, devoluciones, tickets y bitácora.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3 text-xs font-bold uppercase">
        {[
          { id: 'dashboard', label: 'Dashboard y Reportes' },
          { id: 'pedidos', label: `Pedidos y Logística (${orders.length})` },
          { id: 'inventario', label: 'Inventario y Catálogo' },
          { id: 'devoluciones', label: `Devoluciones / Garantías (${returnsList.length})` },
          { id: 'tickets', label: `Tickets Soporte (${tickets.length})` },
          { id: 'auditoria', label: `Bitácora (${auditLogs.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`rounded px-3 py-2 ${
              tab === t.id ? 'bg-red-600 text-white' : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs uppercase text-neutral-400">Ventas Netas Capturadas</p>
            <p className="mt-1 text-2xl font-black text-white">{formatMXN(totalVentas)}</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs uppercase text-neutral-400">Total de Pedidos</p>
            <p className="mt-1 text-2xl font-black text-white">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs uppercase text-neutral-400">Unidades en Patio (Stock)</p>
            <p className="mt-1 text-2xl font-black text-red-500">
              {vehicles.reduce((s: number, v: Vehicle) => s + v.stock, 0)}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-xs uppercase text-neutral-400">Devoluciones / Garantías</p>
            <p className="mt-1 text-2xl font-black text-white">{returnsList.length}</p>
          </div>
        </div>
      )}

      {tab === 'pedidos' && (
        <div className="space-y-4">
          {orders.map((ord: Order) => (
            <div key={ord.folio} className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-red-500">{ord.folio} · {ord.cliente_nombre}</span>
                <span className="rounded bg-white px-2.5 py-1 font-black uppercase text-black">{ord.status}</span>
              </div>
              <p className="text-neutral-400">Total: {formatMXN(ord.total)} · Entrega: {ord.metodo_entrega} ({ord.cp})</p>
              <div className="flex flex-wrap gap-2">
                {(['en_preparacion', 'enviado', 'entregado'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setOrders((prev: Order[]) =>
                        prev.map((o) =>
                          o.folio === ord.folio
                            ? {
                                ...o,
                                status: st,
                                paqueteria: st === 'enviado' ? 'Madrina Certificada LOTE RIA' : o.paqueteria,
                                guia: st === 'enviado' ? guiaInput[ord.folio] || `GUIA-${ord.folio}` : o.guia,
                                evidencia_despacho:
                                  st === 'enviado' ? 'Checklist pre-embarque aprobado + seguro tránsito' : o.evidencia_despacho,
                              }
                            : o
                        )
                      );
                      logAudit('CAMBIO_ESTADO_PEDIDO', 'orders', `${ord.folio} -> ${st}`);
                      notify(`Pedido ${ord.folio} actualizado a ${st}.`);
                    }}
                    className="rounded border border-neutral-700 px-3 py-1.5 font-bold uppercase hover:border-white"
                  >
                    Marcar {st}
                  </button>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 pt-2">
                <input
                  value={guiaInput[ord.folio] || ''}
                  onChange={(e) => setGuiaInput({ ...guiaInput, [ord.folio]: e.target.value })}
                  placeholder="Número de guía para despacho..."
                  className="rounded border border-neutral-700 bg-black px-3 py-1.5 text-white"
                />
                <div className="flex gap-2">
                  <input
                    value={incidenciaInput[ord.folio] || ''}
                    onChange={(e) => setIncidenciaInput({ ...incidenciaInput, [ord.folio]: e.target.value })}
                    placeholder="Registrar incidencia / intento fallido..."
                    className="flex-1 rounded border border-neutral-700 bg-black px-3 py-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const txt = incidenciaInput[ord.folio];
                      if (!txt) return;
                      setOrders((prev: Order[]) =>
                        prev.map((o) => (o.folio === ord.folio ? { ...o, incidencia_logistica: txt } : o))
                      );
                      logAudit('INCIDENCIA_LOGISTICA', 'shipments', `${ord.folio}: ${txt}`);
                      notify('Incidencia logística registrada.');
                    }}
                    className="rounded bg-red-600 px-3 py-1.5 font-black uppercase text-white"
                  >
                    Reportar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'inventario' && (
        <div className="space-y-3 text-xs">
          {vehicles.map((v: Vehicle) => (
            <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <div>
                <p className="font-bold text-white">
                  [{v.sku}] {v.nombre} ({v.condicion})
                </p>
                <p className="text-neutral-400">Precio: {formatMXN(v.precio)} · Existencias actuales: <strong>{v.stock}</strong></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVehicles((prev: Vehicle[]) =>
                      prev.map((item) => (item.id === v.id ? { ...item, stock: item.stock + 1 } : item))
                    );
                    logAudit('AJUSTE_INVENTARIO', 'products', `+1 unidad a ${v.sku}`);
                    notify(`Stock incrementado para ${v.sku}`);
                  }}
                  className="rounded bg-white px-3 py-1.5 font-black uppercase text-black"
                >
                  +1 Entrada Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'devoluciones' && (
        <div className="space-y-3 text-xs">
          {returnsList.length === 0 ? (
            <p className="text-neutral-400">No hay solicitudes de devolución o garantía pendientes.</p>
          ) : (
            returnsList.map((r: ReturnRequest) => (
              <div key={r.folio} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <p className="font-bold text-red-500">{r.folio} · Pedido {r.order_folio} · {r.tipo} ({r.status})</p>
                <p className="text-neutral-300">Supuesto: {r.supuesto} — Motivo: {r.motivo}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setReturnsList((prev: ReturnRequest[]) =>
                        prev.map((item) =>
                          item.folio === r.folio
                            ? {
                                ...item,
                                status: 'Resuelta',
                                resolucion: 'Reembolso',
                                explicacion_admin: 'Inspección física y de VIN aprobada. Reembolso emitido al método original.',
                              }
                            : item
                        )
                      );
                      setOrders((prev: Order[]) =>
                        prev.map((o) =>
                          o.folio === r.order_folio ? { ...o, status: 'reembolsado', pago_estado: 'reembolsado' } : o
                        )
                      );
                      logAudit('RESOLUCION_DEVOLUCION', 'return_requests', `${r.folio} resuelta con Reembolso.`);
                      notify(`Solicitud ${r.folio} autorizada y reembolsada.`);
                    }}
                    className="rounded bg-white px-3 py-1.5 font-black uppercase text-black"
                  >
                    Autorizar y Emitir Reembolso
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReturnsList((prev: ReturnRequest[]) =>
                        prev.map((item) =>
                          item.folio === r.folio
                            ? {
                                ...item,
                                status: 'Rechazada',
                                explicacion_admin: 'No cumple condiciones de inspección; canal de aclaración abierto en soporte@loteria.mx.',
                              }
                            : item
                        )
                      );
                      logAudit('RECHAZO_DEVOLUCION', 'return_requests', `${r.folio} rechazada con explicación fundada.`);
                      notify(`Solicitud ${r.folio} rechazada con explicación fundada.`);
                    }}
                    className="rounded bg-red-600 px-3 py-1.5 font-black uppercase text-white"
                  >
                    Rechazar con Explicación
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'tickets' && (
        <div className="space-y-3 text-xs">
          {tickets.map((tk: SupportTicket) => (
            <div key={tk.folio} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
              <p className="font-bold text-red-500">{tk.folio} · {tk.tipo} · {tk.nivel_escalamiento} ({tk.status})</p>
              <p className="text-neutral-300">{tk.mensaje}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTickets((prev: SupportTicket[]) =>
                      prev.map((item) =>
                        item.folio === tk.folio
                          ? { ...item, status: 'Escalado', nivel_escalamiento: 'Nivel 3 · Gerencia y Conciliación' }
                          : item
                      )
                    );
                    logAudit('ESCALAMIENTO_TICKET', 'support_tickets', `${tk.folio} escalado a Nivel 3`);
                    notify(`Ticket ${tk.folio} escalado a Gerencia.`);
                  }}
                  className="rounded border border-neutral-700 px-3 py-1.5 font-bold uppercase"
                >
                  Escalar Nivel 3
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTickets((prev: SupportTicket[]) =>
                      prev.map((item) =>
                        item.folio === tk.folio
                          ? { ...item, status: 'Resuelto', resolucion: 'Atendido y resuelto conforme a políticas LOTE RIA / LFPC.' }
                          : item
                      )
                    );
                    logAudit('RESOLUCION_TICKET', 'support_tickets', `${tk.folio} marcado como Resuelto`);
                    notify(`Ticket ${tk.folio} resuelto.`);
                  }}
                  className="rounded bg-white px-3 py-1.5 font-black uppercase text-black"
                >
                  Marcar Resuelto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'auditoria' && (
        <div className="space-y-2 text-xs">
          {auditLogs.map((a: AuditEntry) => (
            <div key={a.id} className="rounded border border-neutral-800 bg-neutral-950 p-3 font-mono">
              <span className="text-neutral-500">[{a.timestamp}]</span>{' '}
              <span className="text-red-500 font-bold">{a.accion}</span> por{' '}
              <span className="text-white">{a.actor}</span> — {a.detalle}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
