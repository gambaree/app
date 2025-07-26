import { useCallback } from 'preact/hooks'
import { RefObject } from 'preact'
import { generateHTML } from '@/utils/generator/html'
import { generateSVG } from '@/utils/generator/svg'
import { jsPDF } from 'jspdf'
import { extractTextPositions } from '@/utils/generator/pdf/textPositionExtractor'
import { getName } from '@/utils/getName'

export function useImageGeneration(
  canvasRef: RefObject<HTMLCanvasElement>,
  htmlContent: string,
  width: number,
  height: number,
  scale: number,
  outputFormat: string,
  setError: (error: string) => void,
  fileName?: string,
  styles?: Record<string, string | string[]>
) {
  const generateImage = useCallback(async () => {
    try {
      setError('')
      if (!canvasRef.current) {
        throw new Error('Canvas reference is not available')
      }

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return null
      const scaledWidth = width * scale
      const scaledHeight = height * scale

      canvasRef.current.width = scaledWidth
      canvasRef.current.height = scaledHeight

      ctx.clearRect(0, 0, scaledWidth, scaledHeight)

      const svgData = await generateSVG(htmlContent, scaledWidth, scaledHeight, scale, styles)
      const img = new Image()
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      ctx.drawImage(img, 0, 0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to generate image: ${errorMessage}`)
    }
  }, [canvasRef, htmlContent, width, height, scale, setError])

  const downloadPDF = useCallback(async () => {
    try {
      setError('')

      if (!canvasRef.current) {
        throw new Error('Canvas reference is not available')
      }

      await generateImage()

      const canvasWidth = canvasRef.current.width
      const canvasHeight = canvasRef.current.height
      const aspectRatio = canvasWidth / canvasHeight

      const pdfWidth: number = aspectRatio > 1 ? 297 : 210
      const pdfHeight: number = aspectRatio > 1 ? 210 : 297
      const orientation: 'portrait' | 'landscape' = aspectRatio > 1 ? 'landscape' : 'portrait'

      let imgWidth = pdfWidth
      let imgHeight = pdfWidth / aspectRatio

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight
        imgWidth = pdfHeight * aspectRatio
      }

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4'
      })

      pdf.addImage(
        canvasRef.current.toDataURL('image/jpeg', 1.0),
        'JPEG',
        (pdfWidth - imgWidth) / 2,
        (pdfHeight - imgHeight) / 2,
        imgWidth,
        imgHeight
      )

      // Extract text elements and their positions from DOM and -
      // create invisible text layer for some text-reader to work.
      extractTextPositions(htmlContent, scale).forEach(({ text, x, y, fontSize, fontFamily }) => {
        pdf.setFont(fontFamily || 'helvetica')
        pdf.setFontSize(fontSize || 12)
        pdf.setTextColor(255, 255, 255, 0)
        pdf.text(text, x, y)
      })

      const pdfFileName = (fileName || getName('generated')) + '.pdf'

      pdf.save(pdfFileName)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to download PDF: ${errorMessage}`)
    }
  }, [canvasRef, generateImage, fileName, setError])

  const downloadImage = useCallback(async () => {
    try {
      setError('')

      if (outputFormat === 'pdf') {
        await downloadPDF()
        return
      }

      const link = document.createElement('a')
      link.download = (fileName || getName('generated')) + `.${outputFormat}`

      if (outputFormat === 'svg') {
        const svgData = await generateSVG(htmlContent, width * scale, height * scale, scale, styles)
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        link.href = URL.createObjectURL(blob)
      } else if (outputFormat === 'html') {
        const htmlTemplate = await generateHTML(htmlContent)
        const blob = new Blob([htmlTemplate], { type: 'text/html' })
        link.href = URL.createObjectURL(blob)
      } else {
        if (!canvasRef.current) {
          throw new Error('Canvas reference is not available')
        }
        await generateImage()
        link.href = canvasRef.current.toDataURL(`image/${outputFormat}`)
      }

      link.click()

      if (outputFormat === 'svg') {
        URL.revokeObjectURL(link.href)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to download image: ${errorMessage}`)
    }
  }, [
    canvasRef,
    htmlContent,
    width,
    height,
    scale,
    outputFormat,
    generateImage,
    downloadPDF,
    setError,
    fileName,
    styles
  ])

  return { generateImage, downloadImage, downloadPDF }
}
