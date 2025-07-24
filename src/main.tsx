import { render } from 'preact'
import { App } from './app'
import { useTheme } from './hooks/useTheme'
import { RiMoonClearLine, RiSunLine } from '@remixicon/react'
import TenoxUIDevMode from './styles/styler'

const isDev = import.meta.env.DEV

function Root() {
  const { toggleTheme, isDark } = useTheme()

  return (
    <TenoxUIDevMode>
      <button
        onClick={toggleTheme}
        className="fixed bottom-16 right-4 z-1000 size-35px rounded-6px flex items-center justify-center [&_svg]:size-16px bg-neutral-950 hover:bg-neutral-800 text-neutral-50 transition-colors dark:bg-neutral-50 dark:text-neutral-950"
      >
        {isDark ? <RiMoonClearLine /> : <RiSunLine />}
      </button>

      <div className="h-screen w-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50">
        {isDev ? <App /> : <>Dev mode only!</>}
      </div>
    </TenoxUIDevMode>
  )
}

render(<Root />, document.getElementById('app')!)
