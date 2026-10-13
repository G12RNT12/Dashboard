/**
 * "Base de datos" simulada.
 *
 * Todo se deriva de UNA serie diaria determinista: cada día se genera con
 * `faker.seed(SEED + númeroDeDía)`, así que una fecha concreta siempre tiene
 * los mismos valores, aunque recargues la página o cambies de rango.
 *
 * A partir de esa serie se calculan KPIs, gráficos, categorías, canales,
 * países y productos, de modo que los totales cuadran entre sí.
 *
 * Este archivo desaparece por completo cuando se conecte una API real.
 */
import { Faker, base, es } from '@faker-js/faker';
import { formatBucketLabel } from '@/lib/format';
import type {
  CategorySales,
  Channel,
  ChannelShare,
  CountryCount,
  Customer,
  CustomerStatus,
  Kpi,
  Product,
  ProductCategory,
  Range,
  RevenuePoint,
  StockStatus,
  Transaction,
  TransactionStatus,
  UserGrowthPoint,
  UsersResponse,
} from '@/types';

const SEED = 20_241;
const DAY_MS = 86_400_000;
/** Días de historial que se generan (cubre 12 meses + los 12 anteriores). */
const HISTORY_DAYS = 800;

const faker = new Faker({ locale: [es, base] });

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

export const CATEGORIES: readonly ProductCategory[] = [
  'Electrónica',
  'Moda',
  'Hogar',
  'Deportes',
  'Belleza',
  'Libros',
];
const CATEGORY_WEIGHTS = [0.31, 0.21, 0.17, 0.14, 0.1, 0.07];

export const CHANNELS: readonly Channel[] = [
  'Búsqueda orgánica',
  'Anuncios',
  'Redes sociales',
  'Email',
  'Referidos',
];
const CHANNEL_WEIGHTS = [0.34, 0.26, 0.19, 0.13, 0.08];

const COUNTRIES = [
  'España',
  'México',
  'Colombia',
  'Argentina',
  'Chile',
  'Perú',
  'Estados Unidos',
] as const;
const COUNTRY_WEIGHTS = [0.27, 0.24, 0.15, 0.12, 0.09, 0.07, 0.06];

const PRODUCT_NAMES: Record<ProductCategory, string[]> = {
  Electrónica: [
    'Auriculares inalámbricos Pulse',
    'Altavoz portátil Wave',
    'Smartwatch Orbit 2',
    'Teclado mecánico K8',
    'Ratón ergonómico Flow',
    'Cargador rápido 65 W',
    'Webcam 4K Vista',
    'Tablet Nébula 11',
  ],
  Moda: [
    'Chaqueta cortavientos',
    'Zapatillas urbanas Nube',
    'Mochila impermeable 22 L',
    'Camiseta de lino',
    'Vaqueros rectos',
    'Gafas de sol polarizadas',
    'Sudadera oversize',
    'Gorra de algodón',
  ],
  Hogar: [
    'Cafetera de goteo',
    'Lámpara de escritorio LED',
    'Juego de sartenes',
    'Manta de punto',
    'Purificador de aire',
    'Set de vasos de vidrio',
    'Robot aspirador S3',
    'Difusor de aromas',
  ],
  Deportes: [
    'Esterilla de yoga',
    'Mancuernas ajustables',
    'Botella térmica 750 ml',
    'Bandas elásticas',
    'Comba de velocidad',
    'Rodillo de espuma',
    'Pulsera de actividad',
    'Bolsa de deporte',
  ],
  Belleza: [
    'Sérum de vitamina C',
    'Crema hidratante facial',
    'Secador iónico',
    'Kit de brochas',
    'Protector solar SPF 50',
    'Aceite capilar',
    'Perfume Ámbar 50 ml',
    'Plancha de pelo',
  ],
  Libros: [
    'Hábitos atómicos',
    'Cien años de soledad',
    'El infinito en un junco',
    'Sapiens',
    'Cocina de temporada',
    'Diseño de interfaces',
    'Guía de senderismo',
    'Novela gráfica: Arrugas',
  ],
};

