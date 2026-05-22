// Feature flags canon — voz bidireccional + mood detection
// Doctrina: docs/plans/2026-05-22 00.00.00 Voz bidireccional ElevenLabs + Mood Detection.md
// Si voice=false → CERO bundle audio cargado (dynamic imports condicionados a estos flags)

export const FEATURES = {
  voice: process.env.NEXT_PUBLIC_ENABLE_VOICE === 'true',
  stt: process.env.NEXT_PUBLIC_ENABLE_STT === 'true',
  tts: process.env.NEXT_PUBLIC_ENABLE_TTS === 'true',
  audioAnalysis: process.env.NEXT_PUBLIC_ENABLE_AUDIO_ANALYSIS === 'true',
} as const

export type FeatureKey = keyof typeof FEATURES

export function isEnabled(feature: FeatureKey): boolean {
  return FEATURES[feature]
}
