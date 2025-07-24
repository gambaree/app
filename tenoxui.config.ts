import { styles as apply } from './src/styles/index.ts'
import { preset } from '@tenoxui/preset-tailwind'
const { variants, ...config } = preset()

const css = {
  ...config,
  variants: { ...variants, dark: "value:[data-theme='dark'] &" }
}

export default {
  include: ['index.html', 'src/**/*.{js,jsx,ts,tsx}', 'src/lib/syntax-highlighter/preset.ts'],
  exclude: [
    'src/design/*',
    'src/components/designControl.tsx',
    'src/pages/design.tsx',
    'src/lib/*',
    'src/utils/*'
  ],
  css: {
    ...css,
    apply
  }
}
