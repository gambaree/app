import { defaultProperties, preflight } from '@tenoxui/preset-tailwind'

export const styles = {
  ...defaultProperties,
  ...preflight,
  ':root': '[--tw-default-font-sans]-Inter [--tw-default-font-mono]-[JetBrains_Mono]'
}
