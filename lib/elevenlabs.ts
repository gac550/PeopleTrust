// Wrapper cliente ElevenLabs (server-side only)
// NUNCA importar desde components/ — solo desde /api/voice/*.

const BASE = 'https://api.elevenlabs.io/v1'

interface TtsOptions {
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

export async function streamTTS(text: string, opts: TtsOptions = {}): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set')
  const voiceId = opts.voiceId ?? process.env.ELEVENLABS_VOICE_ID
  const modelId = opts.modelId ?? process.env.ELEVENLABS_TTS_MODEL_ID ?? 'eleven_flash_v2_5'
  if (!voiceId) throw new Error('ELEVENLABS_VOICE_ID not set')

  return fetch(`${BASE}/text-to-speech/${encodeURIComponent(voiceId)}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: opts.stability ?? 0.5,
        similarity_boost: opts.similarityBoost ?? 0.8,
      },
    }),
  })
}

interface SttOptions {
  modelId?: string
  language?: string
  diarize?: boolean
  timestampsGranularity?: 'word' | 'sentence'
}

export async function transcribeSTT(audio: Blob, opts: SttOptions = {}): Promise<unknown> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set')
  const modelId = opts.modelId ?? process.env.ELEVENLABS_STT_MODEL_ID ?? 'scribe_v1'
  const lang = opts.language ?? process.env.ELEVENLABS_STT_LANG ?? 'es'

  const form = new FormData()
  form.append('file', audio, 'audio.webm')
  form.append('model_id', modelId)
  if (lang) form.append('language_code', lang)
  form.append('timestamps_granularity', opts.timestampsGranularity ?? 'word')
  if (opts.diarize !== false) form.append('diarize', 'true')

  const res = await fetch(`${BASE}/speech-to-text`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`ElevenLabs STT error ${res.status}: ${err.slice(0, 200)}`)
  }
  return res.json()
}
