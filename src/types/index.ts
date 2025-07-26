export type AvailableFormats = 'jpg' | 'jpeg' | 'png' | 'webp' | 'svg' | 'html' | 'pdf'

export interface Config {
  width: number
  height: number
  name?: string
  scale?: number
  format?: AvailableFormats
  control?: boolean
  full?: boolean
  styles?: Record<string, string | string[]>
}
