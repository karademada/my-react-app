import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const palette = (scale: string) => ({
  solid: { value: `{colors.${scale}.600}` },
  contrast: { value: '#FFFFFF' },
  fg: { value: `{colors.${scale}.700}` },
  muted: { value: `{colors.${scale}.100}` },
  subtle: { value: `{colors.${scale}.50}` },
  emphasized: { value: `{colors.${scale}.200}` },
  focusRing: { value: `{colors.${scale}.600}` },
})

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: '"Hanken Grotesk", "Helvetica Neue", Arial, system-ui, sans-serif' },
        body: { value: '"Hanken Grotesk", "Helvetica Neue", Arial, system-ui, sans-serif' },
        mono: { value: '"Spline Sans Mono", ui-monospace, Menlo, monospace' },
      },
      radii: {
        l1: { value: '8px' },
        l2: { value: '14px' },
        l3: { value: '22px' },
      },
      colors: {
        ink: {
          50: { value: '#F5F5F7' }, 100: { value: '#ECECEF' }, 200: { value: '#E1E1E5' },
          300: { value: '#C9C9CF' }, 400: { value: '#AEAEB4' }, 500: { value: '#86868B' },
          600: { value: '#6E6E73' }, 700: { value: '#38383C' }, 800: { value: '#2A2A2D' },
          900: { value: '#1D1D1F' }, 950: { value: '#141416' },
        },
        moss: {
          50: { value: '#E4F1EA' }, 100: { value: '#C9E3D4' }, 200: { value: '#A7D2BC' },
          300: { value: '#7EBC9E' }, 400: { value: '#4F9E78' }, 500: { value: '#2E9069' },
          600: { value: '#1C7A57' }, 700: { value: '#14543C' }, 800: { value: '#103F2E' },
          900: { value: '#0B2A1F' }, 950: { value: '#061812' },
        },
        joy: {
          50: { value: '#FBEAE0' }, 100: { value: '#F7D6C4' }, 200: { value: '#F4CBB8' },
          300: { value: '#EFB99B' }, 400: { value: '#E89C78' }, 500: { value: '#E68E6E' },
          600: { value: '#D97757' }, 700: { value: '#BD5D3D' }, 800: { value: '#9A4A30' },
          900: { value: '#6E3522' }, 950: { value: '#421F14' },
        },
      },
    },
    semanticTokens: {
      colors: {
        ink: palette('ink'),
        moss: palette('moss'),
        joy: palette('joy'),
        'bg.canvas': { value: '#F5F5F7' },
        'bg.surface': { value: '#FFFFFF' },
        'fg.default': { value: '#1D1D1F' },
        'fg.muted': { value: '#6E6E73' },
        'border.default': { value: '#D6D6DB' },
      },
    },
  },
  globalCss: {
    'html, body': {
      background: '#F5F5F7',
      color: '#1D1D1F',
      fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
    },
    'h1, h2, h3': {
      fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
  },
})

export const system = createSystem(defaultConfig, config)
export default system
