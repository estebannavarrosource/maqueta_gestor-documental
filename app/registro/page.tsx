'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Card, Field, PageTitle, inputCls } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import { StatusBadge } from '@/components/status-badge'
import { ESTADOS, REGIONES, TRAMITES, tramitePorId } from '@/lib/catalog'
import { fecha } from '@/lib/format'
import { useStore } from '@/lib/store'

export default function RegistroPublico() {
  const { declaraciones } = useStore()
  const [q, setQ] = useState('')
  const [tramite, setTramite] = useState('')
  const [estado, setEstado] = useState('')
  const [region, setRegion] = useState('')

  const filas = useMemo(
    () =>
      declaraciones
        .filter((d) => (tramite ? d.tramite === tramite : true))
        .filter((d) => (estado ? d.estado === estado : true))
        .filter((d) => (region ? d.proyecto.region === region : true))
        .filter((d) =>
          q
            ? [d.codigo, d.proyecto.nombre, d.solicitante.nombre, d.proyecto.cauce, d.proyecto.comuna]
                .join(' ')
                .toLowerCase()
                .includes(q.toLowerCase())
            : true,
        )
        .sort((a, b) => b.presentadaEn.localeCompare(a.presentadaEn)),
    [declaraciones, q, tramite, estado, region],
  )

  return (
    <div>
      <PageTitle
        eyebrow="Acceso público y gratuito"
        title={
          <>
            Registro de declaraciones juradas y certificados
            <NoteMark id="C-11" className="ml-2" />
          </>
        }
      />
      <p className="-mt-3 mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Los certificados publicados se presumen de derecho conocidos por terceros desde su fecha de publicación.
        <NoteMark id="C-12" className="ml-2" />
      </p>

      <Card className="mb-6 grid gap-4 p-4 md:grid-cols-4">
        <Field label="Buscar" className="md:col-span-1">
          {(id) => (
            <input
              id={id}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Código, proyecto, cauce, comuna"
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Trámite">
          {(id) => (
            <select id={id} value={tramite} onChange={(e) => setTramite(e.target.value)} className={inputCls}>
              <option value="">Todos</option>
              {TRAMITES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.corto}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Estado">
          {(id) => (
            <select id={id} value={estado} onChange={(e) => setEstado(e.target.value)} className={inputCls}>
              <option value="">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Región">
          {(id) => (
            <select id={id} value={region} onChange={(e) => setRegion(e.target.value)} className={inputCls}>
              <option value="">Todas</option>
              {REGIONES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          )}
        </Field>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <caption className="sr-only">Declaraciones juradas publicadas</caption>
          <thead className="border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Código</th>
              <th scope="col" className="px-4 py-3 font-medium">Trámite y proyecto</th>
              <th scope="col" className="px-4 py-3 font-medium">Ubicación</th>
              <th scope="col" className="px-4 py-3 font-medium">Titular</th>
              <th scope="col" className="px-4 py-3 font-medium">Presentada</th>
              <th scope="col" className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((d) => (
              <tr key={d.codigo} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 align-top">
                  <Link href={`/certificado/${d.codigo}`} className="font-mono text-xs font-medium text-primary underline-offset-2 hover:underline">
                    {d.codigo}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium">{d.proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground">{tramitePorId(d.tramite).corto}</p>
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  {d.proyecto.comuna}, {d.proyecto.region}
                  <p className="text-xs">{d.proyecto.cauce}</p>
                </td>
                <td className="px-4 py-3 align-top">{d.solicitante.nombre}</td>
                <td className="px-4 py-3 align-top font-mono text-xs">{fecha(d.presentadaEn)}</td>
                <td className="px-4 py-3 align-top"><StatusBadge estado={d.estado} /></td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No hay declaraciones que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
