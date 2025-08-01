import { useState, useRef, useEffect, useCallback } from 'preact/hooks'
import { useImageGeneration } from '../hooks/useImageGeneration'
import { useTheme } from '@/hooks/useTheme'
import type { AvailableFormats } from '@/types'
import {
  RiRefreshLine,
  RiDownloadLine,
  RiSideBarLine,
  RiCloseLine,
  RiMoonClearLine,
  RiSunLine
} from '@remixicon/react'

interface DesignProps {
  children: React.ReactNode
  width?: number
  height?: number
  scale?: number
  format?: AvailableFormats
  autoGenerate?: boolean
  showControls?: boolean
  className?: string
  fileName?: string
  full?: boolean
  styles?: Record<string, string | string[]>
}

export function Design({
  children,
  width = 1000,
  height = 1000,
  scale = 1,
  format = 'png',
  autoGenerate = true,
  showControls = true,
  className = '',
  fileName = '',
  full = true,
  styles = {}
}: DesignProps) {
  const { isDark, toggleTheme } = useTheme()
  const [htmlContent, setHtmlContent] = useState('')
  const [error, setError] = useState('')
  const [isDownloadSectionActive, setIsDownloadSectionActive] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const designRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  const { generateImage, downloadImage } = useImageGeneration(
    canvasRef,
    htmlContent,
    width,
    height,
    scale,
    format,
    setError,
    fileName,
    styles
  )

  const toggleDownloadSection = useCallback(() => {
    setIsDownloadSectionActive((prev) => !prev)
  }, [])

  const actionButtonClassName =
    'flex items-center justify-center size-35px bg-transparent hover:bg-neutral-500/20 text-neutral-800 dark:text-neutral-200 rounded-lg border border-neutral-500/70 transition-colors duration-300'

  const extractHtmlContent = useCallback(() => {
    if (designRef.current) {
      const designElement = designRef.current

      const outerHTML = designElement.outerHTML
      setHtmlContent(outerHTML)
    }
  }, [width, height, scale, format])

  useEffect(() => {
    if (designRef.current) {
      extractHtmlContent()

      if (autoGenerate) {
        observerRef.current = new MutationObserver(() => {
          extractHtmlContent()
        })

        observerRef.current.observe(designRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true,
          characterData: true
        })
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [extractHtmlContent, autoGenerate])

  useEffect(() => {
    if (htmlContent && autoGenerate) {
      generateImage()
    }
  }, [htmlContent, generateImage, autoGenerate])

  const handleGenerate = useCallback(() => {
    extractHtmlContent()
    setTimeout(() => generateImage(), 100)
  }, [extractHtmlContent, generateImage])

  return (
    <>
      <div className={!full ? 'max-w-screen overflow-auto' : ''}>
        <div ref={designRef} id="design">
          {children}
        </div>
      </div>

      {showControls && (
        <>
          <button
            onClick={toggleTheme}
            class="fixed bottom-16 right-4 z-1000 size-35px rounded-6px flex items-center justify-center [&_svg]:size-16px bg-neutral-950 hover:bg-neutral-800 text-neutral-50 transition-colors dark:bg-neutral-50 dark:text-neutral-950"
          >
            {isDark ? <RiMoonClearLine /> : <RiSunLine />}
          </button>
          <button
            onClick={toggleDownloadSection}
            className="fixed bottom-4 right-4 z-1002 size-35px size-35px rounded-6px flex items-center justify-center [&_svg]:size-16px bg-neutral-950 hover:bg-neutral-800 text-neutral-50 transition-colors dark:bg-neutral-50 dark:text-neutral-950"
          >
            {isDownloadSectionActive ? <RiCloseLine /> : <RiSideBarLine />}
          </button>

          <div
            className={`declarative-design-container max-w-500px bg-neutral-50 fixed z-1001 bottom-25 shadow-2xl rounded-4 border border-neutral-500/70 overflow-hidden dark:bg-neutral-950 dark:shadow-neutral-50/10 dark:text-neutral-50 ${
              isDownloadSectionActive ? 'left-4' : 'left--100%'
            } ${className}`}
          >
            <div className="border-neutral-500/70 border-b p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{fileName || 'untitled'}</h3>

                <div className="flex gap-2 items-center justify-center">
                  <button onClick={handleGenerate} className={actionButtonClassName}>
                    <RiRefreshLine size={16} />
                  </button>
                  <button onClick={downloadImage} className={actionButtonClassName}>
                    <RiDownloadLine size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 relative overflow-auto border rounded-lg p-4 border-neutral-500/70 bg-emerald-50 dark:bg-emerald-950">
                <canvas
                  ref={canvasRef}
                  width={width}
                  height={height}
                  className="w-full block max-w-full max-h-96 object-contain"
                />
              </div>
            </div>

            <div className="my-4 text-sm text-neutral-800 dark:text-neutral-200 px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>Width: {width}px</div>
                <div>Height: {height}px</div>
                <div>Scale: {scale}x</div>
                <div>Format: {format.toUpperCase()}</div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export type { AvailableFormats, Config } from '@/types'
export default Design
