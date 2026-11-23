const TZ = 'America/Santiago'

const fFecha = new Intl.DateTimeFormat('es-CL', {
  timeZone: TZ,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})
const fFechaLarga = new Intl.DateTimeFormat('es-CL', {
  timeZone: TZ,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const fHora = new Intl.DateTimeFormat('es-CL', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export const fecha = (iso: string) => fFecha.format(new Date(iso))
export const fechaLarga = (iso: string) => fFechaLarga.format(new Date(iso))
export const fechaHora = (iso: string) => `${fFecha.format(new Date(iso))} ${fHora.format(new Date(iso))}`

export function sumarDia(iso: string) {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString()
}

export const numero = (n: number) => new Intl.NumberFormat('es-CL').format(n)