/** Factor de precio medio por categoría (Electrónica más cara, Libros más barata). */
const CATEGORY_PRICE: Record<ProductCategory, [number, number]> = {
  Electrónica: [39, 449],
  Moda: [15, 129],
  Hogar: [19, 289],
  Deportes: [9, 159],
  Belleza: [12, 89],
  Libros: [9, 35],
};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round(n * 100) / 100;
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const pct = (current: number, previous: number) =>
  previous === 0 ? 0 : ((current - previous) / previous) * 100;

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

/** Número de día estable para una fecha local (no depende de la zona horaria del día). */
function dayNumber(d: Date) {
  return Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2020, 0, 1)) / DAY_MS,
  );
}

/** Reparte `values` (que suman ~total) con ruido y normaliza para que sumen exactamente 1. */
function noisyWeights(weights: number[], spread = 0.18) {
  const raw = weights.map((w) => w * faker.number.float({ min: 1 - spread, max: 1 + spread }));
  const total = sum(raw);
  return raw.map((w) => w / total);
}

/** Reparto entero que suma exactamente `total` (método del mayor resto). */
function splitInteger(total: number, weights: number[]) {
  const exact = weights.map((w) => w * total);
  const floors = exact.map(Math.floor);
  let remainder = total - sum(floors);
  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (remainder <= 0) break;
    floors[i]! += 1;
    remainder -= 1;
  }
  return floors;
}

function pickWeighted<T>(items: readonly T[], weights: number[]): T {
  let r = faker.number.float({ min: 0, max: 1 });
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

// ---------------------------------------------------------------------------
// Serie diaria
// ---------------------------------------------------------------------------

interface Day {
  date: Date;
  revenue: number;
  orders: number;
  visitors: number;
  newCustomers: number;
  activeCustomers: number;
  /** Ingresos del día repartidos por categoría (mismo orden que CATEGORIES). */
  byCategory: number[];
  /** Ingresos del día repartidos por canal (mismo orden que CHANNELS). */
  byChannel: number[];
  /** Clientes nuevos del día por país (mismo orden que COUNTRIES). */
  byCountry: number[];
}

const WEEKDAY_FACTOR = [0.86, 0.95, 0.99, 1.01, 1.05, 1.14, 1.08]; // dom → sáb

function generateDay(date: Date): Day {
  const n = dayNumber(date);
  faker.seed(SEED + n);

  const trend = 7_200 + n * 3.1; // crecimiento suave del negocio
  const month = date.getMonth();
  const seasonal =
    1 +
    0.08 * Math.sin(((month - 2) / 12) * Math.PI * 2) +
    (month === 10 && date.getDate() >= 20 ? 0.35 : 0) + // Black Friday
    (month === 11 && date.getDate() <= 24 ? 0.25 : 0); // Navidad
  const noise = faker.number.float({ min: 0.88, max: 1.12 });

  const targetRevenue = trend * WEEKDAY_FACTOR[date.getDay()]! * seasonal * noise;
  const aov = faker.number.float({ min: 66, max: 84 });
  const orders = Math.max(1, Math.round(targetRevenue / aov));
  const revenue = round2(orders * aov);
  const conversion = faker.number.float({ min: 0.024, max: 0.034 });
  const visitors = Math.round(orders / conversion);
  const newCustomers = Math.round(orders * faker.number.float({ min: 0.27, max: 0.37 }));
  const activeCustomers = Math.round(orders * faker.number.float({ min: 0.78, max: 0.86 }));

  return {
    date,
    revenue,
    orders,
    visitors,
    newCustomers,
    activeCustomers,
    byCategory: noisyWeights(CATEGORY_WEIGHTS).map((w) => revenue * w),
    byChannel: noisyWeights(CHANNEL_WEIGHTS).map((w) => revenue * w),
    byCountry: splitInteger(newCustomers, noisyWeights(COUNTRY_WEIGHTS, 0.25)),
  };
}

let daysCache: { anchor: number; days: Day[] } | null = null;

/** Devuelve el historial diario, del más antiguo (índice 0) a hoy (último). */
function getDays(): Day[] {
  const today = startOfDay(new Date());
  if (daysCache?.anchor === today.getTime()) return daysCache.days;

  const days: Day[] = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(generateDay(d));
  }
  daysCache = { anchor: today.getTime(), days };
  return days;
}

