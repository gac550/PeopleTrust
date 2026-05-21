import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta canon (alineada con Argos AaaS admin):
        master:     '#a855f7',  // purple-500
        specialist: '#22c55e',  // green-500
        analyst:    '#0ea5e9',  // sky-500
        guardrail:  '#ef4444',  // red-500
        accent:     '#8b5cf6',  // violet-500 (brand principal)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
