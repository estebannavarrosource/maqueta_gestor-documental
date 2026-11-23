'use client'

import { useState } from 'react'
import { notaPorId } from '@/lib/notas'
import { useStore } from '@/lib/store'

/** Marcador de comentario de la maqueta; enlaza con el informe PDF. */
export function NoteMark({ id, className = '' }: { id: string; className?: string }) {
  const { notas } = useStore()
  const [abierto, setAbierto] = useState(false)
  const nota = notaPorId(id)
  if (!notas || !nota) return null

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={`Comentario ${id}: ${nota.titulo}`}
        className="inline-flex h-5 items-center rounded-full bg-note px-1.5 font-mono text-[10px] font-semibold leading-none text-white shadow-sm ring-2 ring-background transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {id}
      </button>
      {abierto && (
        <span
          role="dialog"
          className="absolute left-0 top-7 z-50 w-72 rounded-lg border border-border bg-popover p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-popover-foreground shadow-lg"
        >
          <span className="mb-1 block text-[11px] font-semibold uppercase text-note">
            {nota.prioridad} · {nota.tipo}
          </span>
          <span className="mb-1 block text-sm font-semibold">{nota.titulo}</span>
          <span className="mb-2 block text-muted-foreground">{nota.detalle}</span>
          <span className="block font-medium">Consulta: {nota.pregunta}</span>
        </span>
      )}
    </span>
  )
}
