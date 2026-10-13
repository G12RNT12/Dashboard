import { Link } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';

export function NotFoundPage() {
  return (
    <Page className="max-w-xl">
      <Card hover={false} className="p-8 text-center">
        <p className="text-5xl font-semibold tracking-tight text-ink">404</p>
        <h1 className="mt-3 text-lg font-semibold text-ink">Esta página no existe</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Puede que el enlace esté mal escrito o que la sección se haya movido.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-brand-violet px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-violetDark"
        >
          Ir al resumen
        </Link>
      </Card>
    </Page>
  );
}
