import { DeclarativeDesign, DesignOptions } from './components/designControl'
import { Content, config } from '@/design'

export function App() {
  const {
    width = 1000,
    height = 1000,
    scale = 1,
    format = 'jpg',
    name = `untitled-${new Date()
      .toISOString()
      .slice(2, 19)
      .replace(/[-:]/g, '')
      .replace('T', '-')}`,
    control = true,
    full = false,
    styles = {}
  }: DesignOptions = config

  if (!control) {
    return (
      <div className={!full ? 'max-w-screen overflow-auto' : ''}>
        <Content />
      </div>
    )
  }

  const clamp = (scale: number, max: number, min: number): number => (scale > max ? min : scale)

  return (
    <DeclarativeDesign
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
    </DeclarativeDesign>
  )
}
