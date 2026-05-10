import { useEffect, useRef, useState } from 'react'
import { StoreProvider, useStore } from './lib/store.jsx'
import { I18nProvider, useI18n } from './lib/i18n.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { PhoneFrame } from './components/Layout.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { BadgeUnlockModal } from './components/BadgeUnlockModal.jsx'
import { PushNotification } from './components/PushNotification.jsx'
import { DemoConsole } from './components/DemoConsole.jsx'
import { Home } from './pages/Home.jsx'
import { Quests } from './pages/Quests.jsx'
import { Squad } from './pages/Squad.jsx'
import { Achievements } from './pages/Achievements.jsx'
import { Leaderboard } from './pages/Leaderboard.jsx'
import { Onboarding } from './pages/Onboarding.jsx'

export default function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </StoreProvider>
    </I18nProvider>
  )
}

function Shell() {
  const { state, actions } = useStore()
  const { t } = useI18n()
  const [tab, setTab] = useState('home')
  const [forceOnboarding, setForceOnboarding] = useState(false)
  const [pushVisible, setPushVisible] = useState(null)
  const [unlockQueue, setUnlockQueue] = useState([])

  // Watch for newly unlocked badges & queue them.
  useEffect(() => {
    const newly = state._justUnlocked
    if (newly && newly.length) {
      setUnlockQueue((q) => [...q, ...newly])
      actions.clearJustUnlocked()
    }
  }, [state._justUnlocked, actions])

  const inOnboarding = forceOnboarding || !state.user.onboarded

  // Auto-trigger Lily push ~7s after entering Home (once per session).
  const pushedRef = useRef(false)
  useEffect(() => {
    if (inOnboarding) return
    if (pushedRef.current) return
    if (tab !== 'home') return
    pushedRef.current = true
    const timer = setTimeout(() => {
      setPushVisible({
        from: t('name.lily'), dorm: '304', body: t('push.lily.body'), icon: 'LP',
      })
      actions.markPushShown()
    }, 6800)
    return () => clearTimeout(timer)
  }, [inOnboarding, tab, actions, t])

  if (inOnboarding) {
    return (
      <PhoneFrame>
        <Onboarding onDone={() => { setForceOnboarding(false); setTab('home'); pushedRef.current = false }} />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PushNotification push={pushVisible} onDismiss={() => setPushVisible(null)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {tab === 'home' && <Home onNavigate={setTab} />}
          {tab === 'quests' && <Quests />}
          {tab === 'squad' && <Squad />}
          {tab === 'achievements' && <Achievements />}
          {tab === 'leaderboard' && <Leaderboard />}
        </div>
      </div>

      <BottomNav active={tab} onChange={setTab} />

      <BadgeUnlockModal
        badge={unlockQueue[0]}
        onClose={() => setUnlockQueue((q) => q.slice(1))}
      />

      <DemoConsole
        onTriggerPush={() => setPushVisible({ from: t('name.lily'), dorm: '304', body: t('push.lily.body'), icon: 'LP' })}
        onJumpToOnboarding={() => setForceOnboarding(true)}
      />
    </PhoneFrame>
  )
}
