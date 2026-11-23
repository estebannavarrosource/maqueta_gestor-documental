import { UMBRALES, tramitePorId, type TramiteId } from './catalog'
import type { Alerta, Declaracion } from './types'

export interface ResultadoAdmisibilidad {
  admisible: boolean
  motivos: string[]
  /** porcentaje de uso del umbral por variable */
  uso: { variable: string; valor: number; umbral: number; unidad: string }[]
}

type Proyecto = Declaracion['proyecto']

/** Regla de admisibilidad: solo bajo riesgo y sin alteración significativa del escurrimiento. */
export function evaluarAdmisibilidad(
  tramite: TramiteId,
  p: Proyecto,
  riesgoVida: boolean | null,
  alteraEscurrimiento: boolean | null,
): ResultadoAdmisibilidad {
  const motivos: string[] = []
  const uso: ResultadoAdmisibilidad['uso'] = []
  const familia = tramitePorId(tramite).familia

  if (riesgoVida) motivos.push('El proyecto declara riesgo para la vida, salud o bienes de la población.')
  if (alteraEscurrimiento) motivos.push('El proyecto altera de forma significativa el escurrimiento de las aguas.')

  const chequear = (variable: string, valor: number | undefined, umbral: number, unidad: string) => {
    if (valor === undefined || Number.isNaN(valor)) return
    uso.push({ variable, valor, umbral, unidad })
    if (valor > umbral)
      motivos.push(`${variable} (${valor} ${unidad}) supera el umbral de bajo riesgo (${umbral} ${unidad}).`)
  }

  if (familia === 'bocatoma') chequear('Caudal de captación', p.caudalLs, UMBRALES.caudalLs, 'l/s')
  if (familia === 'cauce') {
    chequear('Longitud intervenida', p.longitudM, UMBRALES.longitudM, 'm')
    chequear('Volumen de material', p.volumenM3, UMBRALES.volumenM3, 'm³')
  }
  if (familia === 'obra') {
    chequear('Altura del muro', p.alturaM, UMBRALES.alturaM, 'm')
    chequear('Capacidad de embalse', p.embalseM3, UMBRALES.embalseM3, 'm³')
  }

  return { admisible: motivos.length === 0, motivos, uso }
}

/** Reglas de revisión automatizada (EJEMPLOS, ver comentario C-15). */
export function evaluarAlertas(
  nueva: Pick<Declaracion, 'solicitante' | 'proyecto' | 'documentos' | 'tramite'>,
  existentes: Declaracion[],
): Alerta[] {
  const alertas: Alerta[] = []
  const adm = evaluarAdmisibilidad(nueva.tramite, nueva.proyecto, false, false)

  if (nueva.documentos.length === 0)
    alertas.push({
      id: 'A1',
      regla: 'Documentación incompleta',
      severidad: 'Alta',
      detalle: 'La declaración se presentó sin documentos adjuntos.',
    })

  const cercano = adm.uso.find((u) => u.valor >= u.umbral * 0.8 && u.valor <= u.umbral)
  if (cercano)
    alertas.push({
      id: 'A2',
      regla: 'Valor cercano al umbral',
      severidad: 'Media',
      detalle: `${cercano.variable}: ${cercano.valor} ${cercano.unidad} (${Math.round(
        (cercano.valor / cercano.umbral) * 100,
      )}% del umbral).`,
    })

  const mismoCauce = existentes.filter(
    (d) =>
      d.solicitante.rut === nueva.solicitante.rut &&
      d.proyecto.cauce.trim().toLowerCase() === nueva.proyecto.cauce.trim().toLowerCase(),
  )
  if (mismoCauce.length > 0)
    alertas.push({
      id: 'A3',
      regla: 'Posible fraccionamiento de proyecto',
      severidad: 'Media',
      detalle: `El mismo titular registra ${mismoCauce.length} declaración(es) previa(s) sobre "${nueva.proyecto.cauce}".`,
    })

  return alertas
}

/** Ruteo interno por región (ver comentario C-16). */
export const unidadPorRegion = (region: string) => `Oficina regional DGA — ${region}`
