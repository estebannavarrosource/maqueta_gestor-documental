export type Familia = 'bocatoma' | 'cauce' | 'obra'
export type Etapa = 'construccion' | 'recepcion'

export type TramiteId =
  | 'ABO'
  | 'RBO'
  | 'PMC'
  | 'RMC'
  | 'AOH'
  | 'ROH'

export interface Tramite {
  id: TramiteId
  nombre: string
  corto: string
  familia: Familia
  etapa: Etapa
  descripcion: string
}

export const TRAMITES: Tramite[] = [
  {
    id: 'ABO',
    nombre:
      'Autorización de proyectos de construcción, modificación, cambio y unificación de bocatomas',
    corto: 'Construcción de bocatomas',
    familia: 'bocatoma',
    etapa: 'construccion',
    descripcion: 'Habilita construir, modificar, cambiar o unificar una bocatoma.',
  },
  {
    id: 'RBO',
    nombre: 'Recepción de obras y autorización de operación de proyectos de bocatomas',
    corto: 'Recepción de bocatomas',
    familia: 'bocatoma',
    etapa: 'recepcion',
    descripcion: 'Declara terminada la obra y habilita su operación.',
  },
  {
    id: 'PMC',
    nombre: 'Permiso para efectuar modificaciones en cauces naturales o artificiales',
    corto: 'Modificación de cauces',
    familia: 'cauce',
    etapa: 'construccion',
    descripcion: 'Habilita intervenir un cauce natural o artificial.',
  },
  {
    id: 'RMC',
    nombre:
      'Recepción de obras y autorización de operación de proyectos de modificaciones de cauces naturales o artificiales',
    corto: 'Recepción de modificación de cauces',
    familia: 'cauce',
    etapa: 'recepcion',
    descripcion: 'Declara terminada la intervención del cauce.',
  },
  {
    id: 'AOH',
    nombre:
      'Autorización de proyectos de construcción de ciertas obras hidráulicas establecidas en el artículo 294° del Código de Aguas',
    corto: 'Obras hidráulicas (art. 294°)',
    familia: 'obra',
    etapa: 'construccion',
    descripcion: 'Habilita construir obras hidráulicas del art. 294°.',
  },
  {
    id: 'ROH',
    nombre:
      'Recepción de obras y autorización de operación de proyectos de construcción de ciertas obras hidráulicas establecidas en el artículo 294° del Código de Aguas',
    corto: 'Recepción de obras hidráulicas',
    familia: 'obra',
    etapa: 'recepcion',
    descripcion: 'Declara terminada la obra hidráulica y habilita su operación.',
  },
]

export const tramitePorId = (id: TramiteId) =>
  TRAMITES.find((t) => t.id === id) as Tramite

export const ESTADOS = [
  'Presentada',
  'Habilitada',
  'En fiscalización',
  'Paralizada',
  'Permiso revocado',
] as const
export type Estado = (typeof ESTADOS)[number]

export const REGIONES = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
]

/**
 * Umbrales FICTICIOS. Los umbrales reales los fijarán los decretos
 * pendientes de aprobación (ver comentario C-03).
 */
export const UMBRALES = {
  caudalLs: 100, // l/s, bocatomas
  longitudM: 500, // m, intervención de cauce
  volumenM3: 5000, // m3, extracción de material
  alturaM: 5, // m, muro de obra hidráulica
  embalseM3: 50000, // m3, capacidad de embalse
}

export const TIPOS_BOCATOMA = ['Lateral', 'Frontal', 'Sumergida / de fondo', 'Con compuerta', 'Otra']
export const TIPOS_INTERVENCION = [
  'Limpieza y mantención',
  'Rectificación',
  'Defensa fluvial',
  'Extracción de áridos',
  'Cruce (puente, tubería)',
  'Otra',
]
export const TIPOS_OBRA = ['Acueducto', 'Embalse', 'Muro / presa', 'Puente o alcantarilla', 'Otra']
