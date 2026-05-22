'use client'

// VoicePlayer — reproduce TTS streaming desde /api/voice/tts
// Lazy-loaded. Fallback texto-only si feature off.

import { useCallback, useRef, useState } from 'react'

interface VoicePlayerProps {
  text: string
  autoPlay?: boolean
  onStart?: () => void
  onEnd?: () => void
  onError?: (err: string) => void
  className?: string
}

export default function VoicePlayer({ text, autoPlay = false, onStart, onEnd, onError, className }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(async () => {
    if (!text.trim()) return
    setPlaying(true)
    onStart?.()
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        onError?.(`TTS error ${res.status}`)
        setPlaying(false)
        onEnd?.()
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        URL.revokeObjectURL(url)
        setPlaying(false)
        onEnd?.()
      }
      audio.onerror = () => {
        onError?.('Audio playback error')
        setPlaying(false)
        onEnd?.()
      }
      await audio.play()
    } catch (e) {
      onError?.(String(e))
      setPlaying(false)
      onEnd?.()
    }
  }, [text, onStart, onEnd, onError])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
      onEnd?.()
    }
  }, [onEnd])

  if (autoPlay && !playing && text) {
    void play()
  }

  return (
    <button
      type="button"
      onClick={playing ? stop : play}
      aria-pressed={playing}
      aria-label={playing ? 'Detener voz' : 'Reproducir voz'}
      title={playing ? 'Detener' : 'Reproducir'}
      className={className}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: playing ? '#22c55e' : 'transparent',
        color: playing ? '#fff' : 'currentColor',
        border: '1px solid currentColor', opacity: .7,
        display: 'grid', placeItems: 'center', cursor: 'pointer',
      }}
    >
      {playing ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
      )}
    </button>
  )
}
