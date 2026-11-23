'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Droplets } from 'lucide-react'
import { nombreRol, useStore } from '@/lib/store'
import type { Rol } from '@/lib/types'

const NAV: Record<Rol, { href: string; label: string }[]> = {
  publico: [
    { href: '/', label: 'Inicio' },
    { href: '/registro', label: 'Registro público' },
  ],
  solicitante: [
    { href: '/', label: 'Inicio' },
    { href: '/declaraciones/nueva', label: 'Presentar DJ' },
    { href: '/declaraciones', label: 'Mis declaraciones' },
    { href: '/registro', label: 'Registro público' },
  ],
  ministro: [
    { href: '/', label: 'Inicio' },
    { href: '/declaraciones/nueva', label: 'Ingreso asistido' },
    { href: '/declaraciones', label: 'Declaraciones ingresadas' },
    { href: '/registro', label: 'Registro público' },
  ],
  analista: [
    { href: '/interno', label: 'Bandeja' },
    { href: '/interno/reporte', label: 'Reportes' },
    { href: '/registro', label: 'Registro público' },
  ],
  fiscalizador: [
    { href: '/interno', label: 'Bandeja' },
    { href: '/interno/reporte', label: 'Reportes' },
    { href: '/registro', label: 'Registro público' },
  ],
}

export function AppHeader() {
  const { rol, setRol, notas, setNotas } = useStore()
  const pathname = usePathname()

  return (
    <header className="no-print border-b border-border bg-card">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 text-xs">
          <p className="font-medium">
            MAQUETA FUNCIONAL · Datos ficticios · No produce efectos legales
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="opacity-80">Ver como</span>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as Rol)}
                className="h-7 rounded-md border border-primary-foreground/30 bg-primary px-2 text-xs text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {(Object.keys(nombreRol) as Rol[]).map((r) => (
                  <option key={r} value={r}>
                    {nombreRol[r]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={notas}
                onChange={(e) => setNotas(e.target.checked)}
                className="size-4 accent-[oklch(0.68_0.17_55)]"
              />
              <span>Mostrar comentarios</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-muted-foreground">Dirección General de Aguas</span>
            <span className="block text-base font-semibold">Declaraciones Juradas · Técnicas habilitantes</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-1">
          {NAV[rol].map((item) => {
            const activo = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={activo ? 'page' : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activo ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
