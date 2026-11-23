import { PageTitle } from '@/components/form-controls'
import { Wizard } from '@/components/wizard'

export default function NuevaDeclaracion() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle eyebrow="Formulario estandarizado" title="Presentar declaración jurada" />
      <Wizard />
    </div>
  )
}
