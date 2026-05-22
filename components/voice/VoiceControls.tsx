'use client'

// VoiceControls — entrada principal a la capa de voz.
// Lazy-loaded: ÚNICAMENTE se importa cuando FEATURES.voice === true.
// Doctrina: docs/plans/2026-05-22 00.00.00 Voz bidireccional ElevenLabs + Mood Detection.md

import { useState, useRef, useCallback } from 'react'

interface VoiceControlsProps {
  onTranscript?: (text: string, language: string | null) => void
  onError?: (err: string) => void
  language?: string
  className?: string
}

type Status = 'idle' | 'recording' | 'processing' | 'speaking'

export default function VoiceControls({ onTranscript, onError, language = 'es', className }: VoiceControlsProps) {
  const [status, setStatus] = useState<Status>('idle')
  const recRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = useCallback(async () => {
    if (status !== 'idle') return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const rec = new MediaRecorder(stream, { mimeType: mime })
      chunksRef.current = []
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setStatus('processing')
        const blob = new Blob(chunksRef.current, { type: mime })
        const form = new FormData()
        form.append('audio', blob, `audio.${mime.includes('webm') ? 'webm' : 'mp4'}`)
        form.append('language', language)
        try {
          const res = await fetch('/api/voice/stt', { method: 'POST', body: form })
          const data = (await res.json()) as { success: boolean; text: string; language: string | null; error?: string }
          if (!data.success || data.error) {
            onError?.(data.error ?? 'STT failed')
          } else {
            onTranscript?.(data.text, data.language)
          }
        } catch (e) {
          onError?.(String(e))
        } finally {
          setStatus('idle')
        }
      }
      rec.start()
      recRef.current = rec
      setStatus('recording')
    } catch (e) {
      onError?.('Permiso de micrófono denegado o no disponible')
      setStatus('idle')
    }
  }, [status, language, onTranscript, onError])

  const stop = useCallback(() => {
    if (recRef.current && recRef.current.state !== 'inactive') {
      recRef.current.stop()
    }
  }, [])

  return (
    <button
      type="button"
      onClick={status === 'recording' ? stop : start}
      disabled={status === 'processing' || status === 'speaking'}
      aria-pressed={status === 'recording'}
      aria-label={status === 'recording' ? 'Detener grabación' : 'Hablar por voz'}
      title={status === 'recording' ? 'Detener (clic)' : 'Hablar por voz'}
      className={className}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        background: status === 'recording' ? '#22c55e' : 'rgba(127,127,127,.08)',
        color: status === 'recording' ? '#fff' : 'currentColor',
        border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
        transition: '.18s', animation: status === 'recording' ? 'micPulse 1.4s infinite' : 'none',
      }}
    >
      {status === 'processing' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
      )}
      <style jsx>{`
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,.6); }
          70% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </button>
  )
}
