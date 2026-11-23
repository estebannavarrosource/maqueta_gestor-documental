import type { Estado } from '@/lib/catalog'

const ESTILOS: Record<Estado, string> = {
  Presentada: 'bg-info-soft text-primary',
  Habilitada: 'bg-success-soft text-success',
  'En fiscalización': 'bg-warning-soft text-warning',
  Paralizada: 'bg-warning-soft text-destructive',
  'Permiso revocado': 'bg-danger-soft text-destructive',
}

export function StatusBadge({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS[estado]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {estado}
    </span>
  )
}
