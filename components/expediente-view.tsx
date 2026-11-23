'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Card, Field, inputCls } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import { StatusBadge } from '@/components/status-badge'
import { tramitePorId, type Estado } from '@/lib/catalog'
import { fechaHora } from '@/lib/format'
import { useStore } from '@/lib/store'

const TABS = ['Resumen', 'Historial', 'Documentos', 'Alertas', 'Fiscalización'] as const
type Tab = (typeof TABS)[number]

export function ExpedienteView({ codigo }: { codigo: string }) {
  const { obtener, rol, cambiarEstado, avanzarDia, notificaciones } = useStore()
  const d = obtener(codigo)
  const [tab, setTab] = useState<Tab>('Resumen')
  const [nuevo, setNuevo] = useState<Estado | ''>('')
  const [motivo, setMotivo] = useState('')
  const [resolucion, setResolucion] = useState('')
  const [error, setError] = useState('')

  if (!d)
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">No se encontró el expediente {codigo}.</p>
        <Link href="/registro" className="mt-3 inline-block text-sm text-primary underline">Volver al registro</Link>
      </Card>
    )

  const t = tramitePorId(d.tramite)
  const puedeVerInterno = rol === 'analista' || rol === 'fiscalizador'
  const esPropio = d.propietario === 'demo' || rol === 'ministro'
  const accesible = puedeVerInterno || esPropio
  const tabs = TABS.filter((x) => (x === 'Fiscalización' ? rol === 'fiscalizador' : x === 'Alertas' ? puedeVerInterno : true))

  if (!accesible)
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">El expediente completo no es público.</p>
        <p className="mt-1 text-sm text-muted-foreground">Solo el titular, su representante o apoderado y funcionarios DGA pueden verlo.</p>
        <Link href={`/certificado/${d.codigo}`} className="mt-3 inline-block text-sm text-primary underline">Ver certificado público</Link>
      </Card>
    )

  const aplicar = () => {
    if (!nuevo) return setError('Seleccione el nuevo estado.')
    if (motivo.trim().length < 5) return setError('Ingrese el motivo del cambio.')
    if ((nuevo === 'Permiso revocado' || nuevo === 'Paralizada') && !resolucion.trim())
      return setError('Ingrese el número de resolución que sustenta la medida.')
    setError('')
    cambiarEstado(d.codigo, nuevo, motivo, resolucion || undefined)
    setNuevo('')
    setMotivo('')
    setResolucion('')
    setTab('Historial')
  }

  const fila = (k: string, v: React.ReactNode) => (
    <div className="flex flex-col gap-0.5 border-b border-border py-2.5 sm:flex-row sm:gap-4">
      <dt className="text-sm text-muted-foreground sm:w-48 sm:shrink-0">{k}</dt>
      <dd className="text-sm font-medium">{v}</dd>
    </div>
  )

  const colorEvento = { usuario: 'bg-primary', sistema: 'bg-muted-foreground', fiscalizacion: 'bg-destructive' }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Expediente electrónico
            <NoteMark id="C-24" className="ml-2" />
          </p>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight">{d.proyecto.nombre}</h1>
          <p className="mt-1 font-mono text-sm text-primary">{d.codigo}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge estado={d.estado} />
          <Link href={`/certificado/${d.codigo}`} className="text-sm font-medium text-primary hover:underline">
            Ver certificado
          </Link>
        </div>
      </div>

      <div role="tablist" aria-label="Secciones del expediente" className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((x) => (
          <button
            key={x}
            role="tab"
            type="button"
            aria-selected={tab === x}
            onClick={() => setTab(x)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === x ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {x}
            {x === 'Alertas' && d.alertas.length > 0 && (
              <span className="ml-1.5 rounded-full bg-warning-soft px-1.5 text-xs text-warning">{d.alertas.length}</span>
            )}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {tab === 'Resumen' && (
          <div className="grid gap-8 md:grid-cols-2">
            <dl>
              <h2 className="mb-2 font-semibold">Declaración</h2>
              {fila('Trámite', t.corto)}
              {fila('Presentada por', d.presentadoPor)}
              {fila('Presentada el', <span className="font-mono">{fechaHora(d.presentadaEn)}</span>)}
              {fila('Habilitada desde', <span className="font-mono">{fechaHora(d.habilitadaDesde).slice(0, 10)}</span>)}
              {fila('Firma', d.firma)}
              {fila('Unidad destino', d.unidadDestino)}
              {d.resolucionRevocacion && fila('Resolución', d.resolucionRevocacion)}
            </dl>
            <dl>
              <h2 className="mb-2 font-semibold">
                Titular y accesos
                <NoteMark id="C-07" className="ml-2" />
              </h2>
              {fila('Titular', `${d.solicitante.nombre} (${d.solicitante.tipo})`)}
              {fila('RUT', d.solicitante.rut)}
              {fila('Correo', d.solicitante.email)}
              {d.solicitante.representante && fila('Representante', `${d.solicitante.representante.nombre} · ${d.solicitante.representante.rut}`)}
              {fila('Ubicación', `${d.proyecto.comuna}, ${d.proyecto.region}`)}
              {fila('Cauce', d.proyecto.cauce)}
              {fila('Coordenadas UTM', <span className="font-mono">{d.proyecto.este} E / {d.proyecto.norte} N · huso {d.proyecto.huso}</span>)}
            </dl>
            <p className="md:col-span-2 text-sm leading-relaxed text-muted-foreground">{d.proyecto.descripcion}</p>
          </div>
        )}

        {tab === 'Historial' && (
          <div>
            <h2 className="mb-1 font-semibold">
              Bitácora de actuaciones
              <NoteMark id="C-19" className="ml-2" />
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">Cada actuación se registra con fecha, hora, minuto y segundo.</p>
            <ol className="flex flex-col">
              {[...d.eventos].sort((a, b) => a.ts.localeCompare(b.ts)).map((e) => (
                <li key={e.id} className="flex gap-4 border-l border-border pb-5 pl-4 last:pb-0">
                  <span aria-hidden className={`-ml-[21px] mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-card ${colorEvento[e.tipo]}`} />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{fechaHora(e.ts)}</p>
                    <p className="text-sm font-medium">{e.accion}</p>
                    {e.detalle && <p className="text-sm text-muted-foreground">{e.detalle}</p>}
                    <p className="text-xs text-muted-foreground">{e.actor} · {e.perfil}</p>
                  </div>
                </li>
              ))}
            </ol>
            {notificaciones.filter((n) => n.codigo === d.codigo).length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="mb-2 text-sm font-semibold">
                  Notificaciones enviadas
                  <NoteMark id="C-20" className="ml-2" />
                </h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {notificaciones.filter((n) => n.codigo === d.codigo).map((n) => (
                    <li key={n.id} className="rounded-md bg-muted p-3">
                      <span className="font-medium">{n.asunto}</span>
                      <span className="block text-xs text-muted-foreground">{n.canal} · {fechaHora(n.ts)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'Documentos' && (
          <div>
            <h2 className="mb-3 font-semibold">Documentos del expediente</h2>
            {d.documentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin documentos adjuntos.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {d.documentos.map((x) => (
                  <li key={x.nombre} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                    <FileText className="size-4 text-muted-foreground" aria-hidden />
                    <span className="font-medium">{x.nombre}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{x.tipo} · {x.tamano}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'Alertas' && (
          <div>
            <h2 className="mb-3 font-semibold">
              Alertas de revisión automatizada
              <NoteMark id="C-15" className="ml-2" />
            </h2>
            {d.alertas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin alertas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {d.alertas.map((a) => (
                  <li key={a.id} className="rounded-lg border border-border p-3 text-sm">
                    <p className="font-medium">
                      <span className={`mr-2 rounded px-1.5 py-0.5 text-xs ${a.severidad === 'Alta' ? 'bg-danger-soft text-destructive' : 'bg-warning-soft text-warning'}`}>{a.severidad}</span>
                      {a.regla}
                    </p>
                    <p className="mt-1 text-muted-foreground">{a.detalle}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'Fiscalización' && rol === 'fiscalizador' && (
          <div className="max-w-xl">
            <h2 className="mb-1 font-semibold">
              Cambiar estado
              <NoteMark id="C-14" className="ml-2" />
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              El cambio queda registrado en la bitácora y se notifica al solicitante.
              <NoteMark id="C-13" className="ml-2" />
            </p>
            <div className="flex flex-col gap-4">
              <Field label="Nuevo estado">
                {(id) => (
                  <select id={id} className={inputCls} value={nuevo} onChange={(e) => setNuevo(e.target.value as Estado)}>
                    <option value="">Seleccione</option>
                    {(['En fiscalización', 'Paralizada', 'Permiso revocado', 'Habilitada'] as Estado[])
                      .filter((s) => s !== d.estado)
                      .map((s) => <option key={s}>{s}</option>)}
                  </select>
                )}
              </Field>
              <Field label="Motivo">
                {(id) => <textarea id={id} rows={3} className={`${inputCls} h-auto py-2`} value={motivo} onChange={(e) => setMotivo(e.target.value)} />}
              </Field>
              {(nuevo === 'Permiso revocado' || nuevo === 'Paralizada') && (
                <Field label="N.° de resolución">
                  {(id) => <input id={id} className={inputCls} placeholder="Res. Ex. N° ..." value={resolucion} onChange={(e) => setResolucion(e.target.value)} />}
                </Field>
              )}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={aplicar} className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
                  Aplicar cambio
                </button>
                {d.estado === 'Presentada' && (
                  <button type="button" onClick={() => avanzarDia(d.codigo)} className="h-10 rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted">
                    Simular paso del día (habilitar)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