// ---------------------------------------------------------------------------
// Ventanas de tiempo
// ---------------------------------------------------------------------------

interface Bucket {
  start: Date;
  days: Day[];
}

interface Window {
  current: Bucket[];
  previous: Bucket[];
}

/**
 * 7d / 30d → un bucket por día (los últimos N días, incluido hoy).
 * 12m → un bucket por mes natural completo (los 12 meses anteriores al actual).
 * `previous` es el periodo inmediatamente anterior con la misma duración.
 */
function getWindow(range: Range): Window {
  const days = getDays();

  if (range === '7d' || range === '30d') {
    const size = range === '7d' ? 7 : 30;
    const toBuckets = (slice: Day[]) => slice.map((d) => ({ start: d.date, days: [d] }));
    return {
      current: toBuckets(days.slice(-size)),
      previous: toBuckets(days.slice(-size * 2, -size)),
    };
  }

  const byMonth = new Map<string, Bucket>();
  for (const d of days) {
    const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
    let b = byMonth.get(key);
    if (!b) {
      b = { start: new Date(d.date.getFullYear(), d.date.getMonth(), 1), days: [] };
      byMonth.set(key, b);
    }
    b.days.push(d);
  }
  // Se descarta el mes en curso (incompleto) y el primero (puede estar cortado).
  const months = [...byMonth.values()].slice(1, -1);
  return { current: months.slice(-12), previous: months.slice(-24, -12) };
}

const bucketSum = (
  b: Bucket,
  key: 'revenue' | 'orders' | 'visitors' | 'newCustomers' | 'activeCustomers',
) => sum(b.days.map((d) => d[key]));
const windowSum = (buckets: Bucket[], key: Parameters<typeof bucketSum>[1]) =>
  sum(buckets.map((b) => bucketSum(b, key)));
const windowDays = (buckets: Bucket[]) => buckets.flatMap((b) => b.days);

// ---------------------------------------------------------------------------
// Builders (uno por endpoint)
// ---------------------------------------------------------------------------

export function buildKpis(range: Range): Kpi[] {
  const { current, previous } = getWindow(range);

  const revenue = windowSum(current, 'revenue');
  const prevRevenue = windowSum(previous, 'revenue');
  const orders = windowSum(current, 'orders');
  const prevOrders = windowSum(previous, 'orders');
  const newCustomers = windowSum(current, 'newCustomers');
  const prevNewCustomers = windowSum(previous, 'newCustomers');
  const conversion = (orders / windowSum(current, 'visitors')) * 100;
  const prevConversion = (prevOrders / windowSum(previous, 'visitors')) * 100;

  return [
    {
      id: 'revenue',
      label: 'Ingresos',
      value: round2(revenue),
      previousValue: round2(prevRevenue),
      changePct: pct(revenue, prevRevenue),
      format: 'currency',
      sparkline: current.map((b) => round2(bucketSum(b, 'revenue'))),
    },
    {
      id: 'orders',
      label: 'Pedidos',
      value: orders,
      previousValue: prevOrders,
      changePct: pct(orders, prevOrders),
      format: 'number',
      sparkline: current.map((b) => bucketSum(b, 'orders')),
    },
    {
      id: 'newCustomers',
      label: 'Clientes nuevos',
      value: newCustomers,
      previousValue: prevNewCustomers,
      changePct: pct(newCustomers, prevNewCustomers),
      format: 'number',
      sparkline: current.map((b) => bucketSum(b, 'newCustomers')),
    },
    {
      id: 'conversion',
      label: 'Tasa de conversión',
      value: round2(conversion),
      previousValue: round2(prevConversion),
      changePct: pct(conversion, prevConversion),
      format: 'percent',
      sparkline: current.map((b) =>
        round2((bucketSum(b, 'orders') / bucketSum(b, 'visitors')) * 100),
      ),
    },
  ];
}

