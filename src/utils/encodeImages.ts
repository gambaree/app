export async function encodeImages(node: HTMLElement, scale: number = 1): Promise<void> {
  const images = node.querySelectorAll('img')

  await Promise.all(
    Array.from(images).map(async (img) => {
      const src = img.getAttribute('src')
      if (!src || src.startsWith('data:')) return

      try {
        const response = await fetch(src, { mode: 'cors' })
        const blob = await response.blob()
        const reader = new FileReader()

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })

        img.setAttribute('src', base64)

        // rescale image to match input scale
        // check if the image has dynamic width
        if ((img.className && !img.className.includes('w-')) || !img.className.includes('size-')) {
          // if no, just fit the image into container
          img.classList.add(`[transform]-[scale(${1 / scale})]`, '[transform-origin]-[top_left]')
        }
      } catch (err) {
        console.warn('Failed to encode image source:', src, err)
      }
    })
  )
}
