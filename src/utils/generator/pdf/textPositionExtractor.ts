export function extractTextPositions(htmlContent: string, scale: number) {
  const textElements: Array<{
    text: string
    x: number
    y: number
    fontSize?: number
    fontFamily?: string
  }> = []

  const walker = document.createTreeWalker(
    new DOMParser().parseFromString(htmlContent, 'text/html').body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node
  while ((node = walker.nextNode())) {
    if (node.textContent?.trim()) {
      const element = node.parentElement
      if (element) {
        const rect = element.getBoundingClientRect()
        const styles = getComputedStyle(element)

        textElements.push({
          text: node.textContent.trim(),
          x: rect.left * scale,
          y: rect.top * scale,
          fontSize: parseInt(styles.fontSize) * scale,
          fontFamily: styles.fontFamily
        })
      }
    }
  }

  return textElements
}
