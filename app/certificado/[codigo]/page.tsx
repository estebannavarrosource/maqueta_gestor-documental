import { CertificadoView } from '@/components/certificado-view'

export default async function CertificadoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  return <CertificadoView codigo={decodeURIComponent(codigo)} />
}
