import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetAttributify(),
    presetWind3(),
    presetTypography(),
  ],
  transformers: [transformerDirectives()],
  shortcuts: {
    'subtle-link': 'text-[var(--c-muted)] transition-colors duration-300 hover:text-[var(--c-text)]',
    'section-title': 'text-12px uppercase text-[var(--c-soft)] font-mono',
  },
  theme: {
    colors: {
      accent: 'var(--c-accent)',
      text: 'var(--c-text)',
      muted: 'var(--c-muted)',
      soft: 'var(--c-soft)',
      border: 'var(--c-border)',
      panel: 'var(--c-panel)',
    },
  },
})
