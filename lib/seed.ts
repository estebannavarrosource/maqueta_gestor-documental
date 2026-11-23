import type { Estado, TramiteId } from './catalog'
import { sumarDia } from './format'
import { unidadPorRegion } from './reglas'
import type { Alerta, Declaracion, Documento, Evento } from './types'

export const USUARIOS = {
  solicitante: { nombre: 'Camila Rojas Valdés', rut: '16.482.907-3', email: 'camila.rojas@ejemplo.cl' },
  ministro: { nombre: 'Patricio Vega Núñez', cargo: 'Ministro de fe — Oficina de Partes, Región de Ñuble' },
  analista: { nombre: 'Andrea Molina Fuentes', cargo: 'Analista DARH' },
  fiscalizador: { nombre: 'Rodrigo Herrera Díaz', cargo: 'Fiscalizador — Unidad de Fiscalización' },
}

const DOC = (nombre: string, tipo = 'PDF', tamano = '1,2 MB'): Documento => ({ nombre, tipo, tamano })

let n = 0
const ev = (
  ts: string,
  actor: string,
  perfil: string,
  accion: string,
  tipo: Evento['tipo'],
  detalle?: string,
): Evento => ({ id: `seed-${++n}`, ts, actor, perfil, accion, tipo, detalle })

interface Base {
  seq: number
  tramite: TramiteId
  estado: Estado
  presentada: string
  titular: string
  rut: string
  tipo?: 'Persona natural' | 'Persona jurídica'
  rep?: { nombre: string; rut: string }
  por?: Declaracion['presentadoPor']
  demo?: boolean
  nombre: string
  region: string
  comuna: string
  cauce: string
  desc: string
  extra: Partial<Declaracion['proyecto']>
  docs?: Documento[]
  alertas?: Alerta[]
  fisc?: Evento[]
  resolucion?: string
}

function crear(b: Base): Declaracion {
  const [y] = b.presentada.split('-')
  const codigo = `DJ-${b.tramite}-${y}-${String(b.seq).padStart(6, '0')}`
  const actor = b.por === 'Ministro de fe' ? USUARIOS.ministro.nombre : b.rep?.nombre ?? b.titular
  const perfil = b.por ?? 'Titular'
  const base = new Date(b.presentada).getTime()
  const t = (s: number) => new Date(base + s * 1000).toISOString()
  const habilitada = sumarDia(b.presentada)
  const eventos: Evento[] = [
    ev(b.presentada, actor, perfil, 'Declaración jurada presentada y firmada', 'usuario', 'Firma en línea con Clave Única'),
    ev(t(1), 'Sistema', 'Sistema', 'Certificado de Ingreso emitido', 'sistema', codigo),
    ev(t(2), 'Sistema', 'Sistema', 'Certificado publicado en sitio web DGA', 'sistema'),
    ev(t(3), 'Sistema', 'Sistema', 'Expediente remitido a unidad interna', 'sistema', unidadPorRegion(b.region)),
  ]
  if (b.estado !== 'Presentada')
    eventos.push(
      ev(habilitada, 'Sistema', 'Sistema', 'Habilitación automática: estado Habilitada', 'sistema', 'Efectos desde el día siguiente a la presentación'),
    )
  eventos.push(...(b.fisc ?? []))

  return {
    codigo,
    tramite: b.tramite,
    estado: b.estado,
    propietario: b.demo ? 'demo' : 'otro',
    presentadoPor: b.por ?? 'Titular',
    solicitante: {
      tipo: b.tipo ?? 'Persona natural',
      nombre: b.titular,
      rut: b.rut,
      email: 'contacto@ejemplo.cl',
      representante: b.rep,
    },
    proyecto: {
      nombre: b.nombre,
      region: b.region,
      comuna: b.comuna,
      cauce: b.cauce,
      este: '345120',
      norte: '6290455',
      huso: '19',
      descripcion: b.desc,
      ...b.extra,
    },
    firma: 'En línea (Clave Única)',
    presentadaEn: b.presentada,
    habilitadaDesde: habilitada,
    documentos: b.docs ?? [DOC('Memoria descriptiva.pdf'), DOC('Planos de ubicación y planta.pdf', 'PDF', '4,8 MB')],
    eventos,
    alertas: b.alertas ?? [],
    unidadDestino: unidadPorRegion(b.region),
    resolucionRevocacion: b.resolucion,
  }
}

