import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  PackageX,
  RotateCcw,
  Sparkles,
  UserCheck,
  UserMinus,
  XCircle,
} from 'lucide-react';
import type { BadgeProps } from '@/components/StatusBadge';
import type { CustomerStatus, StockStatus, TransactionStatus } from '@/types';

/** Etiqueta, icono y tono de cada estado para los badges de las tablas. */
export const transactionStatusMeta: Record<TransactionStatus, BadgeProps> = {
  completed: { tone: 'success', icon: CheckCircle2, label: 'Completado' },
  pending: { tone: 'warning', icon: Clock3, label: 'Pendiente' },
  failed: { tone: 'danger', icon: XCircle, label: 'Fallido' },
  refunded: { tone: 'neutral', icon: RotateCcw, label: 'Reembolsado' },
};

export const customerStatusMeta: Record<CustomerStatus, BadgeProps> = {
  active: { tone: 'success', icon: UserCheck, label: 'Activo' },
  new: { tone: 'info', icon: Sparkles, label: 'Nuevo' },
  inactive: { tone: 'neutral', icon: UserMinus, label: 'Inactivo' },
};

export const stockStatusMeta: Record<StockStatus, BadgeProps> = {
  in_stock: { tone: 'success', icon: CheckCircle2, label: 'En stock' },
  low_stock: { tone: 'warning', icon: AlertTriangle, label: 'Stock bajo' },
  out_of_stock: { tone: 'danger', icon: PackageX, label: 'Agotado' },
};
