'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Check, FileText, Paperclip, TriangleAlert } from 'lucide-react'
import { Card, Field, inputCls } from '@/components/form-controls'
import { NoteMark } from '@/components/note-mark'
import {
  REGIONES,
  TIPOS_BOCATOMA,
  TIPOS_INTERVENCION,
  TIPOS_OBRA,
  TRAMITES,
  UMBRALES,
  tramitePorId,
  type TramiteId,
} from '@/lib/catalog'
import { evaluarAdmisibilidad } from '@/lib/reglas'
import { useStore } from '@/lib/store'
import type { Declaracion, Documento } from '@/lib/types'

const PASOS = ['Trámite', 'Solicitante', 'Proyecto', 'Admisibilidad', 'Documentos', 'Firma']
const RUT = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DOCS_REQUERIDOS: Record<string, string[]> = {
  bocatoma: ['Memoria técnica de la bocatoma', 'Planos de la obra', 'Croquis de ubicación'],
  cauce: ['Memoria técnica de la intervención', 'Planos de planta y perfil', 'Croquis de ubicación'],
  obra: ['Memoria de cálculo', 'Planos de la obra', 'Croquis de ubicación'],
}

interface Form {
  tramite: TramiteId | ''
  tipo: 'Persona natural' | 'Persona jurídica'
  nombre: string
  rut: string
  email: string
  presentadoPor: Declaracion['presentadoPor']
  repNombre: string
  repRut: string
  pNombre: string
  region: string
  comuna: string
  cauce: string
  este: string
  norte: string
  huso: '18' | '19'
  descripcion: string
  previa: string
  tipoBocatoma: string
  caudal: string
  tipoIntervencion: string
  longitud: string
  volumen: string
  tipoObra: string
  altura: string
  embalse: string
  riesgoVida: boolean | null
  altera: boolean | null
  docs: string[]
  firma: Declaracion['firma']
  acepta: boolean
}

const VACIO: Form = {
  tramite: '',
  tipo: 'Persona natural',
  nombre: '',
  rut: '',
  email: '',
  presentadoPor: 'Titular',
  repNombre: '',
  repRut: '',
  pNombre: '',
  region: '',
  comuna: '',
  cauce: '',
  este: '',
  norte: '',
  huso: '19',
  descripcion: '',
  previa: '',
  tipoBocatoma: '',
  caudal: '',
  tipoIntervencion: '',
  longitud: '',
  volumen: '',
  tipoObra: '',
  altura: '',
  embalse: '',
  riesgoVida: null,
  altera: null,
  docs: [],
  firma: 'En línea (Clave Única)',
  acepta: false,
}

const num = (s: string) => (s.trim() === '' ? undefined : Number(s.replace(',', '.')))

