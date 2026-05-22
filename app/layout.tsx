import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://peopletrust.vecttore.com'),
  title: {
    template: '%s | PeopleTrust',
    default: 'PeopleTrust — Evaluación psicolaboral con agentes IA',
  },
  description:
    'Plataforma de evaluación psicolaboral multi-agente con IA. Sigmund, Smith, Albert y más — para psicólogos, RRHH y empresas que buscan decisiones de talento basadas en evidencia.',
  keywords: [
    'evaluación psicolaboral',
    'IA RRHH',
    'agentes IA',
    'reclutamiento',
    'psicología organizacional',
    'evaluación de personalidad',
    'evaluación laboral',
    'multi-agente',
    'Argos AaaS',
    'PeopleTrust',
  ],
  authors: [{ name: 'PeopleTrust' }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://peopletrust.vecttore.com',
    siteName: 'PeopleTrust',
    title: 'PeopleTrust — Evaluación psicolaboral con agentes IA',
    description:
      'Multi-agente IA para evaluación psicolaboral. Decisiones de talento basadas en evidencia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PeopleTrust',
    description: 'Evaluación psicolaboral con agentes IA.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://peopletrust.vecttore.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        {/* TD-05 anti-FOUC · default LIGHT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.theme=localStorage.getItem('pt-theme')||'light'`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
