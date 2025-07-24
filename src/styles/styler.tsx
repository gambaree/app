import { useLayoutEffect, useRef, useCallback } from 'preact/hooks'
import { ComponentChildren } from 'preact'
import { styles as defaultStyles } from '@/styles'
import { ui, render } from '@tenoxui-lib'

export function styler({ children }: { children: ComponentChildren }) {
  const STYLE_ID = 'tenoxui-main-style'
  const styleTagRef = useRef<HTMLStyleElement | null>(null)
  const appRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const updateTimeoutRef = useRef<number | null>(null)
  const lastCSSRef = useRef<string>('')
  const baseStylesRef = useRef<string>('')

  // Memoize base styles calculation
  useLayoutEffect(() => {
    if (ui.render && defaultStyles) {
      baseStylesRef.current = ui.render(defaultStyles)
    }
  }, [])

  // Debounced update function to batch multiple rapid changes
  const updateStyles = useCallback(() => {
    if (updateTimeoutRef.current) {
      cancelAnimationFrame(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = requestAnimationFrame(() => {
      if (!appRef.current || !styleTagRef.current || !render) return

      try {
        const componentCSS = render(appRef.current)
        const newCSS = baseStylesRef.current + componentCSS

        // Only update DOM if CSS actually changed
        if (newCSS !== lastCSSRef.current) {
          styleTagRef.current.textContent = newCSS
          lastCSSRef.current = newCSS
        }
      } catch (error) {
        console.error('Error generating CSS:', error)
      }
    })
  }, [])

  // Initialize style tag
  useLayoutEffect(() => {
    const existingStyle = document.getElementById(STYLE_ID) as HTMLStyleElement
    if (existingStyle) {
      styleTagRef.current = existingStyle
    } else {
      const styleTag = document.createElement('style')
      styleTag.id = STYLE_ID
      document.head.appendChild(styleTag)
      styleTagRef.current = styleTag
    }

    return () => {
      if (updateTimeoutRef.current) {
        cancelAnimationFrame(updateTimeoutRef.current)
      }
    }
  }, [])

  // Setup mutation observer with optimized configuration
  useLayoutEffect(() => {
    if (!appRef.current) return

    // Initial style generation
    updateStyles()

    // Create optimized observer
    observerRef.current = new MutationObserver((mutations) => {
      // Quick check if any relevant mutations occurred
      const hasRelevantMutation = mutations.some((mutation) => {
        return (
          (mutation.type === 'attributes' && mutation.attributeName === 'class') ||
          (mutation.type === 'childList' &&
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0))
        )
      })

      if (hasRelevantMutation) {
        updateStyles()
      }
    })

    // More targeted observation - only watch for class changes and direct child modifications
    observerRef.current.observe(appRef.current, {
      attributes: true,
      attributeFilter: ['class'], // Only watch class attribute changes
      childList: true,
      subtree: true,
      attributeOldValue: false, // Don't store old values to save memory
      characterData: false // Don't watch text content changes
    })

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [updateStyles])

  return <div ref={appRef}>{children}</div>
}

export default styler
