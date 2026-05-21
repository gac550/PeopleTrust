import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios',
  description: 'Planes flexibles de PeopleTrust — desde gratis hasta enterprise. Multi-agente IA para evaluación psicolaboral.',
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://argos.vecttore.com'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'siempre',
    features: ['10 evaluaciones / mes', 'Agentes core (Valentina, Sigmund, Smith)', 'Informes básicos', 'Soporte comunidad'],
    cta: 'Empezar gratis',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/ mes',
    features: ['200 evaluaciones / mes', 'Todos los agentes + Matusalém + Albert', 'Informes integrados + decisión', 'Soporte email <24h', 'API access'],
    cta: 'Empezar 14 días gratis',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Evaluaciones ilimitadas', 'Multi-tenant (sub-cuentas)', 'SSO + audit log + compliance', 'Soporte dedicado 24/7', 'SLA 99.9%'],
    cta: 'Hablar con ventas',
    highlight: false,
  },
]

export default function PreciosPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Volver</Link>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Planes simples</h1>
          <p className="mt-4 text-lg text-slate-600">Empezá gratis. Escalá cuando lo necesites.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border bg-white p-8 transition ${
                plan.highlight
                  ? 'border-accent shadow-2xl shadow-violet-200 ring-2 ring-accent'
                  : 'border-slate-200 hover:shadow-lg'
              }`}
            >
              {plan.highlight && (
                <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Más popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0 text-accent">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.name === 'Enterprise' ? '/contacto' : APP_URL}
                className={`mt-8 block rounded-lg py-3 text-center font-semibold transition ${
                  plan.highlight
                    ? 'bg-accent text-white hover:bg-violet-700'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
