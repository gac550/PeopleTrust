'use client'

import { useEffect, useRef, useState } from 'react'

const MAQUETAS: { label: string; src: string; title: string }[] = [
  { label: '⌂', src: '/preview/home.html', title: 'Home · default · hub de accesos' },
  { label: 'A', src: '/preview/A.html', title: 'A · Pi.ai chat' },
  { label: 'B', src: '/preview/B.html', title: 'B · Apple cinemática' },
  { label: 'C', src: '/preview/C.html', title: 'C · Linear bento' },
  { label: 'D', src: '/preview/D.html', title: 'D · Stripe mesh' },
  { label: 'E', src: '/preview/E.html', title: 'E · ChatGPT minimal' },
  { label: 'F', src: '/preview/F.html', title: 'F · Character galería' },
  { label: 'G', src: '/preview/G.html', title: 'G · Hume voz-first' },
  { label: 'H', src: '/preview/H.html', title: 'H · Notion cálido' },
  { label: 'I', src: '/preview/I.html', title: 'I · Replicate demo' },
  { label: 'J', src: '/preview/J.html', title: 'J · híbrido scroll' },
  { label: 'K', src: '/preview/K.html', title: 'K · combinada (J+H+G+A)' },
  { label: 'L', src: '/preview/L.html', title: 'L · Apple Vision + SF Pro + voz' },
]

export default function HomePage() {
  const [active, setActive] = useState<string>('⌂')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [busterTs, setBusterTs] = useState<number>(0)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = (location.hash || '#⌂').replace('#', '')
    const hash = raw === '⌂' || raw === '%E2%8C%82' ? '⌂' : raw.toUpperCase()
    if (MAQUETAS.find((m) => m.label === hash)) setActive(hash)
    const saved = (localStorage.getItem('pt-theme') as 'light' | 'dark') || 'light'
    setTheme(saved)
    document.documentElement.dataset.theme = saved
    setBusterTs(Date.now())
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('pt-theme', theme)
    setBusterTs(Date.now())
  }, [theme])

  useEffect(() => {
    history.replaceState(null, '', `#${active}`)
    document.title = `${active} · PeopleTrust`
    const el = tabsRef.current?.querySelector(`[data-label="${active}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setBusterTs(Date.now())
  }, [active])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const idx = MAQUETAS.findIndex((m) => m.label === active)
      if (e.key === 'ArrowRight' && idx < MAQUETAS.length - 1) setActive(MAQUETAS[idx + 1].label)
      if (e.key === 'ArrowLeft' && idx > 0) setActive(MAQUETAS[idx - 1].label)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const current = MAQUETAS.find((m) => m.label === active) ?? MAQUETAS[0]
  const iframeSrc = busterTs ? `${current.src}?theme=${theme}&v=${busterTs}` : current.src
  const reload = () => setBusterTs(Date.now())

  return (
    <>
      <style jsx global>{`
        :root[data-theme='light'] { --bg:#fafafa; --fg:#0f172a; --muted:#64748b; --accent:#7c3aed; --card:#ffffff; --border:#e2e8f0; --hover:#f1f5f9; }
        :root[data-theme='dark']  { --bg:#070612; --fg:#e5e3f0; --muted:#94a3b8; --accent:#a855f7; --card:rgba(255,255,255,.04); --border:rgba(255,255,255,.10); --hover:rgba(255,255,255,.06); }
        html, body { background: var(--bg); color: var(--fg); transition: background-color .2s, color .2s; overflow: hidden; height: 100%; margin: 0; }
        .pt-tab { position: relative; cursor: pointer; user-select: none; color: var(--muted); background: transparent; border: none; height: 48px; width: 44px; display: inline-grid; place-items: center; font: 600 14px/1 'JetBrains Mono','SF Mono',ui-monospace,monospace; flex-shrink: 0; transition: color .15s, background .15s; }
        .pt-tab:hover { color: var(--fg); background: var(--hover); }
        .pt-tab.is-active { color: var(--fg); }
        .pt-tab.is-active::after { content: ''; position: absolute; left: 6px; right: 6px; bottom: 0; height: 2px; background: var(--accent); border-radius: 2px 2px 0 0; }
        .pt-iconbtn { width: 36px; height: 36px; border-radius: 8px; border: none; background: transparent; color: var(--muted); display: grid; place-items: center; cursor: pointer; transition: .15s; }
        .pt-iconbtn:hover { color: var(--fg); background: var(--hover); }
        .pt-header { background: var(--card); border-bottom: 1px solid var(--border); }
        .pt-tabs { scrollbar-width: none; }
        .pt-tabs::-webkit-scrollbar { display: none; }
      `}</style>

      <header className="pt-header sticky top-0 z-50 h-12 flex items-center px-2 sm:px-3 gap-1">
        <a href="/" className="flex items-center gap-2 mr-3 flex-shrink-0 px-2" aria-label="PeopleTrust">
          <span className="w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }} />
          <span className="font-bold text-sm tracking-tight hidden sm:inline">PeopleTrust</span>
        </a>

        <nav ref={tabsRef} className="pt-tabs flex items-center flex-1 overflow-x-auto" aria-label="Maquetas">
          {MAQUETAS.map((m) => (
            <button
              key={m.label}
              className={`pt-tab ${active === m.label ? 'is-active' : ''}`}
              data-label={m.label}
              title={m.title}
              onClick={() => setActive(m.label)}
            >
              {m.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 flex-shrink-0 pr-1">
          <button className="pt-iconbtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar tema" title="Tema claro/oscuro">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button className="pt-iconbtn" onClick={reload} aria-label="Recargar" title="Recargar maqueta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <a className="pt-iconbtn" href={current.src} target="_blank" rel="noopener" title="Abrir en pestaña" aria-label="Abrir full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </header>

      <div style={{ height: 'calc(100svh - 49px)' }}>
        <iframe
          ref={frameRef}
          src={iframeSrc}
          title={`Maqueta ${active}`}
          allow="microphone *"
          style={{ width: '100%', height: '100%', border: 0, display: 'block', background: 'var(--bg)' }}
        />
      </div>
    </>
  )
}
