import type { Estado, TramiteId } from './catalog'

export type Rol = 'publico' | 'solicitante' | 'ministro' | 'analista' | 'fiscalizador'

export interface Evento {
  id: string
  ts: string // ISO con milisegundos
  actor: string
  perfil: string
  accion: string
  detalle?: string
  tipo: 'usuario' | 'sistema' | 'fiscalizacion'
}

export interface Documento {
  nombre: string
  tipo: string
  tamano: string
}

export interface Alerta {
  id: string
  regla: string
  severidad: 'Alta' | 'Media' | 'Baja'
  detalle: string
}

export interface Notificacion {
  id: string
  codigo: string
  ts: string
  asunto: string
  detalle: string
  canal: 'Correo' | 'Buzón Clave Única'
}

export interface Declaracion {
  codigo: string
  tramite: TramiteId
  estado: Estado
  propietario: 'demo' | 'otro'
  presentadoPor: 'Titular' | 'Representante legal' | 'Apoderado' | 'Ministro de fe'
  solicitante: {
    tipo: 'Persona natural' | 'Persona jurídica'
    nombre: string
    rut: string
    email: string
    representante?: { nombre: string; rut: string }
  }
  proyecto: {
    nombre: string
    region: string
    comuna: string
    cauce: string
    este: string
    norte: string
    huso: '18' | '19'
    descripcion: string
    autorizacionPrevia?: string
    caudalLs?: number
    tipoBocatoma?: string
    longitudM?: number
    volumenM3?: number
    tipoIntervencion?: string
    tipoObra?: string
    alturaM?: number
    embalseM3?: number
  }
  firma: 'En línea (Clave Única)' | 'Declaración adjunta'
  presentadaEn: string // ISO
  habilitadaDesde: string // ISO (día siguiente)
  documentos: Documento[]
  eventos: Evento[]
  alertas: Alerta[]
  unidadDestino: string
  resolucionRevocacion?: string
}
