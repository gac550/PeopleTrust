import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://argos.vecttore.com'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <header className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-accent" />
              <span className="font-display text-xl font-bold tracking-tight">PeopleTrust</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/precios" className="text-slate-600 hover:text-slate-900">Precios</Link>
              <Link href="/contacto" className="text-slate-600 hover:text-slate-900">Contacto</Link>
              <a
                href={APP_URL}
                className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
              >
                Iniciar sesión
              </a>
            </nav>
          </header>

          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700">
              IA + Psicología organizacional
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Evaluación psicolaboral con <span className="text-accent">agentes IA</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 sm:text-xl">
              Sigmund, Smith, Albert y un equipo de agentes especializados conducen
              evaluaciones de personalidad y laborales basadas en evidencia. Decisiones
              de talento más rápidas, consistentes y trazables.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={APP_URL}
                className="rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                Probar gratis
              </a>
              <Link
                href="/contacto"
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Solicitar demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Equipo de agentes especializados
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          Cada agente está entrenado para un rol específico en el flujo de evaluación.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg"
            >
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: agent.color }}
              >
                {agent.name[0]}
              </div>
              <h3 className="font-display text-lg font-semibold">{agent.name}</h3>
              <p className="text-sm font-medium uppercase tracking-wider" style={{ color: agent.color }}>
                {agent.role}
              </p>
              <p className="mt-2 text-sm text-slate-600">{agent.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            ¿Listo para automatizar tus evaluaciones?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Empezá gratis. Sin tarjeta de crédito. Hasta 10 evaluaciones/mes.
          </p>
          <a
            href={APP_URL}
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-4 font-semibold shadow-lg shadow-violet-900/50 transition hover:bg-violet-600"
          >
            Crear cuenta gratis →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PeopleTrust. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-slate-900">Privacidad</Link>
            <Link href="/terminos" className="hover:text-slate-900">Términos</Link>
            <a href={APP_URL} className="hover:text-slate-900">App</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

const AGENTS = [
  { name: 'Valentina', role: 'FrontOffice',           color: '#22c55e', bio: 'Recibe al candidato, hace triaje inicial y deriva al especialista adecuado.' },
  { name: 'Sigmund',   role: 'Personalidad',          color: '#22c55e', bio: 'Entrevista psicológica en 7 dimensiones — autopercepción, no diagnóstico.' },
  { name: 'Smith',     role: 'Laboral',               color: '#22c55e', bio: 'BEI + análisis de competencias + enriquecimiento iterativo del CV.' },
  { name: 'Miyagi',    role: 'Orquestador',           color: '#a855f7', bio: 'Master que coordina el flujo entre agentes y firma los handoffs.' },
  { name: 'Matusalém', role: 'Integrador',            color: '#0ea5e9', bio: 'Consolida insumos de los evaluadores en un informe único trazable.' },
  { name: 'Albert',    role: 'Derivador',             color: '#0ea5e9', bio: 'Decide la asignación al psicólogo humano más adecuado para el caso.' },
]