export function buildRevenue(range: Range): RevenuePoint[] {
  const { current, previous } = getWindow(range);
  return current.map((b, i) => {
    const revenue = bucketSum(b, 'revenue');
    const orders = bucketSum(b, 'orders');
    const prev = previous[i];
    return {
      date: b.start.toISOString(),
      label: formatBucketLabel(b.start, range),
      revenue: round2(revenue),
      orders,
      previousRevenue: prev ? round2(bucketSum(prev, 'revenue')) : 0,
      avgOrderValue: round2(revenue / orders),
    };
  });
}

export function buildSalesByCategory(range: Range): CategorySales[] {
  const days = windowDays(getWindow(range).current);
  const total = sum(days.map((d) => d.revenue));
  const totalOrders = sum(days.map((d) => d.orders));
  const revenues = CATEGORIES.map((_, i) => sum(days.map((d) => d.byCategory[i]!)));

  // Pedidos por categoría: proporcionales a ingresos / precio medio relativo.
  const priceFactor = CATEGORIES.map((c) => sum(CATEGORY_PRICE[c]) / 2);
  const orderWeights = revenues.map((r, i) => r / priceFactor[i]!);
  const orderTotal = sum(orderWeights);
  const orders = splitInteger(
    totalOrders,
    orderWeights.map((w) => w / orderTotal),
  );

  return CATEGORIES.map((category, i) => ({
    category,
    revenue: round2(revenues[i]!),
    orders: orders[i]!,
    share: (revenues[i]! / total) * 100,
  })).sort((a, b) => b.revenue - a.revenue);
}

export function buildChannels(range: Range): ChannelShare[] {
  const days = windowDays(getWindow(range).current);
  const total = sum(days.map((d) => d.revenue));
  return CHANNELS.map((channel, i) => {
    const revenue = sum(days.map((d) => d.byChannel[i]!));
    return { channel, revenue: round2(revenue), share: (revenue / total) * 100 };
  });
}

// ---------------------------------------------------------------------------
// Clientes, transacciones y productos
// ---------------------------------------------------------------------------

let customersCache: Customer[] | null = null;

function getCustomers(): Customer[] {
  if (customersCache) return customersCache;
  faker.seed(SEED + 1);
  const today = startOfDay(new Date());
  customersCache = Array.from({ length: 420 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const daysAgo = faker.number.int({ min: 0, max: 720 });
    const signup = new Date(today.getTime() - daysAgo * DAY_MS);
    const orders =
      daysAgo < 20 ? faker.number.int({ min: 1, max: 3 }) : faker.number.int({ min: 1, max: 28 });
    const lastOrderDaysAgo = faker.number.int({ min: 0, max: Math.min(daysAgo, 200) });
    const status: CustomerStatus =
      daysAgo <= 30 ? 'new' : lastOrderDaysAgo > 90 ? 'inactive' : 'active';
    return {
      id: `CUS-${String(1000 + i)}`,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      country: pickWeighted(COUNTRIES, COUNTRY_WEIGHTS),
      signupDate: signup.toISOString(),
      orders,
      totalSpent: round2(orders * faker.number.float({ min: 48, max: 110 })),
      status,
    };
  });
  return customersCache;
}

const txCache = new Map<number, Transaction[]>();
const STATUS_WEIGHTS: [TransactionStatus[], number[]] = [
  ['completed', 'pending', 'refunded', 'failed'],
  [0.82, 0.09, 0.05, 0.04],
];

/** Muestra de transacciones de un día (8–14), siempre las mismas para esa fecha. */
function getDayTransactions(day: Day, isToday: boolean): Transaction[] {
  const n = dayNumber(day.date);
  const cached = txCache.get(n);
  if (cached) return cached;

  const customers = getCustomers();
  faker.seed(SEED * 7 + n);
  const count = faker.number.int({ min: 8, max: 14 });
  const now = Date.now();

  const list = Array.from({ length: count }, (_, i) => {
    const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })]!;
    const category = pickWeighted(CATEGORIES, CATEGORY_WEIGHTS);
    const [min, max] = CATEGORY_PRICE[category];
    const seconds = faker.number.int({ min: 0, max: 86_399 });
    let ts = day.date.getTime() + seconds * 1000;
    if (isToday && ts > now) ts = now - faker.number.int({ min: 60, max: 3600 }) * 1000;
    const status =
      isToday && faker.datatype.boolean(0.25) ? 'pending' : pickWeighted(...STATUS_WEIGHTS);
    return {
      id: `ORD-${n}${String(i).padStart(2, '0')}`,
      customer: customer.name,
      email: customer.email,
      date: new Date(ts).toISOString(),
      amount: round2(faker.number.float({ min, max }) * faker.number.int({ min: 1, max: 2 })),
      status,
      category,
      channel: pickWeighted(CHANNELS, CHANNEL_WEIGHTS),
      product: faker.helpers.arrayElement(PRODUCT_NAMES[category]),
    } satisfies Transaction;
  });

  txCache.set(n, list);
  return list;
}

