import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { buildDemoState, buildFreshState } from './seed.js'

const STORAGE_KEY = 'campusfit.v3.state'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== 3) return null
    return parsed
  } catch {
    return null
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    void error
  }
}

function deriveLevel(xp) {
  return Math.floor(xp / 500) + 1
}

function xpInLevel(xp) {
  return xp % 500
}

function checkAchievements(state) {
  const u = state.user
  const newly = []
  const next = state.achievements.map((a) => {
    if (a.unlocked) return a
    const pass = (() => {
      switch (a.id) {
      case 'first-sweat':
        return u.completedTasks >= 1
      case 'three-day-streak':
        return u.streak >= 3
      case 'campus-runner':
        return u.weeklyMinutes >= 100
      case 'gym-rookie':
        return u.completedTasks >= 5
      case 'squad-player':
        return u.socialCompleted >= 1
      case 'squad-first-together':
        return !!state.squad && state.squad.members.every((m) => m.todayVerified)
      case 'night-owl':
        return !!state.squad && (state.squad.nightTogetherCount ?? 0) >= 1
      default:
        return false
      }
    })()
    if (pass) {
      newly.push({ ...a, unlocked: true, unlockedAt: new Date().toISOString() })
      return { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
    }
    return a
  })
  return { achievements: next, newly }
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.state

    case 'RESET_DEMO':
      return buildDemoState()

    case 'RESET_FRESH':
      return buildFreshState()

    case 'ONBOARD_PICK_GOAL':
      return { ...state, user: { ...state.user, goal: action.goal } }

    case 'ONBOARD_INVITE': {
      // action.mode: 'squad' | 'solo'
      if (action.mode === 'solo') {
        return { ...state, user: { ...state.user, status: 'active' } }
      }
      // join demo squad
      const squad = action.squad
      return { ...state, squad, user: { ...state.user, status: 'active' } }
    }

    case 'ONBOARD_SEED_FIRST_QUEST': {
      const firstQuest = {
        id: 'q-onboard-walk',
        code: '#01',
        title: 'Walk 1500 steps',
        blurb: 'A gentle first quest. HealthKit will count it for you.',
        type: 'daily',
        difficulty: 'easy',
        minutes: 12,
        xp: 50,
        verified: false,
        isFirst: true,
      }
      return { ...state, quests: [firstQuest], user: { ...state.user, onboarded: false } }
    }

    case 'COMPLETE_ONBOARDING':
      return { ...state, user: { ...state.user, onboarded: true, status: 'active' } }

    case 'VERIFY_TASK': {
      const { taskId, mockSteps, mockMinutes } = action
      const task = state.quests.find((t) => t.id === taskId)
      if (!task || task.verified) return state

      const minutesGained = mockMinutes ?? task.minutes
      const verified = {
        ...task,
        verified: true,
        verifiedAt: new Date().toISOString(),
        verifiedSteps: mockSteps,
        verifiedMinutes: minutesGained,
      }

      const quests = state.quests.map((q) => (q.id === taskId ? verified : q))

      const newXp = state.user.xp + task.xp
      const newCompletedTasks = state.user.completedTasks + 1
      const newWeekly = state.user.weeklyMinutes + minutesGained
      const newSocial = task.type === 'social' ? state.user.socialCompleted + 1 : state.user.socialCompleted

      // Streak rules (V3):
      // - comeback task resumes from paused state (no increment, just unpause)
      // - any other verify = +1 streak
      let newStreak = state.user.streak
      if (state.user.streakPaused && task.type === 'comeback') {
        newStreak = state.user.streak // resume in place
      } else {
        newStreak = state.user.streak + 1
      }

      // Squad: mark current user verified, accumulate weeklyMinutes.
      let squad = state.squad
      if (squad) {
        const members = squad.members.map((m) =>
          m.isYou
            ? { ...m, todayVerified: true, weeklyMinutes: m.weeklyMinutes + minutesGained, streak: newStreak }
            : m,
        )
        squad = { ...squad, members }
      }

      let newState = {
        ...state,
        quests,
        squad,
        user: {
          ...state.user,
          xp: newXp,
          level: deriveLevel(newXp),
          streak: newStreak,
          streakPaused: false,
          weeklyMinutes: newWeekly,
          completedTasks: newCompletedTasks,
          socialCompleted: newSocial,
          longestStreak: Math.max(state.user.longestStreak, newStreak),
          status: state.user.status === 'comeback' ? 'active' : state.user.status,
        },
        lifecycle: {
          ...state.lifecycle,
          newDots: {
            ...state.lifecycle.newDots,
            achievements: true,
            leaderboard: true,
            squad: !!squad,
          },
          lastVerifiedTaskId: taskId,
        },
      }

      const { achievements, newly } = checkAchievements(newState)
      newState = { ...newState, achievements, _justUnlocked: newly }
      return newState
    }

    case 'CLEAR_JUST_UNLOCKED':
      return { ...state, _justUnlocked: [] }

    case 'DISMISS_JUST_UNLOCKED':
      return { ...state, _justUnlocked: state._justUnlocked?.slice(1) ?? [] }

    case 'CLEAR_DOT':
      return {
        ...state,
        lifecycle: {
          ...state.lifecycle,
          newDots: { ...state.lifecycle.newDots, [action.tab]: false },
        },
      }

    case 'PUSH_SHOWN':
      return { ...state, lifecycle: { ...state.lifecycle, seenPushAt: Date.now() } }

    case 'HIGH_FIVE': {
      if (!state.squad) return state
      const members = state.squad.members.map((m) =>
        m.id === action.memberId ? { ...m, highFived: true, highFiveCount: (m.highFiveCount || 0) + 1 } : m,
      )
      return { ...state, squad: { ...state.squad, members } }
    }

    case 'LEAVE_SQUAD':
      return { ...state, squad: null }

    case 'JOIN_DEMO_SQUAD': {
      const { demoSquad } = action
      return { ...state, squad: demoSquad }
    }

    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const loaded = load()
    return loaded || buildDemoState()
  })

  // Persist to localStorage on every change.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    }
    persist(state)
  }, [state])

  const api = useMemo(() => ({
    state,
    dispatch,
    actions: {
      verifyTask: (taskId, opts = {}) =>
        dispatch({
          type: 'VERIFY_TASK',
          taskId,
          mockSteps: opts.mockSteps,
          mockMinutes: opts.mockMinutes,
        }),
      clearJustUnlocked: () => dispatch({ type: 'CLEAR_JUST_UNLOCKED' }),
      dismissJustUnlocked: () => dispatch({ type: 'DISMISS_JUST_UNLOCKED' }),
      clearDot: (tab) => dispatch({ type: 'CLEAR_DOT', tab }),
      markPushShown: () => dispatch({ type: 'PUSH_SHOWN' }),
      highFive: (memberId) => dispatch({ type: 'HIGH_FIVE', memberId }),
      leaveSquad: () => dispatch({ type: 'LEAVE_SQUAD' }),
      joinDemoSquad: (demoSquad) => dispatch({ type: 'JOIN_DEMO_SQUAD', demoSquad }),
      onboardPickGoal: (goal) => dispatch({ type: 'ONBOARD_PICK_GOAL', goal }),
      onboardInvite: (mode, squad) => dispatch({ type: 'ONBOARD_INVITE', mode, squad }),
      onboardSeedFirstQuest: () => dispatch({ type: 'ONBOARD_SEED_FIRST_QUEST' }),
      completeOnboarding: () => dispatch({ type: 'COMPLETE_ONBOARDING' }),
      resetDemo: () => dispatch({ type: 'RESET_DEMO' }),
      resetFresh: () => dispatch({ type: 'RESET_FRESH' }),
    },
  }), [state])

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function useUser() {
  return useStore().state.user
}

export function xpProgress(xp) {
  const inLevel = xpInLevel(xp)
  return { current: inLevel, max: 500, level: deriveLevel(xp), pct: (inLevel / 500) * 100 }
}
