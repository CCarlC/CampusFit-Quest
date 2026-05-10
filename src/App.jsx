import { useEffect, useRef, useState } from 'react'
import { StoreProvider, useStore } from './lib/store.jsx'
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
    <StoreProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </StoreProvider>
  )
}

function Shell() {
  const { state, actions } = useStore()
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
    const t = setTimeout(() => {
      const next = state.lifecycle?.pushQueue?.[0] || {
        from: 'Lily', dorm: '304', body: 'just verified · 25 min run', icon: 'LP',
      }
      setPushVisible(next)
      actions.markPushShown()
    }, 6800)
    return () => clearTimeout(t)
  }, [inOnboarding, tab, state.lifecycle?.pushQueue, actions])

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
        onTriggerPush={() => setPushVisible({ from: 'Lily', dorm: '304', body: 'just verified · 25 min run', icon: 'LP' })}
        onJumpToOnboarding={() => setForceOnboarding(true)}
      />
    </PhoneFrame>
  )
}
