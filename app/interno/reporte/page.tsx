'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Card, PageTitle } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import { ESTADOS, REGIONES, TRAMITES } from '@/lib/catalog'
import { useStore } from '@/lib/store'

function Barras({ datos }: { datos: { etiqueta: string; valor: number }[] }) {
  const max = Math.max(1, ...datos.map((d) => d.valor))
  return (
    <ul className="flex flex-col gap-2">
      {datos.map((d) => (
        <li key={d.etiqueta} className="grid grid-cols-[minmax(0,180px)_1fr_28px] items-center gap-3 text-sm">
          <span className="truncate" title={d.etiqueta}>{d.etiqueta}</span>
          <div className="h-2.5 rounded-full bg-muted">
            <div className="h-2.5 rounded-full bg-primary" style={{ width: `${(d.valor / max) * 100}%` }} />
          </div>
          <span className="text-right font-mono text-xs">{d.valor}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Reporte() {
  const { rol, declaraciones } = useStore()
  const [msg, setMsg] = useState('')

  if (rol !== 'analista' && rol !== 'fiscalizador')
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Acceso restringido a funcionarios DGA.</p>
      </div>
    )

  const porTramite = TRAMITES.map((t) => ({ etiqueta: t.corto, valor: declaraciones.filter((d) => d.tramite === t.id).length }))
  const porEstado = ESTADOS.map((e) => ({ etiqueta: e, valor: declaraciones.filter((d) => d.estado === e).length }))
  const porRegion = REGIONES.map((r) => ({ etiqueta: r, valor: declaraciones.filter((d) => d.proyecto.region === r).length }))
    .filter((r) => r.valor > 0)
    .sort((a, b) => b.valor - a.valor)

  return (
    <div>
      <PageTitle
        eyebrow="Reportes y consultas"
        title={
          <>
            Reporte de declaraciones
            <NoteMark id="C-18" className="ml-2" />
          </>
        }
      >
        <button
          type="button"
          onClick={() => setMsg('Exportación simulada: en el sistema real se descargaría un archivo Excel o PDF.')}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted"
        >
          <Download className="size-4" aria-hidden /> Exportar
        </button>
      </PageTitle>
      {msg && <p role="status" className="mb-4 rounded-md bg-secondary p-3 text-sm">{msg}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Por trámite</h2>
          <Barras datos={porTramite} />
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Por estado</h2>
          <Barras datos={porEstado} />
        </Card>
        <Card className="p-5 md:col-span-2">
          <h2 className="mb-4 font-semibold">Por región</h2>
          <Barras datos={porRegion} />
        </Card>
      </div>
    </div>
  )
}
