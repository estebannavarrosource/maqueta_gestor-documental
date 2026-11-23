import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { AppHeader } from '@/components/app-header'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const _plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] })
const _plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Declaraciones Juradas DGA · Maqueta funcional',
  description:
    'Maqueta funcional del módulo de recepción de Declaraciones Juradas como técnica habilitante alternativa de la Dirección General de Aguas.',
}

export const viewport: Viewport = {
  themeColor: '#1f4e8c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        <StoreProvider>
          <AppHeader />
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
          <footer className="no-print border-t border-border bg-card">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground">
              <p>Maqueta para validación con el negocio. Datos ficticios.</p>
              <p>
                Mesa de ayuda: <span className="font-mono">mesa.ayuda@dga.example</span> · Horario por definir
              </p>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
