'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Card, Field, PageTitle, inputCls } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import { StatusBadge } from '@/components/status-badge'
import { ESTADOS, TRAMITES, tramitePorId } from '@/lib/catalog'
import { fechaHora } from '@/lib/format'
import { useStore } from '@/lib/store'

export default function Bandeja() {
  const { rol, declaraciones } = useStore()
  const [estado, setEstado] = useState('')
  const [tramite, setTramite] = useState('')
  const [soloAlertas, setSoloAlertas] = useState(false)

  const filas = useMemo(
    () =>
      declaraciones
        .filter((d) => (estado ? d.estado === estado : true))
        .filter((d) => (tramite ? d.tramite === tramite : true))
        .filter((d) => (soloAlertas ? d.alertas.length > 0 : true))
        .sort((a, b) => b.presentadaEn.localeCompare(a.presentadaEn)),
    [declaraciones, estado, tramite, soloAlertas],
  )

  if (rol !== 'analista' && rol !== 'fiscalizador')
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Acceso restringido a funcionarios DGA.</p>
        <p className="mt-1 text-sm text-muted-foreground">Elija el perfil Analista o Fiscalizador en “Ver como”.</p>
      </div>
    )

  const conAlertas = declaraciones.filter((d) => d.alertas.length > 0).length
  const resumen = [
    { l: 'Total', v: declaraciones.length },
    { l: 'Con alertas', v: conAlertas },
    { l: 'En fiscalización', v: declaraciones.filter((d) => d.estado === 'En fiscalización').length },
    { l: 'Paralizadas o revocadas', v: declaraciones.filter((d) => d.estado === 'Paralizada' || d.estado === 'Permiso revocado').length },
  ]

  return (
    <div>
      <PageTitle
        eyebrow={rol === 'fiscalizador' ? 'Perfil Fiscalizador · puede cambiar estados' : 'Perfil Analista · solo consulta'}
        title={
          <>
            Bandeja de revisión
            <NoteMark id="C-17" className="ml-2" />
          </>
        }
      />

      <dl className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {resumen.map((r) => (
          <Card key={r.l} className="p-4">
            <dt className="text-xs text-muted-foreground">{r.l}</dt>
            <dd className="mt-1 text-2xl font-semibold">{r.v}</dd>
          </Card>
        ))}
      </dl>

      <Card className="mb-4 grid items-end gap-4 p-4 md:grid-cols-4">
        <Field label="Estado">
          {(id) => (
            <select id={id} className={inputCls} value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              {ESTADOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          )}
        </Field>
        <Field label="Trámite">
          {(id) => (
            <select id={id} className={inputCls} value={tramite} onChange={(e) => setTramite(e.target.value)}>
              <option value="">Todos</option>
              {TRAMITES.map((t) => <option key={t.id} value={t.id}>{t.corto}</option>)}
            </select>
          )}
        </Field>
        <label className="flex h-10 items-center gap-2 text-sm">
          <input type="checkbox" checked={soloAlertas} onChange={(e) => setSoloAlertas(e.target.checked)} className="size-4 accent-[oklch(0.42_0.13_255)]" />
          Solo con alertas
          <NoteMark id="C-15" />
        </label>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">Declaraciones remitidas a unidades internas</caption>
          <thead className="border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Código</th>
              <th scope="col" className="px-4 py-3 font-medium">Proyecto</th>
              <th scope="col" className="px-4 py-3 font-medium">
                Unidad destino <NoteMark id="C-16" />
              </th>
              <th scope="col" className="px-4 py-3 font-medium">Alertas</th>
              <th scope="col" className="px-4 py-3 font-medium">Presentada</th>
              <th scope="col" className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((d) => (
              <tr key={d.codigo} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 align-top">
                  <Link href={`/expediente/${d.codigo}`} className="font-mono text-xs font-medium text-primary hover:underline">
                    {d.codigo}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium">{d.proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground">{tramitePorId(d.tramite).corto}</p>
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">{d.unidadDestino}</td>
                <td className="px-4 py-3 align-top">
                  {d.alertas.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Sin alertas</span>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {d.alertas.map((a) => (
                        <li
                          key={a.id}
                          className={`w-fit rounded px-1.5 py-0.5 text-xs font-medium ${
                            a.severidad === 'Alta' ? 'bg-danger-soft text-destructive' : 'bg-warning-soft text-warning'
                          }`}
                        >
                          {a.severidad}: {a.regla}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs">{fechaHora(d.presentadaEn)}</td>
                <td className="px-4 py-3 align-top"><StatusBadge estado={d.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