/**
 * Las transacciones son una MUESTRA de los pedidos (los más recientes del rango),
 * no el total: por eso la tabla no tiene tantas filas como pedidos tiene el KPI.
 */
export function buildTransactions(range: Range, limit = 400): Transaction[] {
  const days = windowDays(getWindow(range).current);
  const lastIndex = days.length - 1;
  const todayTime = startOfDay(new Date()).getTime();
  const result: Transaction[] = [];
  for (let i = lastIndex; i >= 0 && result.length < limit; i--) {
    const d = days[i]!;
    result.push(...getDayTransactions(d, d.date.getTime() === todayTime));
  }
  return result.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function buildUsers(range: Range): UsersResponse {
  const { current } = getWindow(range);
  const days = windowDays(current);

  const growth: UserGrowthPoint[] = current.map((b) => ({
    date: b.start.toISOString(),
    label: formatBucketLabel(b.start, range),
    newCustomers: bucketSum(b, 'newCustomers'),
    activeCustomers: bucketSum(b, 'activeCustomers'),
  }));

  // La suma por países coincide con el KPI "Clientes nuevos".
  const byCountry: CountryCount[] = COUNTRIES.map((country, i) => ({
    country,
    customers: sum(days.map((d) => d.byCountry[i]!)),
  })).sort((a, b) => b.customers - a.customers);

  const customers = [...getCustomers()].sort((a, b) => b.totalSpent - a.totalSpent);
  return { growth, byCountry, customers };
}

let catalogCache: Array<Omit<Product, 'unitsSold' | 'revenue'> & { weight: number }> | null = null;

function getCatalog() {
  if (catalogCache) return catalogCache;
  faker.seed(SEED + 2);
  catalogCache = CATEGORIES.flatMap((category) =>
    PRODUCT_NAMES[category].map((name, i) => {
      const [min, max] = CATEGORY_PRICE[category];
      const stock = faker.helpers.weightedArrayElement([
        { weight: 7, value: faker.number.int({ min: 40, max: 480 }) },
        { weight: 2, value: faker.number.int({ min: 1, max: 19 }) },
        { weight: 1, value: 0 },
      ]);
      const stockStatus: StockStatus =
        stock === 0 ? 'out_of_stock' : stock < 20 ? 'low_stock' : 'in_stock';
      return {
        id: `SKU-${category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
        name,
        category,
        price: Math.round(faker.number.float({ min, max })) - 0.01,
        stock,
        stockStatus,
        rating: round2(faker.number.float({ min: 3.4, max: 4.9 })),
        weight: faker.number.float({ min: 0.4, max: 1.8 }),
      };
    }),
  );
  return catalogCache;
}

/** Reparte los ingresos de cada categoría entre sus productos según su peso. */
export function buildProducts(range: Range): Product[] {
  const categories = buildSalesByCategory(range);
  const catalog = getCatalog();

  return catalog
    .map(({ weight, ...p }) => {
      const cat = categories.find((c) => c.category === p.category)!;
      const siblings = catalog.filter((x) => x.category === p.category);
      const share = weight / sum(siblings.map((s) => s.weight));
      const unitsSold = Math.max(0, Math.round((cat.revenue * share) / p.price));
      return { ...p, unitsSold, revenue: round2(unitsSold * p.price) };
    })
    .sort((a, b) => b.revenue - a.revenue);
}
