// POST /api/voice/stt — Speech-to-Text vía ElevenLabs Scribe
// Doctrina: docs/plans/2026-05-22 00.00.00 Voz bidireccional ElevenLabs + Mood Detection.md
// Feature flag: NEXT_PUBLIC_ENABLE_STT=true
// Default lang: es (chileno) con auto-detect activado.

export const runtime = 'edge'
export const maxDuration = 60

interface STTResponse {
  success: boolean
  text: string
  language: string | null
  confidence: number | null
  timestamps: Array<{ word: string; start: number; end: number }> | []
  speakers: Array<{ id: string; segments: Array<[number, number]> }> | []
  raw?: unknown
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const defaultModel = process.env.ELEVENLABS_STT_MODEL_ID ?? 'scribe_v1'
  const defaultLang = process.env.ELEVENLABS_STT_LANG ?? 'es'

  if (!apiKey) {
    return Response.json(
      { error: 'ElevenLabs no configurado. Agrega ELEVENLABS_API_KEY a .env.local' },
      { status: 501 },
    )
  }

  let audio: Blob | null = null
  let lang = defaultLang
  let model = defaultModel

  const ct = req.headers.get('content-type') ?? ''
  try {
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData()
      const f = form.get('audio') ?? form.get('file')
      if (f instanceof Blob) audio = f
      const l = form.get('language')
      if (typeof l === 'string' && l.length > 0) lang = l
      const m = form.get('model')
      if (typeof m === 'string' && m.length > 0) model = m
    } else {
      audio = await req.blob()
    }
  } catch (e) {
    return Response.json({ error: 'No se pudo parsear el audio del request' }, { status: 400 })
  }

  if (!audio || audio.size === 0) {
    return Response.json({ error: 'audio requerido (blob no vacío)' }, { status: 400 })
  }
  if (audio.size > 25 * 1024 * 1024) {
    return Response.json({ error: 'audio máximo 25 MB' }, { status: 413 })
  }

  // Scribe v1 endpoint — Eleven STT con auto-detect de idioma
  const form = new FormData()
  form.append('file', audio, 'audio.webm')
  form.append('model_id', model)
  // Si se pasa language_code el modelo lo prioriza; si no, autodetect
  if (lang) form.append('language_code', lang)
  // Habilitar timestamps + speakers si Scribe lo soporta
  form.append('timestamps_granularity', 'word')
  form.append('diarize', 'true')

  const elRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: form,
  })

  if (!elRes.ok) {
    const err = await elRes.text().catch(() => '')
    return Response.json(
      { error: 'ElevenLabs STT error', status: elRes.status, detail: err.slice(0, 500) },
      { status: 502 },
    )
  }

  const data = (await elRes.json()) as Record<string, unknown>

  // Normalizar respuesta canónica
  const result: STTResponse = {
    success: true,
    text: (data.text as string) ?? '',
    language: (data.language_code as string) ?? (data.detected_language as string) ?? null,
    confidence: (data.confidence as number) ?? null,
    timestamps: (data.words as STTResponse['timestamps']) ?? [],
    speakers: (data.speakers as STTResponse['speakers']) ?? [],
  }

  return Response.json(result, {
    headers: {
      'X-Voice-Provider': 'elevenlabs',
      'X-Voice-Model': model,
    },
  })
}
