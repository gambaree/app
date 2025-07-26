import { defaultProperties, preflight } from '@tenoxui/preset-tailwind'

// TenoxUI direct styles
export const styles = {
  ...defaultProperties,
  ...preflight,
  ':root': '[--tw-default-font-sans]-Inter [--tw-default-font-mono]-[JetBrains_Mono]'
}
// External CSS IDs
export const externalCSS = ['default-css']
// Font-specific CSS goes here
export const fonts = ['google-fonts']
