'use client'

import Link from 'next/link'
import { ArrowRight, FileCheck2, Search, ShieldAlert } from 'lucide-react'
import { NoteMark } from '@/components/note-mark'
import { Card } from '@/components/form-controls'
import { TRAMITES } from '@/lib/catalog'
import { useStore } from '@/lib/store'

const HITOS = [
  {
    icon: FileCheck2,
    titulo: 'Presentación',
    texto: 'El titular completa el formulario estandarizado y firma la declaración en línea o adjunta.',
  },
  {
    icon: Search,
    titulo: 'Certificado y publicación',
    texto:
      'El sistema emite el Certificado de Ingreso al instante y lo publica en el registro público. La habilitación rige desde el día siguiente.',
  },
  {
    icon: ShieldAlert,
    titulo: 'Control posterior',
    texto:
      'El expediente se remite a la unidad interna. Si hay incumplimiento o falsedad, se puede paralizar y revocar el permiso.',
  },
]

export default function Inicio() {
  const { rol } = useStore()
  const puedePresentar = rol === 'solicitante' || rol === 'ministro'

  return (
    <div className="flex flex-col gap-12">
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Técnica habilitante alternativa · Art. 139 bis, Código de Aguas
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Presente su Declaración Jurada y obtenga su certificado al instante
            <NoteMark id="C-02" className="ml-2" />
          </h1>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Para proyectos de bajo riesgo sobre bocatomas, cauces y obras hidráulicas. Su proyecto queda habilitado desde
            el día siguiente a la presentación, sin esperar una resolución previa.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {puedePresentar ? (
              <Link
                href="/declaraciones/nueva"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {rol === 'ministro' ? 'Iniciar ingreso asistido' : 'Presentar declaración jurada'}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <p className="rounded-md border border-dashed border-input bg-card px-4 py-2.5 text-sm text-muted-foreground">
                Para presentar una declaración elija el perfil <strong className="text-foreground">Solicitante</strong> en
                la barra superior.
              </p>
            )}
            <Link
              href="/registro"
              className="inline-flex h-11 items-center rounded-md border border-input bg-card px-5 text-sm font-medium hover:bg-muted"
            >
              Consultar registro público
            </Link>
          </div>
        </div>

        <Card className="relative overflow-hidden p-6 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Certificado de Ingreso</p>
          <p className="mt-2 font-mono text-lg font-semibold text-primary">DJ-ABO-2026-000041</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">Presentada</dt>
              <dd className="font-mono">16-11-2026 11:22:08</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">Habilitada desde</dt>
              <dd className="font-mono">17-11-2026</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="font-medium text-success">Habilitada</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Ejemplo ilustrativo con datos ficticios.</p>
        </Card>
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="mb-4 text-xl font-semibold">
          Cómo funciona
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {HITOS.map((h) => (
            <Card key={h.titulo} className="p-5">
              <h.icon className="mb-3 size-5 text-primary" aria-hidden />
              <h3 className="font-semibold">{h.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.texto}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="tramites">
        <h2 id="tramites" className="mb-1 text-xl font-semibold">
          Trámites disponibles como declaración jurada
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Los proyectos de alto riesgo mantienen su flujo tradicional de autorización previa por resolución de la DGA.
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {TRAMITES.map((t) => (
            <li key={t.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <span className="mt-0.5 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                {t.id}
              </span>
              <div>
                <p className="text-sm font-medium leading-snug">{t.nombre}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.etapa === 'construccion' ? 'Antes de construir' : 'Al terminar la obra'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
