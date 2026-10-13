# Nébula Shop: panel de ventas

Dashboard analítico **solo de frontend** para una tienda online ficticia. Muestra KPIs, gráficos interactivos, tablas filtrables y un widget que simula datos en tiempo real.

Todos los datos se generan en el navegador mediante una capa de servicios simulada que imita una API REST. Está preparada para sustituirse por un backend real **sin tocar los componentes**.

## Stack

| Para qué | Herramienta |
| --- | --- |
| UI | React 18 + TypeScript (estricto) + Vite |
| Estilos | Tailwind CSS 3 (tema en `tailwind.config.ts` + `src/theme/palette.ts`) |
| Gráficos | Recharts |
| Animaciones | Framer Motion |
| Navegación | React Router 6 |
| Datos, caché y estados de carga | TanStack Query 5 |
| Datos de ejemplo | @faker-js/faker (semilla fija) |
| Iconos | lucide-react |
| Calidad | ESLint 9 + Prettier |

## Instalación

Requisitos: **Node.js 18 o superior** (probado con Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
```

Otros scripts:

```bash
npm run build      # comprobación de tipos + build de producción en /dist
npm run preview    # sirve el build
npm run lint       # ESLint
npm run format     # Prettier
```

### Variables de entorno (opcionales)

Copia `.env.example` a `.env`:

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | URL base de la API real (cuando exista). |
| `VITE_MOCK_ERROR_RATE` | Probabilidad (0–1) de que una petición simulada falle. Pon `0.3` para ver los estados de error y el botón "Reintentar". |

## Funcionalidades

- **Layout:** sidebar colapsable con animación de ancho (el estado se recuerda), menú deslizable en móvil y header con buscador global, selector de rango (7 días, 30 días, 12 meses), modo claro/oscuro y avatar.
- **Resumen:** 4 KPIs con contador animado, variación frente al periodo anterior y sparkline. Además:
  - gráfico de área de ingresos
  - barras por categoría
  - dona por canal
  - comparación de periodos
  - tabla de últimas transacciones (ordenable y paginada)
  - widget **en vivo** que se actualiza cada 3 s
- **Ventas, Usuarios y Productos:** 2–4 gráficos y una tabla con filtros por página. El buscador del header filtra las tablas sin distinguir mayúsculas ni tildes.
- **Configuración:** tema (claro, oscuro o el del sistema), moneda (USD, EUR, MXN o COP) y nivel de animaciones. Todo se guarda en `localStorage`.
- **Estados de carga, error y sin datos** en cada gráfico y tabla. La carga se muestra con skeletons con shimmer.
- **Accesibilidad:**
  - cada gráfico puede verse como tabla (botón de tabla en la tarjeta)
  - navegación completa con teclado y foco visible
  - enlace "Saltar al contenido" y etiquetas ARIA
  - colores de serie validados para daltonismo; los estados llevan siempre icono y texto
- **Animaciones:**
  - entrada escalonada de las tarjetas y transiciones entre páginas
  - gráficos que se dibujan en unos 1200 ms
  - tooltips animados y hover con elevación
  - transición de colores al cambiar de tema
  - pulso al llegar cada dato en vivo
  - se respeta `prefers-reduced-motion`, y además se pueden reducir desde Configuración

## Estructura del proyecto

```
src/
├── App.tsx                 # Proveedores (Query, ajustes, filtros, motion) y rutas
├── main.tsx
├── index.css               # Variables de color claro/oscuro y estilos base
├── theme/palette.ts        # ⭐ Colores de marca y de gráficos (fuente única)
├── types/                  # Tipos de cada respuesta de la "API"
├── services/
│   ├── dashboardService.ts # getKpis, getRevenue, getSalesByCategory, getChannels,
│   │                       # getTransactions, getUsers, getProducts
│   ├── client.ts           # simulateRequest (retraso 400–900 ms) y apiGet (fetch real)
│   └── mock/generator.ts   # Generador determinista de datos (se borra con una API real)
├── hooks/                  # useKpis/useRevenue… (React Query), useLiveMetrics, useTheme,
│                           # useReducedMotion, useFormat, useMediaQuery…
├── context/                # Ajustes (tema, moneda, animaciones) y filtros (rango, búsqueda)
├── components/             # UI reutilizable: Card, KpiCard, ChartCard, DataTable, Skeleton,
│                           # ChartTooltip, AnimatedNumber, Sparkline, StatusBadge…
├── features/               # Gráficos y tablas por sección: overview, sales, users, products
├── layouts/                # MainLayout, Sidebar, MobileSidebar, Header, navegación
├── pages/                  # Una página por ruta
└── lib/                    # Formato de moneda/fechas, variantes de animación, utilidades
```

## Cómo funcionan los datos simulados

`src/services/mock/generator.ts` crea una **serie diaria** de unos 800 días. Cada día se genera con `faker.seed(SEMILLA + númeroDeDía)`, así que una fecha concreta tiene siempre los mismos valores, aunque recargues la página.

Todo lo demás se **deriva de esa serie**, de modo que los números cuadran entre sí:

- El KPI de ingresos es la suma del gráfico de ingresos, y también de las categorías y de los canales.
- El KPI de pedidos coincide con la suma de pedidos del gráfico y con la de categorías.
- El KPI de clientes nuevos coincide con la suma de clientes nuevos por país.
- Los ingresos por producto reparten los de su categoría (difieren menos de un 0,01 % por redondeo).
- La tabla de transacciones es una **muestra** de los pedidos más recientes, no el total.

Los importes se generan en USD y se convierten al mostrarlos con un tipo de cambio fijo de demostración (`src/lib/format.ts`).

## Cómo conectar una API real

1. **Define la URL** en `.env`:
   ```
   VITE_API_URL=https://api.mitienda.com
   ```
2. **Sustituye el cuerpo de cada función** de `src/services/dashboardService.ts`. Cada una tiene la línea lista, marcada con 🔌:
   ```ts
   export function getKpis(range: Range): Promise<Kpi[]> {
     // 🔌 API real: return apiGet<Kpi[]>('/kpis', { range });
     return simulateRequest(() => buildKpis(range));
   }
   ```
   queda así:
   ```ts
   export function getKpis(range: Range): Promise<Kpi[]> {
     return apiGet<Kpi[]>('/kpis', { range });
   }
   ```
3. **Ajusta los tipos** de `src/types/index.ts` si tu API devuelve otra forma. También puedes transformar la respuesta dentro del servicio: es el único sitio que conoce el formato del backend.
4. **Tiempo real:** en `src/hooks/useLiveMetrics.ts` hay un ejemplo comentado para cambiar el `setInterval` por un `WebSocket` (o `EventSource`).
5. **Limpieza:** cuando ninguna función use el mock, borra `src/services/mock/` y la dependencia `@faker-js/faker`.

Los componentes no cambian: consumen los hooks de `src/hooks/useDashboardData.ts`, y React Query se encarga de la caché, los reintentos y los estados de carga y error.

## Personalizar colores

Edita `src/theme/palette.ts`:

- `brand`: violeta y cian de la interfaz.
- `chartSeries`: los 5 colores de las series, en orden fijo.

Tailwind y Recharts leen de ese archivo. Los fondos y textos de cada tema están en las variables CSS de `src/index.css`.
