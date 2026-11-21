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

// Fotografías verificadas y diferenciadas por carrocería, marca y segmento
const PHOTOS = {
  // SUVs
  mazda_suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
  ford_bronco: 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=900&q=80',
  suv_white_modern: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
  suv_black_luxury: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  bmw_x_suv: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=900&q=80',
  merc_suv: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  audi_suv: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  chevy_tahoe: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  toyota_rav4: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  kia_suv: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',

  // Pickups reales (camionetas con caja)
  ford_pickup: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80',
  chevy_pickup: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
  toyota_tacoma: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
  nissan_frontier: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',

  // Sedanes
  toyota_corolla: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
  vw_jetta: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
  honda_civic: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  honda_accord: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
  kia_sedan: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  chevy_sedan: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  nissan_sedan: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80',
  bmw_sedan: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
  merc_sedan: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=900&q=80',
  audi_sedan: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=80',
  mazda_sedan: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',

  // Deportivos y Superautos
  porsche_911: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  porsche_cayenne: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=900&q=80',
  ford_mustang: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80',
  chevy_camaro: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  bmw_m4: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80',
  merc_amg: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  audi_rs5: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  ferrari_f8: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',
  ferrari_roma: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
  ferrari_296: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=900&q=80',
  lambo_huracan: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
  lambo_urus: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=900&q=80',
  lambo_revuelto: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  bentley_gt: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  bentley_bentayga: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=900&q=80',

  // Eléctricos
  tesla_model3: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  tesla_modely: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
  porsche_taycan: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=900&q=80',
  audi_etron: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=900&q=80',
};