export function Wizard() {
  const { rol, presentar, declaraciones } = useStore()
  const router = useRouter()
  const [paso, setPaso] = useState(0)
  const [f, setF] = useState<Form>(VACIO)
  const [intento, setIntento] = useState(false)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))

  const asistido = rol === 'ministro'
  const t = f.tramite ? tramitePorId(f.tramite) : null
  const familia = t?.familia ?? 'bocatoma'

  const proyecto = useMemo<Declaracion['proyecto']>(
    () => ({
      nombre: f.pNombre,
      region: f.region,
      comuna: f.comuna,
      cauce: f.cauce,
      este: f.este,
      norte: f.norte,
      huso: f.huso,
      descripcion: f.descripcion,
      autorizacionPrevia: f.previa || undefined,
      tipoBocatoma: familia === 'bocatoma' ? f.tipoBocatoma : undefined,
      caudalLs: familia === 'bocatoma' ? num(f.caudal) : undefined,
      tipoIntervencion: familia === 'cauce' ? f.tipoIntervencion : undefined,
      longitudM: familia === 'cauce' ? num(f.longitud) : undefined,
      volumenM3: familia === 'cauce' ? num(f.volumen) : undefined,
      tipoObra: familia === 'obra' ? f.tipoObra : undefined,
      alturaM: familia === 'obra' ? num(f.altura) : undefined,
      embalseM3: familia === 'obra' ? num(f.embalse) : undefined,
    }),
    [f, familia],
  )

  const adm = useMemo(
    () => (f.tramite ? evaluarAdmisibilidad(f.tramite, proyecto, f.riesgoVida, f.altera) : null),
    [f.tramite, proyecto, f.riesgoVida, f.altera],
  )

  if (rol !== 'solicitante' && rol !== 'ministro')
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">Debe elegir el perfil Solicitante o Ministro de fe para presentar una declaración.</p>
        <p className="mt-1 text-sm text-muted-foreground">Use el selector “Ver como” de la barra superior.</p>
      </Card>
    )

  const docsReq = DOCS_REQUERIDOS[familia]

  const errores = (p: number): string[] => {
    const e: string[] = []
    if (p === 0 && !f.tramite) e.push('Seleccione un trámite.')
    if (p === 1) {
      if (!f.nombre.trim()) e.push('Ingrese el nombre o razón social del titular.')
      if (!RUT.test(f.rut)) e.push('Ingrese un RUT válido (ej. 12.345.678-5).')
      if (!EMAIL.test(f.email)) e.push('Ingrese un correo electrónico válido.')
      const conRep = f.tipo === 'Persona jurídica' || (!asistido && f.presentadoPor !== 'Titular')
      if (conRep && (!f.repNombre.trim() || !RUT.test(f.repRut)))
        e.push('Ingrese nombre y RUT válido del representante o apoderado.')
    }
    if (p === 2) {
      if (!f.pNombre.trim()) e.push('Ingrese el nombre del proyecto.')
      if (!f.region || !f.comuna.trim() || !f.cauce.trim()) e.push('Complete región, comuna y cauce.')
      if (!f.este.trim() || !f.norte.trim()) e.push('Ingrese las coordenadas UTM.')
      if (f.descripcion.trim().length < 10) e.push('Describa el proyecto (mínimo 10 caracteres).')
      if (t?.etapa === 'recepcion' && !f.previa.trim()) e.push('Ingrese el código de la autorización o declaración previa.')
      if (familia === 'bocatoma' && (!f.tipoBocatoma || num(f.caudal) === undefined)) e.push('Complete tipo de bocatoma y caudal.')
      if (familia === 'cauce' && (!f.tipoIntervencion || num(f.longitud) === undefined || num(f.volumen) === undefined))
        e.push('Complete tipo de intervención, longitud y volumen.')
      if (familia === 'obra' && (!f.tipoObra || num(f.altura) === undefined || num(f.embalse) === undefined))
        e.push('Complete tipo de obra, altura y capacidad de embalse.')
    }
    if (p === 3) {
      if (f.riesgoVida === null || f.altera === null) e.push('Responda las dos preguntas de riesgo.')
      else if (adm && !adm.admisible) e.push('El proyecto no es admisible como declaración jurada.')
    }
    if (p === 5) {
      if (!f.acepta) e.push('Debe aceptar la declaración para firmar.')
    }
    return e
  }

  const errs = errores(paso)
  const siguiente = () => {
    setIntento(true)
    if (errs.length === 0) {
      setPaso((p) => p + 1)
      setIntento(false)
    }
  }

  const enviar = () => {
    setIntento(true)
    if (errs.length > 0 || !f.tramite) return
    const documentos: Documento[] = f.docs.map((n) => ({ nombre: n + '.pdf', tipo: 'PDF', tamano: '1,2 MB' }))
    const conRep = f.tipo === 'Persona jurídica' || (!asistido && f.presentadoPor !== 'Titular')
    const d = presentar({
      tramite: f.tramite,
      solicitante: {
        tipo: f.tipo,
        nombre: f.nombre,
        rut: f.rut,
        email: f.email,
        representante: conRep ? { nombre: f.repNombre, rut: f.repRut } : undefined,
      },
      proyecto,
      documentos,
      firma: asistido ? 'Declaración adjunta' : f.firma,
      presentadoPor: asistido ? 'Ministro de fe' : f.presentadoPor,
    })
    router.push(`/certificado/${d.codigo}`)
  }

  const cargarEjemplo = () => {
    const base: Partial<Form> = {
      tramite: f.tramite || 'ABO',
      nombre: 'Comunidad de Aguas Río Claro',
      tipo: 'Persona jurídica',
      rut: '65.432.100-7',
      email: 'contacto@riocalro.example',
      repNombre: 'Marta Soto Pérez',
      repRut: '11.222.333-4',
      pNombre: 'Bocatoma lateral canal Los Peumos',
      region: 'Maule',
      comuna: 'Pencahue',
      cauce: 'Río Claro',
      este: '263450',
      norte: '6091200',
      descripcion: 'Construcción de bocatoma lateral con compuerta para captación de riego.',
      previa: 'DJ-ABO-2026-000012',
      tipoBocatoma: 'Lateral',
      caudal: '60',
      tipoIntervencion: 'Defensa fluvial',
      longitud: '250',
      volumen: '1200',
      tipoObra: 'Acueducto',
      altura: '2',
      embalse: '10000',
      riesgoVida: false,
      altera: false,
      docs: [],
    }
    setF((p) => ({ ...p, ...base }))
  }

  const mostrarErr = intento && errs.length > 0

  return (
    <div>
      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Pasos">
        {PASOS.map((n, i) => (
          <li
            key={n}
            aria-current={i === paso ? 'step' : undefined}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              i === paso
                ? 'border-primary bg-primary text-primary-foreground'
                : i < paso
                  ? 'border-success/40 bg-success-soft text-success'
                  : 'border-border bg-card text-muted-foreground'
            }`}
          >
            {i < paso ? <Check className="size-3.5" aria-hidden /> : <span>{i + 1}</span>}
            {n}
          </li>
        ))}
      </ol>

      <Card className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {asistido && paso === 0 ? 'Ingreso asistido por Ministro de fe · ' : ''}
            {PASOS[paso]}
            {paso === 0 && <NoteMark id="C-04" className="ml-2" />}
            {paso === 1 && <NoteMark id="C-07" className="ml-2" />}
            {paso === 2 && <NoteMark id="C-05" className="ml-2" />}
            {paso === 3 && <NoteMark id="C-03" className="ml-2" />}
            {paso === 4 && <NoteMark id="C-22" className="ml-2" />}
            {paso === 5 && <NoteMark id="C-09" className="ml-2" />}
          </h2>
          <button type="button" onClick={cargarEjemplo} className="text-xs font-medium text-primary underline-offset-2 hover:underline">
            Cargar datos de ejemplo
          </button>
        </div>

        {paso === 0 && (
          <fieldset>
            <legend className="sr-only">Trámite</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {TRAMITES.map((tr) => (
                <label
                  key={tr.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                    f.tramite === tr.id ? 'border-primary bg-secondary' : 'border-border hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="tramite"
                    checked={f.tramite === tr.id}
                    onChange={() => set('tramite', tr.id)}
                    className="mt-1 accent-[oklch(0.42_0.13_255)]"
                  />
                  <span>
                    <span className="block text-sm font-medium leading-snug">{tr.corto}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{tr.descripcion}</span>
                    <span className="mt-1 block font-mono text-[11px] text-primary">{tr.id}</span>
                  </span>
                </label>
              ))}
            </div>
            {t && <p className="mt-3 text-xs text-muted-foreground">{t.nombre}</p>}
          </fieldset>
        )}

        {paso === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tipo de titular">
              {(id) => (
                <select id={id} className={inputCls} value={f.tipo} onChange={(e) => set('tipo', e.target.value as Form['tipo'])}>
                  <option>Persona natural</option>
                  <option>Persona jurídica</option>
                </select>
              )}
            </Field>
            {!asistido && (
              <Field label="Usted presenta como">
                {(id) => (
                  <select id={id} className={inputCls} value={f.presentadoPor} onChange={(e) => set('presentadoPor', e.target.value as Form['presentadoPor'])}>
                    <option>Titular</option>
                    <option>Representante legal</option>
                    <option>Apoderado</option>
                  </select>
                )}
              </Field>
            )}
            <Field label={f.tipo === 'Persona jurídica' ? 'Razón social' : 'Nombre completo'}>
              {(id) => <input id={id} className={inputCls} value={f.nombre} onChange={(e) => set('nombre', e.target.value)} />}
            </Field>
            <Field label="RUT del titular" hint="Formato 12.345.678-5">
              {(id) => <input id={id} className={inputCls} value={f.rut} onChange={(e) => set('rut', e.target.value)} />}
            </Field>
            <Field label="Correo electrónico (notificaciones)" className="md:col-span-2">
              {(id) => <input id={id} type="email" className={inputCls} value={f.email} onChange={(e) => set('email', e.target.value)} />}
            </Field>
            {(f.tipo === 'Persona jurídica' || (!asistido && f.presentadoPor !== 'Titular')) && (
              <>
                <Field label="Nombre del representante o apoderado">
                  {(id) => <input id={id} className={inputCls} value={f.repNombre} onChange={(e) => set('repNombre', e.target.value)} />}
                </Field>
                <Field label="RUT del representante o apoderado">
                  {(id) => <input id={id} className={inputCls} value={f.repRut} onChange={(e) => set('repRut', e.target.value)} />}
                </Field>
              </>
            )}
            {asistido && (
              <p className="md:col-span-2 rounded-md bg-secondary p-3 text-sm">
                Ingreso presencial: el Ministro de fe registra los datos del titular y adjunta la declaración firmada.
                <NoteMark id="C-08" className="ml-2" />
              </p>
            )}
          </div>
        )}

        {paso === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre del proyecto" className="md:col-span-2">
              {(id) => <input id={id} className={inputCls} value={f.pNombre} onChange={(e) => set('pNombre', e.target.value)} />}
            </Field>
            {t?.etapa === 'recepcion' && (
              <Field label={<>Código de autorización o DJ previa<NoteMark id="C-06" className="ml-2" /></>} className="md:col-span-2">
                {(id) => <input id={id} className={inputCls} placeholder="DJ-ABO-2026-000012" value={f.previa} onChange={(e) => set('previa', e.target.value)} />}
              </Field>
            )}
            <Field label="Región">
              {(id) => (
                <select id={id} className={inputCls} value={f.region} onChange={(e) => set('region', e.target.value)}>
                  <option value="">Seleccione</option>
                  {REGIONES.map((r) => <option key={r}>{r}</option>)}
                </select>
              )}
            </Field>
            <Field label="Comuna">
              {(id) => <input id={id} className={inputCls} value={f.comuna} onChange={(e) => set('comuna', e.target.value)} />}
            </Field>
            <Field label="Cauce o fuente">
              {(id) => <input id={id} className={inputCls} value={f.cauce} onChange={(e) => set('cauce', e.target.value)} />}
            </Field>
            <Field label="Huso UTM">
              {(id) => (
                <select id={id} className={inputCls} value={f.huso} onChange={(e) => set('huso', e.target.value as '18' | '19')}>
                  <option value="18">18</option>
                  <option value="19">19</option>
                </select>
              )}
            </Field>
            <Field label="Este (m)">
              {(id) => <input id={id} inputMode="numeric" className={inputCls} value={f.este} onChange={(e) => set('este', e.target.value)} />}
            </Field>
            <Field label="Norte (m)">
              {(id) => <input id={id} inputMode="numeric" className={inputCls} value={f.norte} onChange={(e) => set('norte', e.target.value)} />}
            </Field>

            {familia === 'bocatoma' && (
              <>
                <Field label="Tipo de bocatoma">
                  {(id) => (
                    <select id={id} className={inputCls} value={f.tipoBocatoma} onChange={(e) => set('tipoBocatoma', e.target.value)}>
                      <option value="">Seleccione</option>
                      {TIPOS_BOCATOMA.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Caudal de captación (l/s)">
                  {(id) => <input id={id} inputMode="decimal" className={inputCls} value={f.caudal} onChange={(e) => set('caudal', e.target.value)} />}
                </Field>
              </>
            )}
            {familia === 'cauce' && (
              <>
                <Field label="Tipo de intervención" className="md:col-span-2">
                  {(id) => (
                    <select id={id} className={inputCls} value={f.tipoIntervencion} onChange={(e) => set('tipoIntervencion', e.target.value)}>
                      <option value="">Seleccione</option>
                      {TIPOS_INTERVENCION.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Longitud intervenida (m)">
                  {(id) => <input id={id} inputMode="decimal" className={inputCls} value={f.longitud} onChange={(e) => set('longitud', e.target.value)} />}
                </Field>
                <Field label="Volumen de material (m³)">
                  {(id) => <input id={id} inputMode="decimal" className={inputCls} value={f.volumen} onChange={(e) => set('volumen', e.target.value)} />}
                </Field>
              </>
            )}
            {familia === 'obra' && (
              <>
                <Field label="Tipo de obra" className="md:col-span-2">
                  {(id) => (
                    <select id={id} className={inputCls} value={f.tipoObra} onChange={(e) => set('tipoObra', e.target.value)}>
                      <option value="">Seleccione</option>
                      {TIPOS_OBRA.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Altura del muro (m)">
                  {(id) => <input id={id} inputMode="decimal" className={inputCls} value={f.altura} onChange={(e) => set('altura', e.target.value)} />}
                </Field>
                <Field label="Capacidad de embalse (m³)">
                  {(id) => <input id={id} inputMode="decimal" className={inputCls} value={f.embalse} onChange={(e) => set('embalse', e.target.value)} />}
                </Field>
              </>
            )}
            <Field label="Descripción del proyecto" className="md:col-span-2">
              {(id) => <textarea id={id} rows={3} className={`${inputCls} h-auto py-2`} value={f.descripcion} onChange={(e) => set('descripcion', e.target.value)} />}
            </Field>
          </div>
        )}

        {paso === 3 && adm && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-muted-foreground">
              Solo pueden presentarse como declaración jurada los proyectos de bajo riesgo. Umbrales referenciales (ficticios):
              caudal {UMBRALES.caudalLs} l/s, longitud {UMBRALES.longitudM} m, muro {UMBRALES.alturaM} m.
            </p>
            {[
              { k: 'riesgoVida' as const, q: '¿El proyecto implica riesgo para la vida, salud o bienes de la población?' },
              { k: 'altera' as const, q: '¿Altera de forma significativa el escurrimiento de las aguas?' },
            ].map(({ k, q }) => (
              <fieldset key={k} className="rounded-lg border border-border p-4">
                <legend className="px-1 text-sm font-medium">{q}</legend>
                <div className="flex gap-6 pt-1 text-sm">
                  {[
                    ['No', false],
                    ['Sí', true],
                  ].map(([l, v]) => (
                    <label key={String(l)} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={k}
                        checked={f[k] === v}
                        onChange={() => set(k, v as boolean)}
                        className="accent-[oklch(0.42_0.13_255)]"
                      />
                      {l as string}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <ul className="grid gap-3 md:grid-cols-2">
              {adm.uso.map((u) => {
                const pct = Math.min(100, Math.round((u.valor / u.umbral) * 100))
                const sobre = u.valor > u.umbral
                return (
                  <li key={u.variable} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <span>{u.variable}</span>
                      <span className="font-mono text-xs">{u.valor} / {u.umbral} {u.unidad}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={u.variable}>
                      <div className={`h-2 rounded-full ${sobre ? 'bg-destructive' : pct >= 80 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
            {f.riesgoVida !== null && f.altera !== null &&
              (adm.admisible ? (
                <p role="status" className="rounded-md bg-success-soft p-3 text-sm font-medium text-success">
                  Proyecto admisible como declaración jurada (bajo riesgo).
                </p>
              ) : (
                <div role="alert" className="rounded-md border border-destructive/40 bg-danger-soft p-4 text-sm text-destructive">
                  <p className="mb-2 flex items-center gap-2 font-semibold">
                    <TriangleAlert className="size-4" aria-hidden /> No admisible como declaración jurada
                  </p>
                  <ul className="list-disc pl-5">
                    {adm.motivos.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                  <p className="mt-2">Este proyecto debe tramitarse mediante autorización previa por resolución de la DGA.</p>
                </div>
              ))}
          </div>
        )}

        {paso === 4 && (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Adjunte la documentación del proyecto. En la maqueta la carga es simulada.
            </p>
            <ul className="flex flex-col gap-2">
              {docsReq.map((n) => {
                const on = f.docs.includes(n)
                return (
                  <li key={n} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <span className="flex items-center gap-2 text-sm">
                      <FileText className="size-4 text-muted-foreground" aria-hidden />
                      {n}
                      {on && <span className="font-mono text-xs text-success">{n.split(' ')[0].toLowerCase()}.pdf · 1,2 MB</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => set('docs', on ? f.docs.filter((x) => x !== n) : [...f.docs, n])}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium ${
                        on ? 'border-success/40 bg-success-soft text-success' : 'border-input bg-card hover:bg-muted'
                      }`}
                    >
                      <Paperclip className="size-3.5" aria-hidden />
                      {on ? 'Quitar' : 'Adjuntar'}
                    </button>
                  </li>
                )
              })}
            </ul>
            {f.docs.length < docsReq.length && (
              <p className="mt-3 text-xs text-muted-foreground">
                Puede continuar sin todos los documentos; el sistema generará una alerta de revisión.
              </p>
            )}
          </div>
        )}

        {paso === 5 && t && (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-3 rounded-lg bg-muted p-4 text-sm md:grid-cols-2">
              <div><dt className="text-xs text-muted-foreground">Trámite</dt><dd className="font-medium">{t.corto}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Titular</dt><dd className="font-medium">{f.nombre} · {f.rut}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Proyecto</dt><dd className="font-medium">{f.pNombre}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Ubicación</dt><dd className="font-medium">{f.comuna}, {f.region}</dd></div>
            </dl>
            {!asistido ? (
              <Field label="Modalidad de firma">
                {(id) => (
                  <select id={id} className={inputCls} value={f.firma} onChange={(e) => set('firma', e.target.value as Form['firma'])}>
                    <option>En línea (Clave Única)</option>
                    <option>Declaración adjunta</option>
                  </select>
                )}
              </Field>
            ) : (
              <p className="text-sm">Firma: declaración adjunta presencial, registrada por el Ministro de fe.</p>
            )}
            <label className="flex items-start gap-3 rounded-lg border border-border p-4 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={f.acepta}
                onChange={(e) => set('acepta', e.target.checked)}
                className="mt-1 size-4 accent-[oklch(0.42_0.13_255)]"
              />
              <span>
                Declaro bajo juramento que los antecedentes entregados son verídicos, que el proyecto es de bajo riesgo y que
                conozco las sanciones por falsedad, incluida la revocación del permiso. (Texto referencial, a validar por
                Jurídica.)
              </span>
            </label>
            {asistido && <p className="text-xs text-muted-foreground">Simula la firma y el timbre del Ministro de fe.</p>}
          </div>
        )}

        {mostrarErr && (
          <ul role="alert" className="mt-5 list-disc rounded-md bg-danger-soft py-3 pl-8 pr-4 text-sm text-destructive">
            {errs.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}

        <div className="mt-6 flex justify-between gap-3 border-t border-border pt-5">
          <button
            type="button"
            disabled={paso === 0}
            onClick={() => { setPaso((p) => p - 1); setIntento(false) }}
            className="h-10 rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted disabled:opacity-40"
          >
            Atrás
          </button>
          {paso < PASOS.length - 1 ? (
            <button type="button" onClick={siguiente} className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Continuar
            </button>
          ) : (
            <button type="button" onClick={enviar} className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Firmar y presentar
            </button>
          )}
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">
        Declaraciones registradas en la maqueta: {declaraciones.length}.
      </p>
    </div>
  )
}
