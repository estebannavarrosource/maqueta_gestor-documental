export type Cobertura = 'Cubierto' | 'Parcial' | 'No incluido'

export interface Requisito {
  id: string
  origen: string
  requisito: string
  cobertura: Cobertura
  pantalla: string
  observacion: string
  notas: string[]
}

export const MATRIZ: Requisito[] = [
  { id: 'R-01', origen: 'd) Alcance', requisito: 'Registrar los 6 trámites como técnica habilitante alternativa', cobertura: 'Cubierto', pantalla: 'Presentar DJ, paso 1', observacion: 'Se usan códigos propios por trámite.', notas: ['C-06'] },
  { id: 'R-02', origen: 'd) y g)', requisito: 'Excluir proyectos de alto riesgo o con alteración significativa del escurrimiento', cobertura: 'Parcial', pantalla: 'Presentar DJ, paso 4', observacion: 'Validación con umbrales ficticios.', notas: ['C-03'] },
  { id: 'R-03', origen: 'e) Perfiles', requisito: 'Solicitante, Representante Legal y Apoderado acceden al mismo expediente', cobertura: 'Parcial', pantalla: 'Expediente > Resumen', observacion: 'Se muestran los accesos; no hay autenticación real ni validación del poder.', notas: ['C-07'] },
  { id: 'R-04', origen: 'e) Perfiles', requisito: 'Ministro de fe crea y edita antes de la firma (casos especiales)', cobertura: 'Parcial', pantalla: 'Presentar DJ (modo asistido)', observacion: 'Flujo propuesto, sin definición oficial.', notas: ['C-08'] },
  { id: 'R-05', origen: 'e) Perfiles', requisito: 'Analista consulta; Fiscalizador cambia estado y puede revocar', cobertura: 'Cubierto', pantalla: 'Bandeja interna, Expediente', observacion: 'Autenticación institucional simulada.', notas: ['C-17'] },
  { id: 'R-06', origen: 'f) Hito 1', requisito: 'Presentación mediante formulario digital estandarizado', cobertura: 'Parcial', pantalla: 'Presentar DJ', observacion: 'Campos propuestos por familia de trámite.', notas: ['C-04', 'C-05'] },
  { id: 'R-07', origen: 'g) Firma obligatoria', requisito: 'No se presenta sin declaración del titular en línea o declaración adjunta', cobertura: 'Parcial', pantalla: 'Presentar DJ, paso 6', observacion: 'Firma simulada con Clave Única.', notas: ['C-09'] },
  { id: 'R-08', origen: 'g) Única vía', requisito: 'Ingreso exclusivo por SUPER', cobertura: 'No incluido', pantalla: '-', observacion: 'Contradice el canal transitorio DGA.', notas: ['C-02', 'C-24'] },
  { id: 'R-09', origen: 'g) Habilitación automática', requisito: 'Efectos habilitantes desde el día siguiente a la presentación válida', cobertura: 'Cubierto', pantalla: 'Certificado, Expediente', observacion: 'Día corrido; regla de cómputo por definir.', notas: ['C-10'] },
  { id: 'R-10', origen: 'g) Certificación inmediata', requisito: 'Certificado de Ingreso automático, sin intervención humana', cobertura: 'Parcial', pantalla: 'Certificado', observacion: 'Sin firma electrónica institucional real.', notas: ['C-10'] },
  { id: 'R-11', origen: 'g) Presunción de conocimiento', requisito: 'Publicación en web DGA, máximo el día siguiente', cobertura: 'Parcial', pantalla: 'Registro público', observacion: 'Registro dentro de la maqueta; no se integra con el sitio institucional.', notas: ['C-11', 'C-12'] },
  { id: 'R-12', origen: 'g) Trazabilidad extrema', requisito: 'Registrar toda actuación con fecha, hora, minuto y segundo', cobertura: 'Parcial', pantalla: 'Expediente > Historial', observacion: 'Visible al segundo; sin garantía de inalterabilidad.', notas: ['C-19'] },
  { id: 'R-13', origen: 'g) Integridad del expediente', requisito: 'Datos y documentos alimentan el expediente electrónico unificado', cobertura: 'Parcial', pantalla: 'Expediente', observacion: 'Sin integración con SUPER.', notas: ['C-22', 'C-24'] },
  { id: 'R-14', origen: 'g) Comunicación interna', requisito: 'Remitir automáticamente a los perfiles que se determinen, a más tardar el día siguiente', cobertura: 'Parcial', pantalla: 'Bandeja interna', observacion: 'Ruteo por región propuesto.', notas: ['C-16'] },
  { id: 'R-15', origen: 'g) Acceso público', requisito: 'Registro de declaraciones y certificados público y gratuito', cobertura: 'Cubierto', pantalla: 'Registro público', observacion: 'Campos públicos por definir.', notas: ['C-11', 'C-12'] },
  { id: 'R-16', origen: 'g) Alertas', requisito: 'Notificar al solicitante cambios de estado por fiscalización', cobertura: 'Parcial', pantalla: 'Expediente > Notificaciones', observacion: 'Notificación simulada; sin canal real.', notas: ['C-20'] },
  { id: 'R-17', origen: 'c) Objetivo específico 2', requisito: 'Alertas ante revisión automatizada de las DD.JJ.', cobertura: 'Parcial', pantalla: 'Bandeja interna', observacion: 'Tres reglas de ejemplo.', notas: ['C-15'] },
  { id: 'R-18', origen: 'e) y f) Hito 3', requisito: 'Paralizar y revocar la habilitación (estado "Permiso Revocado")', cobertura: 'Cubierto', pantalla: 'Expediente > Fiscalización', observacion: 'Debido proceso por definir.', notas: ['C-13', 'C-14'] },
  { id: 'R-19', origen: 'h) Datos', requisito: 'Historial visible de cada acción, código por trámite y acceso a documentos', cobertura: 'Cubierto', pantalla: 'Expediente', observacion: 'Almacenamiento real en bases DTI no incluido.', notas: ['C-24'] },
  { id: 'R-20', origen: 'i) Reportes', requisito: 'Reporte con datos del trámite, solicitante y proyecto en pantalla interna', cobertura: 'Parcial', pantalla: 'Reportes', observacion: 'Exportación simulada.', notas: ['C-18'] },
  { id: 'R-21', origen: 'j) Integraciones', requisito: 'Interoperabilidad estandarizada con SUPER', cobertura: 'No incluido', pantalla: '-', observacion: 'Manual SUPER en desarrollo.', notas: ['C-24'] },
  { id: 'R-22', origen: 'k) Ambiente de pruebas', requisito: 'Ambiente de pruebas previo a la puesta en marcha', cobertura: 'Parcial', pantalla: 'Toda la maqueta', observacion: 'La maqueta sirve de base; falta fecha oficial.', notas: ['C-01', 'C-26'] },
  { id: 'R-23', origen: 'm) Soporte', requisito: 'Mesa de ayuda y mantención', cobertura: 'No incluido', pantalla: 'Pie de página (referencia)', observacion: 'Sin horarios ni niveles de servicio.', notas: ['C-23'] },
]
