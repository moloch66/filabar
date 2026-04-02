import type { Config } from 'tailwindcss'

// Colors extracted exactly from the Stitch design system
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — neon amber
        primary: '#ff9f4d',
        'primary-dim': '#ef8100',
        'primary-fixed': '#ff8a00',
        'primary-fixed-dim': '#eb7f00',
        'primary-container': '#ff8a00',
        'on-primary': '#542a00',
        'on-primary-fixed': '#180800',
        'on-primary-fixed-variant': '#512800',
        'on-primary-container': '#442100',
        'inverse-primary': '#924d00',

        // Secondary
        secondary: '#fda229',
        'secondary-dim': '#ec9519',
        'secondary-fixed': '#ffc78c',
        'secondary-fixed-dim': '#ffb45f',
        'secondary-container': '#885200',
        'on-secondary': '#4e2d00',
        'on-secondary-fixed': '#4e2d00',
        'on-secondary-fixed-variant': '#754600',
        'on-secondary-container': '#fff6f0',

        // Tertiary — gold accent
        tertiary: '#ffdd7a',
        'tertiary-dim': '#ebbf24',
        'tertiary-fixed': '#facd34',
        'tertiary-fixed-dim': '#ebbf24',
        'tertiary-container': '#facd34',
        'on-tertiary': '#624e00',
        'on-tertiary-fixed': '#413200',
        'on-tertiary-fixed-variant': '#634e00',
        'on-tertiary-container': '#584500',

        // Error
        error: '#ff7351',
        'error-dim': '#d53d18',
        'error-container': '#b92902',
        'on-error': '#450900',
        'on-error-container': '#ffd2c8',

        // Surface hierarchy (dark to light)
        'surface-container-lowest': '#000000',
        'surface-dim': '#0e0e0e',
        surface: '#0e0e0e',
        background: '#0e0e0e',
        'surface-container-low': '#131313',
        'surface-container': '#1a1919',
        'surface-container-high': '#201f1f',
        'surface-container-highest': '#262626',
        'surface-variant': '#262626',
        'surface-bright': '#2c2c2c',
        'surface-tint': '#ff9f4d',

        // On-surface
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        'on-background': '#ffffff',
        'inverse-surface': '#fcf8f8',
        'inverse-on-surface': '#565554',

        // Outline
        outline: '#777575',
        'outline-variant': '#484847',
      },
      fontFamily: {
        // Matches Stitch design system exactly
        brand: ['Sora', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        'neon-primary': '0 0 40px rgba(255, 159, 77, 0.15)',
        'neon-primary-lg': '0 0 30px rgba(255, 138, 0, 0.3)',
        'neon-primary-sm': '0 0 15px rgba(255, 159, 77, 0.3)',
        'glow-tertiary': '0 0 8px #facd34',
        card: '0 20px 50px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}

export default config