export const SEED: Declaracion[] = [
  crear({
    seq: 41,
    tramite: 'ABO',
    estado: 'Habilitada',
    presentada: '2026-11-16T14:22:08.000Z',
    titular: 'Agrícola Los Aromos Ltda.',
    rut: '76.331.204-K',
    tipo: 'Persona jurídica',
    rep: { nombre: 'Camila Rojas Valdés', rut: '16.482.907-3' },
    por: 'Representante legal',
    demo: true,
    nombre: 'Nueva bocatoma canal Los Aromos',
    region: 'Ñuble',
    comuna: 'San Carlos',
    cauce: 'Río Ñuble',
    desc: 'Construcción de bocatoma lateral con compuerta para riego predial, captación de 60 l/s.',
    extra: { tipoBocatoma: 'Lateral', caudalLs: 60 },
  }),
  crear({
    seq: 42,
    tramite: 'PMC',
    estado: 'En fiscalización',
    presentada: '2026-11-16T16:05:41.000Z',
    titular: 'Inmobiliaria Valle Verde SpA',
    rut: '77.120.884-3',
    tipo: 'Persona jurídica',
    rep: { nombre: 'Jorge Illanes Soto', rut: '10.554.321-6' },
    por: 'Apoderado',
    nombre: 'Limpieza y rectificación estero Las Cruces',
    region: 'Valparaíso',
    comuna: 'Quillota',
    cauce: 'Estero Las Cruces',
    desc: 'Limpieza de cauce y rectificación puntual de riberas en un tramo de 420 m.',
    extra: { tipoIntervencion: 'Rectificación', longitudM: 420, volumenM3: 4300 },
    alertas: [
      { id: 'A2', regla: 'Valor cercano al umbral', severidad: 'Media', detalle: 'Longitud intervenida: 420 m (84% del umbral).' },
      { id: 'A2', regla: 'Valor cercano al umbral', severidad: 'Media', detalle: 'Volumen de material: 4300 m³ (86% del umbral).' },
    ],
    fisc: [
      ev('2026-11-19T09:12:30.000Z', 'Rodrigo Herrera Díaz', 'Fiscalizador', 'Cambio de estado: En fiscalización', 'fiscalizacion', 'Visita a terreno programada por alerta de umbral.'),
    ],
  }),
  crear({
    seq: 43,
    tramite: 'AOH',
    estado: 'Paralizada',
    presentada: '2026-11-17T10:40:15.000Z',
    titular: 'Comunidad de Aguas Canal El Peumo',
    rut: '65.220.118-7',
    tipo: 'Persona jurídica',
    rep: { nombre: 'Lorena Pizarro Araya', rut: '9.887.452-1' },
    por: 'Representante legal',
    nombre: 'Muro de contención y mini embalse El Peumo',
    region: 'Coquimbo',
    comuna: 'Ovalle',
    cauce: 'Quebrada El Peumo',
    desc: 'Muro de contención de 4,5 m para acumulación nocturna de agua de riego.',
    extra: { tipoObra: 'Muro / presa', alturaM: 4.5, embalseM3: 41000 },
    docs: [DOC('Memoria descriptiva.pdf')],
    alertas: [
      { id: 'A2', regla: 'Valor cercano al umbral', severidad: 'Media', detalle: 'Altura del muro: 4.5 m (90% del umbral).' },
    ],
    fisc: [
      ev('2026-11-19T11:00:02.000Z', 'Rodrigo Herrera Díaz', 'Fiscalizador', 'Cambio de estado: En fiscalización', 'fiscalizacion'),
      ev('2026-11-21T15:31:47.000Z', 'Rodrigo Herrera Díaz', 'Fiscalizador', 'Cambio de estado: Paralizada', 'fiscalizacion', 'La altura medida en terreno (5,8 m) supera lo declarado. Se ordena paralizar las obras.'),
    ],
  }),
  crear({
    seq: 44,
    tramite: 'RBO',
    estado: 'Permiso revocado',
    presentada: '2026-11-17T12:15:00.000Z',
    titular: 'Sergio Muñoz Cárcamo',
    rut: '8.221.903-4',
    nombre: 'Recepción bocatoma fundo Santa Marta',
    region: 'Maule',
    comuna: 'Linares',
    cauce: 'Río Ancoa',
    desc: 'Recepción de bocatoma terminada, captación de 45 l/s.',
    extra: { tipoBocatoma: 'Frontal', caudalLs: 45, autorizacionPrevia: 'DJ-ABO-2026-000012' },
    docs: [],
    alertas: [
      { id: 'A1', regla: 'Documentación incompleta', severidad: 'Alta', detalle: 'La declaración se presentó sin documentos adjuntos.' },
    ],
    fisc: [
      ev('2026-11-18T15:00:10.000Z', 'Rodrigo Herrera Díaz', 'Fiscalizador', 'Cambio de estado: En fiscalización', 'fiscalizacion'),
      ev('2026-11-20T17:45:22.000Z', 'Rodrigo Herrera Díaz', 'Fiscalizador', 'Cambio de estado: Permiso revocado', 'fiscalizacion', 'Falsedad en la información: la bocatoma declarada no existe en el punto indicado.'),
    ],
    resolucion: 'Res. Ex. DGA N° 1.204 del 20-11-2026',
  }),
  crear({
    seq: 45,
    tramite: 'ROH',
    estado: 'Habilitada',
    presentada: '2026-11-18T08:50:33.000Z',
    titular: 'Marta Elena Quiroga Salas',
    rut: '11.402.776-9',
    nombre: 'Recepción acueducto predio El Maitén',
    region: 'Los Lagos',
    comuna: 'Osorno',
    cauce: 'Río Rahue',
    desc: 'Acueducto de 1,2 km para abastecimiento predial.',
    extra: { tipoObra: 'Acueducto', alturaM: 0, embalseM3: 0, autorizacionPrevia: 'DJ-AOH-2026-000019' },
  }),
  crear({
    seq: 46,
    tramite: 'PMC',
    estado: 'Habilitada',
    presentada: '2026-11-19T15:02:19.000Z',
    titular: 'Constructora Andes del Sur S.A.',
    rut: '96.771.350-2',
    tipo: 'Persona jurídica',
    rep: { nombre: 'Patricio Vega Núñez', rut: '12.998.441-0' },
    por: 'Ministro de fe',
    nombre: 'Cruce de tubería bajo estero Pelequén',
    region: "O'Higgins",
    comuna: 'Malloa',
    cauce: 'Estero Pelequén',
    desc: 'Cruce subterráneo de tubería de agua potable rural bajo el lecho del estero.',
    extra: { tipoIntervencion: 'Cruce (puente, tubería)', longitudM: 35, volumenM3: 120 },
  }),
  crear({
    seq: 47,
    tramite: 'ABO',
    estado: 'Habilitada',
    presentada: '2026-11-20T09:31:04.000Z',
    titular: 'Camila Rojas Valdés',
    rut: '16.482.907-3',
    demo: true,
    nombre: 'Cambio de ubicación bocatoma parcela 7',
    region: 'Ñuble',
    comuna: 'Chillán Viejo',
    cauce: 'Río Chillán',
    desc: 'Traslado de bocatoma 80 m aguas arriba por socavación de ribera.',
    extra: { tipoBocatoma: 'Lateral', caudalLs: 85 },
    alertas: [
      { id: 'A2', regla: 'Valor cercano al umbral', severidad: 'Media', detalle: 'Caudal de captación: 85 l/s (85% del umbral).' },
    ],
  }),
  crear({
    seq: 48,
    tramite: 'AOH',
    estado: 'Presentada',
    presentada: '2026-11-22T18:44:50.000Z',
    titular: 'Camila Rojas Valdés',
    rut: '16.482.907-3',
    demo: true,
    nombre: 'Alcantarilla acceso predio Los Pellines',
    region: 'Ñuble',
    comuna: 'Coihueco',
    cauce: 'Estero Pellines',
    desc: 'Alcantarilla de hormigón para acceso vehicular al predio.',
    extra: { tipoObra: 'Puente o alcantarilla', alturaM: 1.2, embalseM3: 0 },
  }),
]
