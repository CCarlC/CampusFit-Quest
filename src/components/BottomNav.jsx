import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'

const TABS = [
  { id: 'home', i18n: 'nav.home', glyph: 'H' },
  { id: 'quests', i18n: 'nav.quests', glyph: 'Q' },
  { id: 'squad', i18n: 'nav.squad', glyph: 'S' },
  { id: 'achievements', i18n: 'nav.badges', glyph: 'B' },
  { id: 'leaderboard', i18n: 'nav.ranks', glyph: 'R' },
]

export function BottomNav({ active, onChange }) {
  const { state, actions } = useStore()
  const { t } = useI18n()
  const dots = state.lifecycle.newDots

  return (
    <nav className="relative z-30 mx-auto w-full max-w-[440px] border-t-2 border-ink bg-paper">
      <div className="absolute -top-[6px] left-0 right-0 h-[6px] stripe-tape opacity-90" />
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          const dotKey = tab.id === 'achievements' ? 'achievements' : tab.id === 'leaderboard' ? 'leaderboard' : tab.id === 'squad' ? 'squad' : null
          const showDot = dotKey && dots[dotKey]
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(tab.id)
                  if (dotKey) actions.clearDot(dotKey)
                }}
                className={[
                  'relative flex w-full flex-col items-center gap-0.5 px-1 py-2.5 transition-colors',
                  isActive ? 'text-oxblood' : 'text-ink/55 hover:text-ink',
                ].join(' ')}
              >
                <span
                  className={[
                    'font-display flex h-7 w-7 items-center justify-center text-[15px] font-black leading-none',
                    isActive ? 'bg-oxblood text-cream' : 'border border-ink/40',
                  ].join(' ')}
                  style={{ borderRadius: '3px' }}
                >
                  {tab.glyph}
                </span>
                <span className="font-mono text-[9px] font-bold tracking-[0.18em]">{t(tab.i18n)}</span>
                {showDot && (
                  <span className="animate-red-dot absolute right-3 top-1.5 h-2 w-2 bg-jersey-deep" style={{ borderRadius: '50%' }} />
                )}
                {isActive && (
                  <span className="absolute -top-[2px] left-1/2 h-[3px] w-8 -translate-x-1/2 bg-oxblood" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
