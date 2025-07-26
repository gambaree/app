import { Design } from './components/designControl'
import { Content, config } from '@/design'
import { getName } from './utils/getName'
import type { Config } from './types'

export function App() {
  const {
    width = 1000,
    height = 1000,
    scale = 1,
    format = 'jpg',
    name = getName('untitled'),
    control = true,
    full = false,
    styles = {}
  }: Config = config

  if (!control) {
    return (
      <div className={!full ? 'max-w-screen overflow-auto' : ''}>
        <Content />
      </div>
    )
  }

  const clamp = (scale: number, max: number, min: number): number => (scale > max ? min : scale)

  return (
    <Design
      width={clamp(width, 5000, 1000)}
      height={clamp(height, 5000, 1000)}
      scale={clamp(scale, 5, 1)}
      format={format}
      autoGenerate={true}
      showControls={true}
      fileName={name}
      full={full}
      styles={styles}
    >
      <Content />
    </Design>
  )
}
