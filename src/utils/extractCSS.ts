export const encodeCSS = (str: string) =>
  str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')

export const extract = async (link: string) => {
  try {
    const res = await fetch(link)
    const raw = await res.text()
    const viteCSSMatch = raw.match(/const\s+__vite__css\s*=\s*["'`]([\s\S]*?)["'`]/)
    if (viteCSSMatch) {
      return encodeCSS(viteCSSMatch[1])
    } else {
      return raw
    }
  } catch (err) {
    console.warn(`Failed to fetch CSS from ${link}`, err)
    return ''
  }
}

export async function extractCSS(externalCSS: string[]) {
  const cssChunks: string[] = []
  for (const id of externalCSS) {
    const link = document.querySelector<HTMLLinkElement>(`link#${id}`)
    if (link && link.rel === 'stylesheet' && link.href) {
      const href = link.href
      cssChunks.push(await extract(href))
    }
  }
  return cssChunks
}
