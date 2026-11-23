'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { tramitePorId, type Estado } from './catalog'
import { sumarDia } from './format'
import { evaluarAlertas, unidadPorRegion } from './reglas'
import { SEED, USUARIOS } from './seed'
import type { Declaracion, Evento, Notificacion, Rol } from './types'

export type NuevaDeclaracion = Pick<
  Declaracion,
  'tramite' | 'solicitante' | 'proyecto' | 'documentos' | 'firma' | 'presentadoPor'
>

interface Store {
  rol: Rol
  setRol: (r: Rol) => void
  notas: boolean
  setNotas: (v: boolean) => void
  declaraciones: Declaracion[]
  notificaciones: Notificacion[]
  presentar: (d: NuevaDeclaracion) => Declaracion
  cambiarEstado: (codigo: string, estado: Estado, motivo: string, resolucion?: string) => void
  avanzarDia: (codigo: string) => void
  obtener: (codigo: string) => Declaracion | undefined
}

const Ctx = createContext<Store | null>(null)

export const nombreRol: Record<Rol, string> = {
  publico: 'Ciudadano (público)',
  solicitante: 'Solicitante / Representante / Apoderado',
  ministro: 'Ministro de fe',
  analista: 'Analista DARH',
  fiscalizador: 'Fiscalizador',
}

let contador = 0
const nuevoId = () => `ev-${Date.now()}-${++contador}`

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [rol, setRol] = useState<Rol>('publico')
  const [notas, setNotas] = useState(true)
  const [declaraciones, setDeclaraciones] = useState<Declaracion[]>(SEED)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const r = q.get('rol') as Rol | null
    if (r && r in nombreRol) setRol(r)
    if (q.get('notas') === '0') setNotas(false)
  }, [])

  const obtener = useCallback((codigo: string) => declaraciones.find((d) => d.codigo === codigo), [declaraciones])

  const presentar = useCallback(
    (d: NuevaDeclaracion) => {
      const ahora = new Date().toISOString()
      const anio = ahora.slice(0, 4)
      const seq = declaraciones.length + 41
      const codigo = `DJ-${d.tramite}-${anio}-${String(seq).padStart(6, '0')}`
      const actor =
        d.presentadoPor === 'Ministro de fe'
          ? USUARIOS.ministro.nombre
          : d.solicitante.representante?.nombre ?? d.solicitante.nombre
      const t = (ms: number) => new Date(Date.now() + ms).toISOString()
      const unidad = unidadPorRegion(d.proyecto.region)
      const alertas = evaluarAlertas(d, declaraciones)

      const eventos: Evento[] = [
        { id: nuevoId(), ts: ahora, actor, perfil: d.presentadoPor, tipo: 'usuario', accion: 'Declaración jurada presentada y firmada', detalle: d.firma },
        { id: nuevoId(), ts: t(400), actor: 'Sistema', perfil: 'Sistema', tipo: 'sistema', accion: 'Validación de admisibilidad: bajo riesgo', detalle: 'Umbrales referenciales (ficticios)' },
        { id: nuevoId(), ts: t(800), actor: 'Sistema', perfil: 'Sistema', tipo: 'sistema', accion: 'Certificado de Ingreso emitido', detalle: codigo },
        { id: nuevoId(), ts: t(1200), actor: 'Sistema', perfil: 'Sistema', tipo: 'sistema', accion: 'Certificado publicado en sitio web DGA' },
        { id: nuevoId(), ts: t(1600), actor: 'Sistema', perfil: 'Sistema', tipo: 'sistema', accion: 'Expediente remitido a unidad interna', detalle: unidad },
        ...alertas.map<Evento>((a, i) => ({
          id: nuevoId(),
          ts: t(2000 + i * 200),
          actor: 'Sistema',
          perfil: 'Sistema',
          tipo: 'sistema',
          accion: `Alerta automática: ${a.regla}`,
          detalle: a.detalle,
        })),
      ]

      const nueva: Declaracion = {
        ...d,
        codigo,
        estado: 'Presentada',
        propietario: 'demo',
        presentadaEn: ahora,
        habilitadaDesde: sumarDia(ahora),
        eventos,
        alertas,
        unidadDestino: unidad,
      }
      setDeclaraciones((prev) => [nueva, ...prev])
      setNotificaciones((prev) => [
        {
          id: nuevoId(),
          codigo,
          ts: t(2500),
          asunto: 'Certificado de Ingreso emitido',
          detalle: `Su declaración ${codigo} fue presentada. Producirá efectos habilitantes desde el día siguiente.`,
          canal: 'Correo',
        },
        ...prev,
      ])
      return nueva
    },
    [declaraciones],
  )

  const cambiarEstado = useCallback<Store['cambiarEstado']>((codigo, estado, motivo, resolucion) => {
    const ahora = new Date().toISOString()
    const actor = USUARIOS.fiscalizador.nombre
    setDeclaraciones((prev) =>
      prev.map((d) =>
        d.codigo !== codigo
          ? d
          : {
              ...d,
              estado,
              resolucionRevocacion: estado === 'Permiso revocado' ? resolucion : d.resolucionRevocacion,
              eventos: [
                ...d.eventos,
                {
                  id: nuevoId(),
                  ts: ahora,
                  actor,
                  perfil: 'Fiscalizador',
                  tipo: 'fiscalizacion',
                  accion: `Cambio de estado: ${estado}`,
                  detalle: resolucion ? `${motivo} (${resolucion})` : motivo,
                },
                {
                  id: nuevoId(),
                  ts: new Date(Date.now() + 300).toISOString(),
                  actor: 'Sistema',
                  perfil: 'Sistema',
                  tipo: 'sistema',
                  accion: 'Notificación enviada al solicitante',
                  detalle: `Nuevo estado: ${estado}`,
                },
              ],
            },
      ),
    )
    setNotificaciones((prev) => [
      {
        id: nuevoId(),
        codigo,
        ts: ahora,
        asunto: `Cambio de estado: ${estado}`,
        detalle: motivo,
        canal: 'Correo',
      },
      ...prev,
    ])
  }, [])

  const avanzarDia = useCallback((codigo: string) => {
    setDeclaraciones((prev) =>
      prev.map((d) =>
        d.codigo !== codigo || d.estado !== 'Presentada'
          ? d
          : {
              ...d,
              estado: 'Habilitada',
              eventos: [
                ...d.eventos,
                {
                  id: nuevoId(),
                  ts: d.habilitadaDesde,
                  actor: 'Sistema',
                  perfil: 'Sistema',
                  tipo: 'sistema',
                  accion: 'Habilitación automática: estado Habilitada',
                  detalle: 'Efectos desde el día siguiente a la presentación',
                },
              ],
            },
      ),
    )
  }, [])

  const value = useMemo(
    () => ({ rol, setRol, notas, setNotas, declaraciones, notificaciones, presentar, cambiarEstado, avanzarDia, obtener }),
    [rol, notas, declaraciones, notificaciones, presentar, cambiarEstado, avanzarDia, obtener],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore fuera de StoreProvider')
  return v
}

export { tramitePorId }
