import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { FiltersProvider } from '@/context/FiltersProvider';
import { SettingsProvider } from '@/context/SettingsProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MainLayout } from '@/layouts/MainLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { SalesPage } from '@/pages/SalesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { UsersPage } from '@/pages/UsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // los datos de un rango se reutilizan 5 min sin volver a pedirlos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        { index: true, element: <OverviewPage /> },
        { path: 'ventas', element: <SalesPage /> },
        { path: 'usuarios', element: <UsersPage /> },
        { path: 'productos', element: <ProductsPage /> },
        { path: 'configuracion', element: <SettingsPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

/** Desactiva las animaciones de transformación de Framer Motion si hay que reducir movimiento. */
function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <FiltersProvider>
          <MotionProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </MotionProvider>
        </FiltersProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
