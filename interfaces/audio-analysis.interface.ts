// Interface canónica desacoplada para análisis de mood.
// Permite swap del proveedor (ElevenLabs hoy → Hume EVI 3 mañana).

export type MoodPrimary =
  | 'neutral' | 'calm' | 'relaxed' | 'focused' | 'thoughtful' | 'doubtful' | 'distracted'
  | 'happy' | 'enthusiastic' | 'excited' | 'optimistic' | 'amused' | 'laughing'
  | 'relieved' | 'grateful' | 'motivated' | 'energetic' | 'confident'
  | 'sad' | 'crying' | 'frustrated' | 'angry' | 'upset' | 'reactive'
  | 'anxious' | 'nervous' | 'stressed' | 'overwhelmed' | 'tired' | 'emotionally_exhausted'
  | 'fearful' | 'worried' | 'uncomfortable' | 'ashamed' | 'defensive'
  | 'confused' | 'disappointed' | 'hopeless'
  | 'accelerated' | 'agitated' | 'emotionally_intense' | 'passive' | 'hesitant'
  | 'emotionally_flat' | 'monotone' | 'sarcastic' | 'impatient' | 'confrontational'
  | 'unstable_voice' | 'low_energy' | 'high_energy'

export type AudioEvent =
  | 'crying' | 'sobbing' | 'laughter' | 'nervous_laughter' | 'sighs'
  | 'long_pauses' | 'breathing_heavy' | 'voice_breaks' | 'yelling' | 'whispering'
  | 'silence' | 'interruptions' | 'tremor_in_voice' | 'abrupt_tone_changes'

export interface AudioMoodAnalysis {
  primaryMood: MoodPrimary | string
  secondaryMood: MoodPrimary | string | null
  confidence: number
  signals: {
    speechRate: number | null
    pauseDensity: number | null
    volumeVariation: number | null
    pitchVariation: number | null
    semanticTone: 'positive' | 'neutral' | 'negative' | null
    audioEvents: AudioEvent[] | string[]
  }
  detectedStates: Array<MoodPrimary | string>
  audioEvents: Array<AudioEvent | string>
  provider: string
  warning: string
}

export interface AudioMoodAnalyzer {
  analyze(audio: Blob): Promise<AudioMoodAnalysis>
}
