'use client'

import Link from 'next/link'
import { Card, PageTitle } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import { StatusBadge } from '@/components/status-badge'
import { tramitePorId } from '@/lib/catalog'
import { fechaHora } from '@/lib/format'
import { useStore } from '@/lib/store'

export default function MisDeclaraciones() {
  const { rol, declaraciones, notificaciones } = useStore()

  if (rol !== 'solicitante' && rol !== 'ministro')
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">Esta sección es para el perfil Solicitante o Ministro de fe.</p>
        <p className="mt-1 text-sm text-muted-foreground">Use el selector “Ver como” de la barra superior.</p>
      </Card>
    )

  const mias = declaraciones
    .filter((d) => (rol === 'ministro' ? d.presentadoPor === 'Ministro de fe' : d.propietario === 'demo'))
    .sort((a, b) => b.presentadaEn.localeCompare(a.presentadaEn))

  return (
    <div>
      <PageTitle eyebrow={rol === 'ministro' ? 'Ingresos asistidos' : 'Mi bandeja'} title="Mis declaraciones juradas">
        <Link
          href="/declaraciones/nueva"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Nueva declaración
        </Link>
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {mias.length === 0 && (
            <Card className="p-8 text-center text-sm text-muted-foreground">Aún no hay declaraciones presentadas.</Card>
          )}
          {mias.map((d) => (
            <Card key={d.codigo} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-medium text-primary">{d.codigo}</p>
                  <p className="mt-1 font-medium">{d.proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {tramitePorId(d.tramite).corto} · {d.proyecto.comuna}
                  </p>
                </div>
                <StatusBadge estado={d.estado} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-mono">Presentada {fechaHora(d.presentadaEn)}</span>
                <span className="flex gap-4 text-sm">
                  <Link href={`/certificado/${d.codigo}`} className="font-medium text-primary hover:underline">
                    Certificado
                  </Link>
                  <Link href={`/expediente/${d.codigo}`} className="font-medium text-primary hover:underline">
                    Expediente
                  </Link>
                </span>
              </div>
            </Card>
          ))}
        </div>

        <aside aria-labelledby="notif">
          <h2 id="notif" className="mb-3 text-sm font-semibold">
            Notificaciones
            <NoteMark id="C-20" className="ml-2" />
          </h2>
          <Card className="divide-y divide-border">
            {notificaciones.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Sin notificaciones nuevas. Presente una declaración o cambie un estado desde el perfil Fiscalizador para verlas.</p>
            )}
            {notificaciones.map((n) => (
              <div key={n.id} className="p-4 text-sm">
                <p className="font-medium">{n.asunto}</p>
                <p className="mt-0.5 text-muted-foreground">{n.detalle}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {n.canal} · {fechaHora(n.ts)} · {n.codigo}
                </p>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </div>
  )
}
