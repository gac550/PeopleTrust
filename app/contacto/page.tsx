import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Hablemos sobre tu caso. Demo, ventas, soporte o partnership — equipo PeopleTrust.',
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Volver</Link>
        <h1 className="mt-4 font-display text-4xl font-bold">Conversemos</h1>
        <p className="mt-4 text-slate-600">
          Demo, ventas, soporte o partnership. Te respondemos en menos de 24h hábiles.
        </p>

        <form className="mt-12 space-y-6" action="/api/contact" method="POST">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Nombre</label>
            <input required name="name" type="text" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-violet-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input required name="email" type="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-violet-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Empresa</label>
            <input name="company" type="text" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-violet-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Tipo de consulta</label>
            <select required name="kind" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-violet-200">
              <option value="demo">Solicitar demo</option>
              <option value="ventas">Consulta de ventas</option>
              <option value="soporte">Soporte técnico</option>
              <option value="partnership">Partnership</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Mensaje</label>
            <textarea required name="message" rows={5} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-violet-200" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-accent px-6 py-3 font-semibold text-white transition hover:bg-violet-700">
            Enviar mensaje
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500">
          También podés escribirnos a{' '}
          <a href="mailto:hola@peopletrust.cl" className="text-accent hover:underline">hola@peopletrust.cl</a>
        </p>
      </div>
    </main>
  )
}
