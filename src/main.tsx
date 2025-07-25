import { render } from 'preact'
import { App } from './app'
import TenoxUIDevMode from './styles/styler'

const isDev = import.meta.env.DEV

function Root() {
  return (
    <TenoxUIDevMode>
      <div class="h-screen w-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50">
        {isDev ? (
          <App />
        ) : (
          <div class="w-screen h-screen flex flex-col items-center justify-center p-4">
            <header class="text-balance text-center">
              <h1 class="text-6xl font-semibold tracking-tighter">Oops :o</h1>
              <p class="mt-8 font-medium text-3xl tracking-tight text-current/70">
                This app isn't meant to be built as a static app!
              </p>
            </header>
          </div>
        )}
      </div>
    </TenoxUIDevMode>
  )
}

render(<Root />, document.getElementById('app')!)