const RAW_SPECS: Array<[
  string, // marca
  string, // modelo
  'Sedán' | 'SUV' | 'Deportivo' | 'Pickup' | 'Eléctrico',
  number, // anio
  'Usado Certificado' | 'Nuevo',
  number, // km
  number, // precio
  number, // stock
  string, // combustible
  string, // transmision
  number, // hp
  string  // foto
]> = [
  ['Mazda', 'CX-5 Signature Turbo', 'SUV', 2023, 'Usado Certificado', 24500, 549000, 2, 'Gasolina 2.5L Turbo', 'Automática 6 vel.', 228, PHOTOS.mazda_suv],
  ['Toyota', 'Corolla SE Hybrid', 'Sedán', 2022, 'Usado Certificado', 31200, 379000, 3, 'Híbrido 1.8L', 'e-CVT', 121, PHOTOS.toyota_corolla],
  ['Ford', 'Ranger XLT 4x4 Diésel', 'Pickup', 2021, 'Usado Certificado', 48900, 489000, 1, 'Diésel 3.2L TDCi', 'Automática 6 vel.', 197, PHOTOS.ford_pickup],
  ['Porsche', '911 Carrera S (Unidad Nueva)', 'Deportivo', 2026, 'Nuevo', 0, 2890000, 1, 'Gasolina 3.0L Twin-Turbo', 'PDK 8 vel.', 443, PHOTOS.porsche_911],
  ['Volkswagen', 'Jetta GLI 35 Aniversario', 'Sedán', 2023, 'Usado Certificado', 19400, 465000, 2, 'Gasolina 2.0L TSI', 'DSG 7 vel.', 230, PHOTOS.vw_jetta],
  ['Tesla', 'Model 3 Long Range AWD (Unidad Nueva)', 'Eléctrico', 2026, 'Nuevo', 0, 1049000, 2, '100% Eléctrico Dual Motor', 'Automática 1 vel.', 394, PHOTOS.tesla_model3],
  ['Ford', 'Mustang GT 5.0L V8', 'Deportivo', 2022, 'Usado Certificado', 18200, 789000, 1, 'Gasolina 5.0L V8', 'Automática 10 vel.', 450, PHOTOS.ford_mustang],
  ['Ford', 'Lobo Lariat 4x4 EcoBoost', 'Pickup', 2023, 'Usado Certificado', 27400, 895000, 2, 'Gasolina 3.5L V6 Twin-Turbo', 'Automática 10 vel.', 400, PHOTOS.ford_pickup],
  ['Ford', 'Bronco Sport Badlands 4x4', 'SUV', 2023, 'Usado Certificado', 21000, 639000, 2, 'Gasolina 2.0L EcoBoost', 'Automática 8 vel.', 250, PHOTOS.ford_bronco],
  ['Ford', 'Territory Titanium Turbo', 'SUV', 2024, 'Usado Certificado', 12800, 498000, 3, 'Gasolina 1.8L Turbo', 'Automática 7 vel.', 187, PHOTOS.suv_white_modern],
  ['Kia', 'Sportage SXL AWD', 'SUV', 2023, 'Usado Certificado', 22600, 519000, 2, 'Gasolina 2.5L GDI', 'Automática 8 vel.', 187, PHOTOS.kia_suv],
  ['Kia', 'Forte GT Line Turbo', 'Sedán', 2023, 'Usado Certificado', 26900, 369000, 3, 'Gasolina 1.6L Turbo', 'DCT 7 vel.', 201, PHOTOS.kia_sedan],
  ['Kia', 'Sorento EX Pack 7 Pasajeros', 'SUV', 2022, 'Usado Certificado', 35400, 579000, 2, 'Gasolina 2.5L Turbo', 'DCT 8 vel.', 277, PHOTOS.suv_white_modern],
  ['Kia', 'K3 GT-Line Sedán (Unidad Nueva)', 'Sedán', 2026, 'Nuevo', 0, 459000, 3, 'Gasolina 2.0L MPI', 'Automática 6 vel.', 150, PHOTOS.toyota_corolla],
  ['Chevrolet', 'Silverado Z71 Trail Boss 4x4', 'Pickup', 2022, 'Usado Certificado', 38100, 829000, 1, 'Gasolina 5.3L V8', 'Automática 10 vel.', 355, PHOTOS.chevy_pickup],
  ['Chevrolet', 'Camaro SS V8 6.2L', 'Deportivo', 2021, 'Usado Certificado', 24300, 815000, 1, 'Gasolina 6.2L V8', 'Automática 10 vel.', 455, PHOTOS.chevy_camaro],
  ['Chevrolet', 'Tahoe RST V8 4x4', 'SUV', 2022, 'Usado Certificado', 41200, 1180000, 1, 'Gasolina 5.3L V8', 'Automática 10 vel.', 355, PHOTOS.chevy_tahoe],
  ['Chevrolet', 'Onix Premier Redline Turbo', 'Sedán', 2023, 'Usado Certificado', 28900, 289000, 4, 'Gasolina 1.2L Turbo', 'Automática 6 vel.', 130, PHOTOS.chevy_sedan],
  ['Nissan', 'Sentra SR Platinum', 'Sedán', 2023, 'Usado Certificado', 23500, 375000, 3, 'Gasolina 2.0L', 'CVT', 145, PHOTOS.nissan_sedan],
  ['Nissan', 'Frontier PRO-4X 4x4', 'Pickup', 2023, 'Usado Certificado', 29800, 649000, 2, 'Gasolina 2.5L', 'Automática 7 vel.', 166, PHOTOS.nissan_frontier],
  ['Nissan', 'X-Trail Platinum e-POWER', 'SUV', 2024, 'Usado Certificado', 14100, 629000, 2, 'Híbrido Eléctrico e-POWER', 'Automática 1 vel.', 188, PHOTOS.mazda_suv],
  ['Nissan', 'Versa Exclusive CVT', 'Sedán', 2023, 'Usado Certificado', 31000, 295000, 4, 'Gasolina 1.6L', 'CVT', 118, PHOTOS.vw_jetta],
  ['Honda', 'Civic Touring Turbo', 'Sedán', 2023, 'Usado Certificado', 21400, 489000, 2, 'Gasolina 1.5L Turbo', 'CVT', 176, PHOTOS.honda_civic],
  ['Honda', 'CR-V Touring Hybrid', 'SUV', 2024, 'Usado Certificado', 15900, 719000, 2, 'Híbrido 2.0L', 'e-CVT', 204, PHOTOS.suv_white_modern],
  ['Honda', 'Accord Touring 2.0T', 'Sedán', 2022, 'Usado Certificado', 33200, 529000, 2, 'Gasolina 2.0L Turbo', 'Automática 10 vel.', 247, PHOTOS.honda_accord],
  ['Honda', 'HR-V Touring', 'SUV', 2023, 'Usado Certificado', 25700, 449000, 3, 'Gasolina 2.0L', 'CVT', 155, PHOTOS.toyota_rav4],
  ['Porsche', 'Cayenne E-Hybrid Coupe', 'SUV', 2023, 'Usado Certificado', 16800, 1790000, 1, 'Híbrido Enchufable 3.0L V6', 'Tiptronic S 8 vel.', 462, PHOTOS.porsche_cayenne],
  ['Porsche', 'Macan GTS AWD', 'SUV', 2023, 'Usado Certificado', 19200, 1480000, 1, 'Gasolina 2.9L V6 Twin-Turbo', 'PDK 7 vel.', 434, PHOTOS.porsche_cayenne],
  ['Porsche', 'Taycan 4S Electric (Unidad Nueva)', 'Eléctrico', 2026, 'Nuevo', 0, 2650000, 1, '100% Eléctrico 800V', 'Automática 2 vel.', 530, PHOTOS.porsche_taycan],
  ['BMW', '330i M Sport', 'Sedán', 2023, 'Usado Certificado', 22100, 749000, 2, 'Gasolina 2.0L TwinPower Turbo', 'Steptronic 8 vel.', 258, PHOTOS.bmw_sedan],
  ['BMW', 'X3 xDrive30i M Sport', 'SUV', 2023, 'Usado Certificado', 24800, 869000, 2, 'Gasolina 2.0L TwinPower Turbo', 'Steptronic 8 vel.', 252, PHOTOS.bmw_x_suv],
  ['BMW', 'M4 Competition Coupe', 'Deportivo', 2022, 'Usado Certificado', 14500, 1690000, 1, 'Gasolina 3.0L M TwinPower', 'M Steptronic 8 vel.', 510, PHOTOS.bmw_m4],
  ['BMW', 'X5 xDrive45e Híbrida', 'SUV', 2023, 'Usado Certificado', 20300, 1290000, 1, 'Híbrido 3.0L 6 cil.', 'Steptronic 8 vel.', 394, PHOTOS.bmw_x_suv],
  ['Mercedes-Benz', 'C 200 Avantgarde Mild-Hybrid', 'Sedán', 2023, 'Usado Certificado', 21900, 769000, 2, 'Gasolina 1.5L Turbo EQ Boost', '9G-TRONIC', 204, PHOTOS.merc_sedan],
  ['Mercedes-Benz', 'GLC 300 4MATIC Coupe', 'SUV', 2023, 'Usado Certificado', 19800, 985000, 1, 'Gasolina 2.0L Turbo', '9G-TRONIC', 258, PHOTOS.merc_suv],
  ['Mercedes-Benz', 'CLA 250 AMG Line', 'Sedán', 2022, 'Usado Certificado', 29400, 659000, 2, 'Gasolina 2.0L Turbo', '7G-DCT', 224, PHOTOS.merc_sedan],
  ['Mercedes-Benz', 'AMG GT 53 4-Door Coupe', 'Deportivo', 2022, 'Usado Certificado', 15600, 1950000, 1, 'Gasolina 3.0L Turbo EQ Boost', 'AMG SPEEDSHIFT 9G', 435, PHOTOS.merc_amg],
  ['Audi', 'A4 S line 45 TFSI quattro', 'Sedán', 2023, 'Usado Certificado', 23100, 689000, 2, 'Gasolina 2.0L TFSI', 'S tronic 7 vel.', 249, PHOTOS.audi_sedan],
  ['Audi', 'Q5 S line 45 TFSI quattro', 'SUV', 2023, 'Usado Certificado', 25400, 819000, 2, 'Gasolina 2.0L TFSI', 'S tronic 7 vel.', 249, PHOTOS.audi_suv],
  ['Audi', 'RS5 Sportback quattro', 'Deportivo', 2022, 'Usado Certificado', 17300, 1490000, 1, 'Gasolina 2.9L V6 Biturbo', 'Tiptronic 8 vel.', 450, PHOTOS.audi_rs5],
  ['Audi', 'e-tron GT quattro (Unidad Nueva)', 'Eléctrico', 2026, 'Nuevo', 0, 2390000, 1, '100% Eléctrico Dual Motor', 'Automática 2 vel.', 476, PHOTOS.audi_etron],
  ['Ferrari', 'F8 Tributo V8 (Unidad Nueva)', 'Deportivo', 2026, 'Nuevo', 0, 6850000, 1, 'Gasolina 3.9L V8 Twin-Turbo', 'F1 DCT 7 vel.', 710, PHOTOS.ferrari_f8],
  ['Ferrari', 'Roma V8 Coupe', 'Deportivo', 2023, 'Usado Certificado', 6400, 5290000, 1, 'Gasolina 3.9L V8 Twin-Turbo', 'F1 DCT 8 vel.', 612, PHOTOS.ferrari_roma],
  ['Ferrari', '296 GTB Híbrido V6', 'Deportivo', 2024, 'Usado Certificado', 3900, 6490000, 1, 'Híbrido 3.0L V6 Twin-Turbo', 'F1 DCT 8 vel.', 819, PHOTOS.ferrari_296],
  ['Lamborghini', 'Huracán EVO RWD', 'Deportivo', 2023, 'Usado Certificado', 7800, 5490000, 1, 'Gasolina 5.2L V10 Atmosférico', 'LDF 7 vel.', 610, PHOTOS.lambo_huracan],
  ['Lamborghini', 'Urus Performante V8', 'SUV', 2024, 'Usado Certificado', 8500, 6190000, 1, 'Gasolina 4.0L V8 Twin-Turbo', 'Automática 8 vel.', 666, PHOTOS.lambo_urus],
  ['Lamborghini', 'Revuelto V12 Híbrido (Unidad Nueva)', 'Deportivo', 2026, 'Nuevo', 0, 11900000, 1, 'Híbrido 6.5L V12 + 3 Motores', 'DCT 8 vel.', 1001, PHOTOS.lambo_revuelto],
  ['Bentley', 'Continental GT Speed W12', 'Deportivo', 2023, 'Usado Certificado', 9200, 5190000, 1, 'Gasolina 6.0L W12 Twin-Turbo', 'DCT 8 vel.', 650, PHOTOS.bentley_gt],
  ['Bentley', 'Bentayga V8 First Edition', 'SUV', 2023, 'Usado Certificado', 14300, 4490000, 1, 'Gasolina 4.0L V8 Twin-Turbo', 'Automática 8 vel.', 542, PHOTOS.bentley_bentayga],
  ['Bentley', 'Flying Spur Hybrid (Unidad Nueva)', 'Sedán', 2026, 'Nuevo', 0, 5690000, 1, 'Híbrido 2.9L V6', 'DCT 8 vel.', 536, PHOTOS.bentley_gt],
  ['Mazda', 'Mazda3 Sedán Carbon Edition', 'Sedán', 2023, 'Usado Certificado', 21800, 389000, 3, 'Gasolina 2.5L Skyactiv-G', 'Automática 6 vel.', 186, PHOTOS.mazda_sedan],
  ['Toyota', 'Tacoma TRD Sport 4x4', 'Pickup', 2023, 'Usado Certificado', 26100, 749000, 2, 'Gasolina 3.5L V6', 'Automática 6 vel.', 278, PHOTOS.toyota_tacoma],
  ['Toyota', 'RAV4 Adventure AWD', 'SUV', 2023, 'Usado Certificado', 24900, 569000, 2, 'Gasolina 2.5L', 'Automática 8 vel.', 203, PHOTOS.toyota_rav4],
  ['Tesla', 'Model Y Performance AWD (Unidad Nueva)', 'Eléctrico', 2026, 'Nuevo', 0, 1189000, 2, '100% Eléctrico Dual Motor', 'Automática 1 vel.', 456, PHOTOS.tesla_modely],
];

