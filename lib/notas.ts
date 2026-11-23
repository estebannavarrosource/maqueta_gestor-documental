export type Prioridad = 'Crítico' | 'Importante' | 'Deseable'
export type TipoNota = 'Contradicción' | 'Falta definición' | 'Faltante funcional' | 'Faltante no funcional'

export interface Nota {
  id: string
  tipo: TipoNota
  prioridad: Prioridad
  titulo: string
  detalle: string
  pregunta: string
  pantalla: string
  fuente: string
}

/**
 * Fuente única de comentarios: se muestran como marcadores en la maqueta
 * y como listado en el informe PDF.
 */
export const NOTAS: Nota[] = [
  {
    id: 'C-01',
    tipo: 'Contradicción',
    prioridad: 'Crítico',
    titulo: 'Fecha de puesta en marcha',
    detalle:
      'La ficha fija plazo de implementación al 31-dic-2026 y ambiente de pruebas al 01-dic-2026. El correo indica que la solución debe operar desde enero de 2027. La ficha además figura como V.1 y el archivo como v.2.',
    pregunta:
      '¿Cuál es el hito oficial de entrada en operación y cuál la fecha de pruebas (UAT)? ¿Habrá piloto con algunas oficinas regionales antes del lanzamiento?',
    pantalla: 'General',
    fuente: 'Ficha letra a) y k); correo del negocio',
  },
  {
    id: 'C-02',
    tipo: 'Contradicción',
    prioridad: 'Crítico',
    titulo: 'Canal de ingreso: SUPER vs. formulario DGA',
    detalle:
      'La regla de negocio "Única vía" exige ingreso exclusivamente por SUPER. La ficha (flujo, hito 1) dice "en principio vía DGA y posteriormente SUPER", y el correo confirma que SUPER no estará habilitado hasta avanzado 2027 (art. 11° transitorio Ley 21.770).',
    pregunta:
      'Confirmar que el canal transitorio es un formulario propio DGA y que la regla "Única vía" aplicará solo cuando exista SUPER. ¿Qué ocurre con las DD.JJ. ingresadas por el canal transitorio cuando llegue SUPER (migración o convivencia)?',
    pantalla: 'Inicio',
    fuente: 'Ficha letra f) y g); correo del negocio',
  },
  {
    id: 'C-03',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Umbrales de bajo riesgo',
    detalle:
      'Los decretos que fijan los umbrales entre autorización y declaración jurada aún no están aprobados. La maqueta usa valores ficticios (p. ej. 100 l/s, 5 m de muro).',
    pregunta:
      '¿Qué variables, unidades y umbrales definirá cada decreto, por trámite? ¿Deben poder modificarse sin desarrollo (parámetros administrables)? ¿Qué mensaje legal se muestra al usuario cuando el proyecto no es admisible?',
    pantalla: 'Admisibilidad',
    fuente: 'Ficha letra g) Alcance del riesgo; correo del negocio',
  },
  {
    id: 'C-04',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Contenido de los formularios por trámite',
    detalle:
      'La ficha habla de "formularios digitales estandarizados dispuestos por el Servicio", pero no los adjunta. La maqueta propone campos genéricos para tres familias (bocatomas, cauces, obras del art. 294°).',
    pregunta:
      'Entregar los formularios oficiales de los 6 trámites: campos, obligatoriedad, listas de valores, validaciones y textos de ayuda.',
    pantalla: 'Proyecto',
    fuente: 'Ficha letra f) hito 1 y g) Única vía',
  },
  {
    id: 'C-05',
    tipo: 'Faltante funcional',
    prioridad: 'Importante',
    titulo: 'Ubicación georreferenciada',
    detalle:
      'La maqueta pide coordenadas UTM de forma manual. No está definido si se requiere mapa, carga de KMZ/shapefile o validación contra capas de la DGA.',
    pregunta:
      '¿Selector en mapa o ingreso manual? ¿Datum y huso oficiales? ¿Se integra con el SIG/IDE de la DGA para validar comuna, cuenca, cauce y zonas restringidas?',
    pantalla: 'Proyecto',
    fuente: 'No cubierto por la ficha',
  },
  {
    id: 'C-06',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Vínculo entre construcción y recepción',
    detalle:
      'Los tres trámites de "Recepción de obras" suponen una autorización o DJ previa de construcción. La maqueta pide el código de la autorización previa, pero no se sabe si es obligatorio ni cómo se valida.',
    pregunta:
      '¿Se valida contra expedientes anteriores (incluidas resoluciones tradicionales de la DGA)? ¿Qué pasa con obras antiguas sin expediente digital?',
    pantalla: 'Trámite',
    fuente: 'Ficha letra a) Trámites',
  },
  {
    id: 'C-07',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Acreditación de representación y co-edición',
    detalle:
      'Solicitante, Representante Legal y Apoderado acceden al mismo expediente. No se define cómo se valida el poder (Clave Tributaria SII, escritura, poder simple), su vigencia, ni qué perfil puede firmar y cuál solo editar.',
    pregunta:
      '¿Quién puede firmar la declaración? ¿Se necesitan firmas múltiples (p. ej. cotitulares)? ¿Qué documentos acreditan el mandato y quién los revisa?',
    pantalla: 'Solicitante',
    fuente: 'Ficha letra e) Perfiles',
  },
  {
    id: 'C-08',
    tipo: 'Faltante funcional',
    prioridad: 'Importante',
    titulo: 'Flujo del Ministro de fe (ingreso asistido)',
    detalle:
      'El perfil existe "solo para casos especiales, símil apoderado", pero no se describe el flujo. El correo menciona además una contingencia manual en oficinas de partes si no se alcanza la solución TI.',
    pregunta:
      '¿Quién designa a los ministros de fe? ¿Cómo se verifica la identidad presencial del titular? ¿Se escanea una declaración manuscrita? ¿Se necesita una planilla de respaldo para la contingencia?',
    pantalla: 'Solicitante',
    fuente: 'Ficha letra e); correo del negocio',
  },
  {
    id: 'C-09',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Tipo de firma y texto legal',
    detalle:
      'La regla exige "declaración del titular en línea" o "declaración adjunta, según corresponda". No se define si basta Clave Única más aceptación (firma electrónica simple) o si se requiere firma electrónica avanzada, ni el texto oficial de la declaración.',
    pregunta:
      '¿Cuándo aplica cada alternativa? ¿Cuál es el texto jurídico oficial y las advertencias por falsedad (a validar con Fiscalía/Jurídica)?',
    pantalla: 'Firma',
    fuente: 'Ficha letra g) Firma obligatoria',
  },
  {
    id: 'C-10',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Certificado de Ingreso y cómputo del "día siguiente"',
    detalle:
      'No hay formato oficial del certificado ni regla de cómputo del plazo. La maqueta muestra un certificado propuesto con código de verificación.',
    pregunta:
      '¿Qué lleva el certificado (folio, sello de tiempo, firma electrónica institucional, QR)? ¿"Día siguiente" es corrido o hábil? ¿Cómo se trata un ingreso en feriado o fuera de horario, y la zona horaria de Isla de Pascua y Magallanes?',
    pantalla: 'Certificado',
    fuente: 'Ficha letra c) y g) Habilitación automática y Certificación inmediata',
  },
  {
    id: 'C-11',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Datos publicados y protección de datos personales',
    detalle:
      'El registro es público y gratuito. La maqueta publica el nombre del titular pero no el RUT, correo ni domicilio. No se definió qué campos son públicos ni cómo se publica en el sitio web DGA.',
    pregunta:
      '¿Qué campos se publican (Ley 19.628 y nueva ley de datos personales)? ¿Publicación por API hacia el sitio web DGA o módulo embebido? ¿Plazo máximo de publicación (el día siguiente)?',
    pantalla: 'Registro público',
    fuente: 'Ficha letra g) Acceso público y Presunción de conocimiento',
  },
  {
    id: 'C-12',
    tipo: 'Faltante funcional',
    prioridad: 'Deseable',
    titulo: 'Funciones del registro público',
    detalle:
      'La maqueta ofrece búsqueda y filtros básicos. No hay mapa, descarga masiva ni datos abiertos porque la ficha no los pide.',
    pregunta:
      '¿Se requiere mapa de obras, filtros por cuenca/cauce, descarga CSV o API de datos abiertos, y verificación del certificado por QR?',
    pantalla: 'Registro público',
    fuente: 'Ficha letra g) Acceso público',
  },
  {
    id: 'C-13',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Catálogo de estados y transiciones',
    detalle:
      'La ficha define solo "Permiso Revocado" y menciona "paralización". La maqueta propone: Presentada, Habilitada, En fiscalización, Paralizada y Permiso revocado.',
    pregunta:
      '¿Es correcto el catálogo? ¿Es reversible la revocación o paralización? ¿Existen estados de término de obra, desistimiento, modificación o caducidad?',
    pantalla: 'Expediente',
    fuente: 'Ficha letra e) Fiscalizador y f) hito 3',
  },
  {
    id: 'C-14',
    tipo: 'Falta definición',
    prioridad: 'Crítico',
    titulo: 'Debido proceso en paralización y revocación',
    detalle:
      'La ficha no contempla descargos del titular, plazos ni recursos, ni la resolución que sustenta la paralización o revocación. La maqueta exige motivo y número de resolución.',
    pregunta:
      '¿Se debe adjuntar la resolución? ¿Hay etapa de descargos antes de revocar? ¿Qué notifica el sistema y con qué plazos? (a validar con la División Jurídica).',
    pantalla: 'Fiscalización',
    fuente: 'Ficha letra f) hito 3; letra g) Alertas',
  },
  {
    id: 'C-15',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Reglas de revisión automatizada y alertas',
    detalle:
      'El objetivo habla de "alertas ante la revisión automatizada" pero no se especifican reglas. La maqueta implementa tres de ejemplo: documentación incompleta, valor cercano al umbral y posible fraccionamiento.',
    pregunta:
      '¿Qué reglas se esperan (superposición con otros proyectos, historial de revocaciones del titular, derechos de agua, áreas protegidas)? ¿Severidad, destinatario y acción que dispara cada una?',
    pantalla: 'Bandeja interna',
    fuente: 'Ficha letra c) Soporte a la fiscalización posterior',
  },
  {
    id: 'C-16',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Ruteo interno y plazo de revisión',
    detalle:
      'La regla dice remitir el expediente "a los perfiles que se determinen, a más tardar el día siguiente". La maqueta rutea por región de la obra.',
    pregunta:
      '¿Criterio de ruteo (región, trámite, nivel central)? ¿Reasignación entre unidades? ¿Se revisa el 100% o por muestreo y con qué plazo (SLA)?',
    pantalla: 'Bandeja interna',
    fuente: 'Ficha letra g) Comunicación interna',
  },
  {
    id: 'C-17',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Perfiles internos y autenticación',
    detalle:
      'Se listan Analista (consultar) y Fiscalizador (cambiar estado) con acceso "ELDAP", y la observación "Funcionarios DARH". Faltan administrador de parámetros, jefaturas, auditor y mesa de ayuda. Las siglas ELDAP y DARH no están explicadas.',
    pregunta:
      '¿Qué significan ELDAP y DARH? ¿Alcance territorial por perfil (central/regional)? ¿Qué perfiles adicionales se requieren y qué ven (datos enmascarados para mesa de ayuda)?',
    pantalla: 'Bandeja interna',
    fuente: 'Ficha letra e) Perfiles de usuario',
  },
  {
    id: 'C-18',
    tipo: 'Faltante funcional',
    prioridad: 'Importante',
    titulo: 'Contenido de los reportes',
    detalle:
      'La ficha pide un reporte con "datos del trámite, solicitante, descripción del proyecto y otros criterios que se determinen". La maqueta muestra totales por trámite, región y estado con exportación simulada.',
    pregunta:
      '¿Qué indicadores, filtros, periodicidad y formatos (Excel/PDF) se necesitan? ¿Se alimenta algún sistema de BI?',
    pantalla: 'Reportes',
    fuente: 'Ficha letra i) Reportes y consultas',
  },
  {
    id: 'C-19',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Trazabilidad al segundo e inalterabilidad',
    detalle:
      'Se exige registrar cada actuación con fecha, hora, minuto y segundo. La maqueta muestra la bitácora, pero no hay fuente horaria oficial ni garantía de inalterabilidad.',
    pregunta:
      '¿Fuente horaria oficial (NTP / hora oficial de Chile)? ¿Se registra IP, dispositivo y usuario? ¿Se exige registro inalterable (hash encadenado) y exportable como evidencia legal? ¿Plazo de retención?',
    pantalla: 'Historial',
    fuente: 'Ficha letra g) Trazabilidad extrema; letra h)',
  },
  {
    id: 'C-20',
    tipo: 'Faltante funcional',
    prioridad: 'Importante',
    titulo: 'Notificaciones',
    detalle:
      'Se pide notificar al solicitante los cambios de estado por fiscalización. No se definen canales, plantillas ni qué ocurre si la notificación falla.',
    pregunta:
      '¿Correo, buzón de Clave Única o SUPER? ¿Acuse de recibo? ¿Se notifica a terceros o se permite suscripción por cuenca/cauce?',
    pantalla: 'Notificaciones',
    fuente: 'Ficha letra g) Alertas',
  },
  {
    id: 'C-21',
    tipo: 'Faltante funcional',
    prioridad: 'Importante',
    titulo: 'Modificación, rectificación y desistimiento',
    detalle:
      'La ficha no trata qué ocurre si el titular debe corregir una DJ ya presentada, cambiar de apoderado, ampliar el proyecto o desistirse. La maqueta no lo incluye.',
    pregunta:
      '¿Una modificación genera una nueva DJ y un nuevo certificado? ¿Quién puede rectificar y hasta cuándo? ¿Cómo se registra el desistimiento?',
    pantalla: 'Expediente',
    fuente: 'No cubierto por la ficha',
  },
  {
    id: 'C-22',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Documentos adjuntos',
    detalle:
      'Los adjuntos de la maqueta son simulados. No se conocen los documentos exigibles por trámite, formatos (PDF, DWG, KMZ), tamaños ni si requieren firma de profesional.',
    pregunta:
      '¿Lista de documentos por trámite y obligatoriedad? ¿Límites de tamaño, antivirus y firma de profesional competente en planos?',
    pantalla: 'Documentos',
    fuente: 'Ficha letra g) Firma obligatoria; letra h)',
  },
  {
    id: 'C-23',
    tipo: 'Faltante no funcional',
    prioridad: 'Importante',
    titulo: 'Requisitos no funcionales y mesa de ayuda',
    detalle:
      'No hay volumen esperado de DD.JJ., concurrencia, disponibilidad (el certificado es inmediato, lo que sugiere 24x7), respaldo, accesibilidad ni seguridad. La mesa de ayuda se menciona sin horarios ni niveles de servicio.',
    pregunta:
      '¿Volumen mensual estimado? ¿Disponibilidad y recuperación ante fallos? ¿Accesibilidad exigida (WCAG 2.1 AA / Guía Digital)? ¿Horario, canales y SLA de la mesa de ayuda?',
    pantalla: 'General',
    fuente: 'Ficha letra m) Soporte y operación',
  },
  {
    id: 'C-24',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Integración con SUPER y código de expediente',
    detalle:
      'El manual de SUPER está en desarrollo. El código del expediente (DJ-TRAMITE-AÑO-N°) es una propuesta de la maqueta.',
    pregunta:
      '¿Cuándo estará el contrato de interoperabilidad (API/formato)? ¿Existe un identificador único oficial de expediente? ¿Qué salida estándar debemos preparar mientras tanto para facilitar la migración?',
    pantalla: 'Expediente',
    fuente: 'Ficha letra j) Integraciones; letra h) Trazabilidad',
  },
  {
    id: 'C-25',
    tipo: 'Falta definición',
    prioridad: 'Importante',
    titulo: 'Validaciones automáticas al ingreso',
    detalle:
      'No se indica si deben validarse automáticamente el RUT, la vigencia de la personería o la titularidad de derechos de aprovechamiento de aguas. La maqueta valida solo formato y admisibilidad.',
    pregunta:
      '¿Qué registros externos se consultan al ingresar (Registro Civil, SII, Catastro Público de Aguas, CBR) y cuáles quedan para la fiscalización posterior?',
    pantalla: 'Solicitante',
    fuente: 'Ficha letra g) Reglas de admisibilidad',
  },
  {
    id: 'C-26',
    tipo: 'Falta definición',
    prioridad: 'Deseable',
    titulo: 'Criterios de aceptación medibles',
    detalle:
      'El criterio actual es "que cumpla con los requisitos descritos", lo que no permite cerrar una validación.',
    pregunta:
      'Proponemos un criterio por regla de negocio, casos de prueba UAT y un ambiente de pruebas con datos ficticios y usuarios por perfil. ¿Quién firma la aceptación?',
    pantalla: 'General',
    fuente: 'Ficha letra l) Criterios de aceptación',
  },
]

export const notaPorId = (id: string) => NOTAS.find((n) => n.id === id)
