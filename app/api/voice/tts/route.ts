// POST /api/voice/tts — Text-to-Speech vía ElevenLabs Flash v2.5
// Doctrina: docs/plans/2026-05-22 00.00.00 Voz bidireccional ElevenLabs + Mood Detection.md
// Feature flag: NEXT_PUBLIC_ENABLE_TTS=true
// Skill: argos-voice-elevenlabs (a crear)

export const runtime = 'edge'

interface TTSBody {
  text: string
  voiceId?: string
  modelId?: string
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const defaultVoice = process.env.ELEVENLABS_VOICE_ID
  const defaultModel = process.env.ELEVENLABS_TTS_MODEL_ID ?? 'eleven_flash_v2_5'

  if (!apiKey || !defaultVoice) {
    return Response.json(
      { error: 'ElevenLabs no configurado. Agrega ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID a .env.local' },
      { status: 501 },
    )
  }

  let body: TTSBody
  try {
    body = (await req.json()) as TTSBody
  } catch {
    return Response.json({ error: 'JSON inválido en el body' }, { status: 400 })
  }

  const { text, voiceId = defaultVoice, modelId = defaultModel } = body
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return Response.json({ error: 'text requerido (string no vacío)' }, { status: 400 })
  }
  if (text.length > 5000) {
    return Response.json({ error: 'text máximo 5000 caracteres' }, { status: 400 })
  }

  const elRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream`,
    {
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
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    },
  )

  if (!elRes.ok) {
    const err = await elRes.text().catch(() => '')
    return Response.json(
      { error: 'ElevenLabs error', status: elRes.status, detail: err.slice(0, 500) },
      { status: 502 },
    )
  }

  return new Response(elRes.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'X-Voice-Provider': 'elevenlabs',
      'X-Voice-Model': modelId,
    },
  })
}
