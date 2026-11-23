import { ExpedienteView } from '@/components/expediente-view'

export default async function ExpedientePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  return <ExpedienteView codigo={decodeURIComponent(codigo)} />
}
