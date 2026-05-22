// Barrel para dynamic imports.
// Uso canon:
//   import dynamic from 'next/dynamic'
//   const VoiceControls = dynamic(() => import('@/components/voice').then(m => m.VoiceControls), { ssr: false })

export { default as VoiceControls } from './VoiceControls'
export { default as VoicePlayer } from './VoicePlayer'
