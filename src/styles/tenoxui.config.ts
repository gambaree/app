/*
 * Define your TenoxUI configuration here
 * see: https://tenoxui.web.app/docs/config/intro.html
 */

import { preset } from '@tenoxui/preset-tailwind'
const { variants, aliases, ...config } = preset()

export default {
  ...config,
  variants: { ...variants, dark: "value:[data-theme='dark'] &" },
  aliases: { ...aliases, center: 'flex items-center justify-center', ngen: 'bg-red' }
}