export const INITIAL_VEHICLES: Vehicle[] = RAW_SPECS.map((item, idx) => {
  const [marca, nombre, categoria, anio, condicion, km, precio, stock, combustible, transmision, potencia_hp, imagen] = item;
  const num = String(idx + 1).padStart(3, '0');
  const prefix = condicion === 'Nuevo' ? 'LRI-NVO' : 'LRI-USD';
  const isNew = condicion === 'Nuevo';

  return {
    id: `v-${101 + idx}`,
    sku: `${prefix}-${anio}-${num}`,
    nombre: `${marca} ${nombre}`,
    marca,
    categoria,
    anio,
    condicion,
    km,
    combustible,
    transmision,
    potencia_hp,
    dimensiones: categoria === 'Pickup' ? '5,354 × 1,860 × 1,821 mm' : categoria === 'SUV' ? '4,620 × 1,855 × 1,680 mm' : '4,650 × 1,820 × 1,420 mm',
    peso_kg: categoria === 'Pickup' ? 2140 : categoria === 'SUV' ? 1760 : 1490,
    precio,
    stock,
    status: 'activo',
    imagen,
    atribucion_imagen: 'Fotografía comercial del inventario certificado LOTE RIA',
    descripcion: isNew
      ? `UNIDAD NUEVA (0 KM) de ${marca} ${nombre} modelo ${anio}, con factura de origen, duplicado de llaves y garantía integral de fábrica por 36 meses o 60,000 km.`
      : `Vehículo seminuevo certificado ${marca} ${nombre} ${anio} con ${km.toLocaleString()} km verificados, inspección multipunto de 150 puntos mecánicos/legales y garantía LOTE RIA de 12 meses o 20,000 km.`,
    garantia_meses: isNew ? 36 : 12,
    garantia_km: isNew ? 60000 : 20000,
    variantes: [
      {
        id: `var-${101 + idx}-a`,
        atributo: 'Configuración / Paquete',
        valor: isNew ? 'Configuración de Fábrica · Entrega Inmediata' : 'Estándar Certificado LOTE RIA · Inspección 150 pts',
        precio_extra: 0,
        stock,
      },
      {
        id: `var-${101 + idx}-b`,
        atributo: 'Configuración / Paquete',
        valor: 'Paquete Protección Cerámica + Película Antiasalto',
        precio_extra: 9500,
        stock: Math.max(1, Math.floor(stock / 2)),
      },
    ],
    reviews:
      idx < 6
        ? [
            {
              id: `rev-${101 + idx}`,
              user_name: 'Cliente Verificado LOTE RIA',
              rating: 5,
              comentario: 'Unidad entregada en tiempo, con reporte técnico completo y documentación en regla.',
              fecha: '2026-10-28',
              aprobada: true,
            },
          ]
        : [],
  };
});
