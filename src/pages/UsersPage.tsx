import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader';
import { CountryChart } from '@/features/users/CountryChart';
import { CustomerGrowthChart } from '@/features/users/CustomerGrowthChart';
import { CustomersTable } from '@/features/users/CustomersTable';

export function UsersPage() {
  return (
    <Page>
      <PageHeader
        title="Usuarios"
        description="Quién compra, cuántos clientes llegan y desde dónde."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <CustomerGrowthChart className="xl:col-span-3" />
        <CountryChart className="xl:col-span-2" />
      </div>

      <CustomersTable />
    </Page>
  );
}
