'use client'

import Link from 'next/link'
import { Droplets, Printer } from 'lucide-react'
import { NoteMark } from '@/components/note-mark'
import { StatusBadge } from '@/components/status-badge'
import { tramitePorId } from '@/lib/catalog'
import { fecha, fechaHora, fechaLarga } from '@/lib/format'
import { useStore } from '@/lib/store'

function PseudoQr({ semilla }: { semilla: string }) {
  const n = 21
  let h = 2166136261
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const celdas: boolean[] = []
  for (let i = 0; i < n * n; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    celdas.push(((h >>> 7) & 3) !== 0)
  }
  const esFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
  const finder = (x: number, y: number) => {
    const ox = x >= n - 7 ? x - (n - 7) : x
    const oy = y >= n - 7 ? y - (n - 7) : y
    return ox === 0 || ox === 6 || oy === 0 || oy === 6 || (ox >= 2 && ox <= 4 && oy >= 2 && oy <= 4)
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="size-24 text-foreground" role="img" aria-label="Código QR de verificación (simulado)">
      {celdas.map((on, i) => {
        const x = i % n
        const y = Math.floor(i / n)
        const lleno = esFinder(x, y) ? finder(x, y) : on
        return lleno ? <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor" /> : null
      })}
    </svg>
  )
}

export function CertificadoView({ codigo }: { codigo: string }) {
  const { obtener, rol } = useStore()
  const d = obtener(codigo)

  if (!d)
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">No se encontró el certificado {codigo}.</p>
        <Link href="/registro" className="mt-3 inline-block text-sm text-primary underline">
          Volver al registro público
        </Link>
      </div>
    )

  const t = tramitePorId(d.tramite)
  const alerta =
    d.estado === 'Permiso revocado'
      ? { cls: 'border-destructive bg-danger-soft text-destructive', txt: `Este permiso fue REVOCADO. ${d.resolucionRevocacion ?? ''}` }
      : d.estado === 'Paralizada'
        ? { cls: 'border-destructive bg-danger-soft text-destructive', txt: 'Las actividades de este proyecto se encuentran PARALIZADAS por orden de la autoridad.' }
        : d.estado === 'En fiscalización'
          ? { cls: 'border-warning bg-warning-soft text-warning', txt: 'Este proyecto se encuentra en fiscalización posterior.' }
          : null

  const fila = (k: string, v: React.ReactNode) => (
    <div className="grid gap-1 border-b border-border py-2.5 sm:grid-cols-[200px_1fr]">
      <dt className="text-sm text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href={rol === 'analista' || rol === 'fiscalizador' ? `/expediente/${d.codigo}` : '/registro'} className="text-sm text-primary hover:underline">
          {rol === 'analista' || rol === 'fiscalizador' ? 'Ver expediente completo' : 'Volver al registro'}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm font-medium hover:bg-muted"
        >
          <Printer className="size-4" aria-hidden /> Imprimir / guardar PDF
        </button>
      </div>

      {alerta && (
        <p role="status" className={`mb-4 rounded-lg border-l-4 px-4 py-3 text-sm font-medium ${alerta.cls}`}>
          {alerta.txt}
        </p>
      )}

      <article className="rounded-xl border-2 border-primary/80 bg-card p-6 shadow-sm md:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="size-6" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Ministerio de Obras Públicas</p>
              <p className="font-semibold">Dirección General de Aguas</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Folio</p>
            <p className="font-mono text-lg font-semibold text-primary">{d.codigo}</p>
          </div>
        </header>

        <h1 className="mt-6 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          Certificado de Ingreso de Declaración Jurada
          <NoteMark id="C-10" className="ml-2" />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.nombre}</p>

        <dl className="mt-6">
          {fila('Titular', `${d.solicitante.nombre}`)}
          {fila('Proyecto', d.proyecto.nombre)}
          {fila('Ubicación', `${d.proyecto.comuna}, Región ${d.proyecto.region} · ${d.proyecto.cauce}`)}
          {fila('Presentada el', <span className="font-mono">{fechaHora(d.presentadaEn)}</span>)}
          {fila('Habilitada desde', <span>{fechaLarga(d.habilitadaDesde)}</span>)}
          {fila('Firma', d.firma)}
          {fila('Estado actual', <StatusBadge estado={d.estado} />)}
        </dl>

        <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-foreground">
          La declaración jurada produce efectos habilitantes desde el día siguiente a su presentación válida, por el solo
          ministerio de la ley, sin perjuicio de la fiscalización posterior de la autoridad. Este certificado se publica en
          el sitio web de la Dirección General de Aguas y se presume de derecho conocido por terceros desde su publicación.
        </p>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Código de verificación</p>
            <p className="mt-1 font-mono text-sm">{d.codigo.replace(/\D/g, '').slice(-6)}-{d.codigo.slice(3, 6)}-DGA</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Emitido automáticamente el {fecha(d.presentadaEn)}. Sin firma electrónica real (maqueta).
            </p>
          </div>
          <PseudoQr semilla={d.codigo} />
        </footer>
      </article>
    </div>
  )
}
