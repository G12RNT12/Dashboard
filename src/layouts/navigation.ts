import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard },
  { to: '/ventas', label: 'Ventas', icon: ShoppingBag },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/productos', label: 'Productos', icon: Package },
];

export const secondaryNav: NavItem[] = [
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];
