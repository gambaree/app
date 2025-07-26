import { Config } from '@/types'

/* Available Options */
export const config: Config = {
  width: 1000, // canvas width (in px)
  height: 1000, // canvas height (in px)
  scale: 5, // upscale canvas to {number}x
  format: 'png', // 'jpg' | 'jpeg' | 'png' | 'webp' | 'svg' | 'html' | 'pdf'
  name: 'my-design', // output file name
  control: true, // enable this to show preview & download panel, disable this to prevent delaying style generation issue, just enable when you're on final stage, or ready to download
  full: true, // if set to false, make the design fit to the screen (scrollable)
  styles: {
    // external styles as object
    // selector: classNames
    '.my-div': 'bg-#ccf654 size-50 text-black rounded-md'
  }
}

/* Design Content Example */
export function Content() {
  return (
    <main
      class={`w-${config.width}px h-${config.height}px bg-black text-white center text-4xl font-medium tracking-tighter gap-8 flex-col [&_div]:center`}
    >
      Hello World!
      <div class="my-div">h</div>
      <div class="tenox size-20 rounded-sm">h</div>
    </main>
  )
}
