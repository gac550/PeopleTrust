// POST /api/voice/audio-analysis — Mood Detection EXPERIMENTAL
// Doctrina: docs/plans/2026-05-22 00.00.00 Voz bidireccional ElevenLabs + Mood Detection.md
// Feature flag: NEXT_PUBLIC_ENABLE_AUDIO_ANALYSIS=true (default OFF)
//
// AVISO LEGAL: análisis PROBABILÍSTICO, NO diagnóstico clínico.
// Veto Themis (legal) + Hygea (clínica). No persistir perfiles emocionales.

export const runtime = 'edge'
export const maxDuration = 60

export interface AudioMoodAnalysis {
  primaryMood: string
  secondaryMood: string | null
  confidence: number
  signals: {
    speechRate: number | null
    pauseDensity: number | null
    volumeVariation: number | null
    pitchVariation: number | null
    semanticTone: 'positive' | 'neutral' | 'negative' | null
    audioEvents: string[]
  }
  detectedStates: string[]
  audioEvents: string[]
  provider: string
  warning: string
}

const WARNING =
  'Emotion detection is probabilistic and must not be treated as diagnosis. ' +
  'Use only to adapt conversational tone (empathy, pace, clarity). ' +
  'NEVER for legal, employment or clinical decisions.'

export async function POST(req: Request): Promise<Response> {
  if (process.env.NEXT_PUBLIC_ENABLE_AUDIO_ANALYSIS !== 'true') {
    return Response.json(
      { error: 'audio-analysis feature disabled. Set NEXT_PUBLIC_ENABLE_AUDIO_ANALYSIS=true to enable.' },
      { status: 501 },
    )
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'ElevenLabs no configurado. Agrega ELEVENLABS_API_KEY a .env.local' },
      { status: 501 },
    )
  }

  let audio: Blob | null = null
  try {
    const ct = req.headers.get('content-type') ?? ''
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData()
      const f = form.get('audio') ?? form.get('file')
      if (f instanceof Blob) audio = f
    } else {
      audio = await req.blob()
    }
  } catch {
    return Response.json({ error: 'No se pudo parsear el audio' }, { status: 400 })
  }

  if (!audio || audio.size === 0) {
    return Response.json({ error: 'audio requerido' }, { status: 400 })
  }

  // STT primero para obtener semanticTone (mientras Eleven no exponga emotion API).
  const form = new FormData()
  form.append('file', audio, 'audio.webm')
  form.append('model_id', 'scribe_v1')
  form.append('language_code', 'es')
  form.append('timestamps_granularity', 'word')

  const elRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  })

  if (!elRes.ok) {
    return Response.json({ error: 'ElevenLabs STT error', status: elRes.status }, { status: 502 })
  }

  const data = (await elRes.json()) as Record<string, unknown>
  const text = ((data.text as string) ?? '').toLowerCase()
  const words = (data.words as Array<{ word: string; start: number; end: number }>) ?? []

  // Heurísticas paralingüísticas básicas a partir de timestamps de palabras.
  // (Eleven Scribe no expone tone/emotion directamente — esto es un baseline
  // que se reemplaza cuando se integre Hume EVI 3 o equivalente.)
  const duration = words.length > 0 ? words[words.length - 1].end - words[0].start : 0
  const speechRate = duration > 0 ? words.length / duration : null

  let pauseTotal = 0
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end
    if (gap > 0.4) pauseTotal += gap
  }
  const pauseDensity = duration > 0 ? pauseTotal / duration : null

  // Heurísticas léxicas para semanticTone (placeholder simple).
  const positive = /\b(genial|excelente|gracias|perfecto|me gusta|encanta|feliz|bueno|fantástico)\b/.test(text)
  const negative = /\b(malo|terrible|odio|frustra|enoj|triste|cansado|preocupa|no funciona|pésimo)\b/.test(text)
  let semanticTone: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (positive && !negative) semanticTone = 'positive'
  else if (negative && !positive) semanticTone = 'negative'

  // Inferencia naive de estados (mejorar con Hume/Whisper-emo en futuro).
  const detected: string[] = []
  if (speechRate !== null && speechRate > 4) detected.push('accelerated', 'high_energy')
  if (pauseDensity !== null && pauseDensity > 0.35) detected.push('hesitant', 'thoughtful')
  if (semanticTone === 'positive') detected.push('optimistic')
  if (semanticTone === 'negative') detected.push('frustrated')
  if (detected.length === 0) detected.push('neutral')

  const result: AudioMoodAnalysis = {
    primaryMood: detected[0],
    secondaryMood: detected[1] ?? null,
    confidence: 0.55, // baja por diseño — heurística baseline
    signals: {
      speechRate,
      pauseDensity,
      volumeVariation: null, // requiere análisis acústico nativo
      pitchVariation: null,
      semanticTone,
      audioEvents: [],
    },
    detectedStates: detected,
    audioEvents: [],
    provider: 'elevenlabs_scribe_v1 + heuristic baseline',
    warning: WARNING,
  }

  return Response.json(result, {
    headers: {
      'X-Voice-Provider': 'elevenlabs',
      'X-Audio-Analysis-Confidence': String(result.confidence),
    },
  })
}
