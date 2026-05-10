// Seed data for CampusFit Quest demo.
// Designed to land the user mid-progress so screens feel alive on first load.

export const QUEST_REWARDS = {
  daily: 50,
  bonus: 20,
  social: 30,
  challenge: 80,
  comeback: 40,
}

export const QUEST_LIBRARY = [
  {
    id: 'q-daily-01',
    code: '#07',
    title: '20-min any workout',
    blurb: 'Move your body. Type-agnostic. Counts in HealthKit minutes.',
    type: 'daily',
    difficulty: 'core',
    minutes: 20,
    xp: 50,
    verified: false,
  },
  {
    id: 'q-bonus-01',
    code: '#11',
    title: 'After-dinner walk',
    blurb: '10 minutes outside, post 7pm. Fresh air bonus.',
    type: 'bonus',
    difficulty: 'easy',
    minutes: 10,
    xp: 20,
    verified: false,
  },
  {
    id: 'q-social-01',
    code: '#14',
    title: 'Workout with a squadmate',
    blurb: 'Verified by overlapping HealthKit windows. No screenshot needed.',
    type: 'social',
    difficulty: 'core',
    minutes: 25,
    xp: 30,
    verified: false,
  },
  {
    id: 'q-challenge-01',
    code: '#22',
    title: '45-min push session',
    blurb: 'For the days you have it in you. Heart rate zone 3+.',
    type: 'challenge',
    difficulty: 'hard',
    minutes: 45,
    xp: 80,
    verified: false,
  },
  {
    id: 'q-comeback-01',
    code: '#03',
    title: 'Easy 10-min return',
    blurb: 'Welcome back. Same XP as a daily, no extra badge — by design.',
    type: 'comeback',
    difficulty: 'easy',
    minutes: 10,
    xp: 40,
    verified: false,
    locked: true, // unlocks only when streakPaused
  },
]

export const ACHIEVEMENT_LIBRARY = [
  {
    id: 'first-sweat',
    name: 'First Sweat',
    crest: 'FS',
    description: 'Verified your first quest. The streak begins.',
    type: 'personal',
    rule: 'completedTasks >= 1',
    unlocked: false,
  },
  {
    id: 'three-day-streak',
    name: '3-Day Streak',
    crest: 'III',
    description: 'Three days in a row. Habit forming.',
    type: 'personal',
    rule: 'streak >= 3',
    unlocked: false,
  },
  {
    id: 'campus-runner',
    name: 'Campus Runner',
    crest: 'CR',
    description: '100+ verified minutes this week.',
    type: 'personal',
    rule: 'weeklyMinutes >= 100',
    unlocked: false,
  },
  {
    id: 'gym-rookie',
    name: 'Gym Rookie',
    crest: 'GR',
    description: '5 verified quests in your locker.',
    type: 'personal',
    rule: 'completedTasks >= 5',
    unlocked: false,
  },
  {
    id: 'squad-player',
    name: 'Squad Player',
    crest: 'SP',
    description: 'Completed a Social Quest with a squadmate.',
    type: 'personal',
    rule: 'socialCompleted >= 1',
    unlocked: false,
  },
  {
    id: 'squad-first-together',
    name: 'First Together',
    crest: '4×',
    description: 'Whole squad verified on the same day.',
    type: 'squad',
    rule: 'squadAllVerifiedToday',
    unlocked: false,
  },
  {
    id: 'dorm-marathon',
    name: 'Dorm Marathon',
    crest: '21',
    description: '21 days, squad still intact.',
    type: 'squad',
    rule: 'squadDays >= 21',
    unlocked: false,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    crest: '☾',
    description: 'Two squadmates verified after 22:00 on the same night.',
    type: 'squad',
    rule: 'squadNightTogether',
    unlocked: false,
  },
]

export function freshUser() {
  return {
    id: 'u-carl',
    name: 'Carl',
    handle: '@carl.cui',
    dorm: '304',
    avatar: 'CC',
    avatarColor: 'oxblood',
    xp: 0,
    level: 1,
    streak: 0,
    streakPaused: false,
    longestStreak: 0,
    streakHistory: [], // last 21 days, 0/1
    weeklyMinutes: 0,
    weeklyGoal: 180,
    completedTasks: 0,
    socialCompleted: 0,
    status: 'new',
    onboarded: false,
    goal: null, // 'lean' | 'build' | 'destress' | 'maintain'
    joinedAt: new Date().toISOString(),
  }
}

export function demoUser() {
  return {
    id: 'u-carl',
    name: 'Carl',
    handle: '@carl.cui',
    dorm: '304',
    avatar: 'CC',
    avatarColor: 'oxblood',
    xp: 1820,
    level: 4,
    streak: 5,
    streakPaused: false,
    longestStreak: 9,
    streakHistory: [1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,0,1,1,1,1,1],
    weeklyMinutes: 120,
    weeklyGoal: 180,
    completedTasks: 14,
    socialCompleted: 2,
    status: 'active',
    onboarded: true,
    goal: 'lean',
    joinedAt: '2026-04-22T10:00:00Z',
  }
}

export function demoSquad() {
  return {
    id: 's-dorm304',
    name: 'Dorm 304 Crew',
    crestColors: ['oxblood', 'jersey', 'navy', 'mint'],
    inviteCode: 'D304-FIT',
    weeklyGoalPerHead: 150,
    members: [
      { id: 'u-carl', name: 'Carl', avatar: 'CC', color: 'oxblood', todayVerified: false, weeklyMinutes: 120, streak: 5, isYou: true },
      { id: 'u-lily', name: 'Lily', avatar: 'LP', color: 'jersey', todayVerified: true, weeklyMinutes: 165, streak: 8, lastSeen: '21:14' },
      { id: 'u-rohan', name: 'Rohan', avatar: 'RM', color: 'navy', todayVerified: true, weeklyMinutes: 90, streak: 4, lastSeen: '18:02' },
      { id: 'u-mia', name: 'Mia', avatar: 'MC', color: 'mint', todayVerified: false, weeklyMinutes: 45, streak: 2, lastSeen: 'yesterday' },
    ],
    foundedDay: 12,
    nightTogetherCount: 0,
  }
}

export function demoLeaderboard() {
  return {
    xpRanking: [
      { rank: 1, name: 'Tara N.', dorm: '212', xp: 4480, delta: '+ 320' },
      { rank: 2, name: 'Jin H.', dorm: '108', xp: 4220, delta: '+ 240' },
      { rank: 3, name: 'Wendy K.', dorm: '301', xp: 3960, delta: '+ 180' },
      { rank: 4, name: 'Lily P.', dorm: '304', xp: 3110, delta: '+ 410', squad: 'D304' },
      { rank: 5, name: 'Aman S.', dorm: '417', xp: 2820, delta: '+ 90' },
      { rank: 12, name: 'Rohan M.', dorm: '304', xp: 2010, delta: '+ 220', squad: 'D304' },
      { rank: 14, name: 'Carl C.', dorm: '304', xp: 1820, delta: '+ 280', squad: 'D304', isYou: true },
      { rank: 22, name: 'Mia C.', dorm: '304', xp: 1140, delta: '+ 130', squad: 'D304' },
    ],
    mostImproved: [
      { rank: 1, name: 'Lily P.', dorm: '304', delta: '+ 410 XP', percent: 18, squad: 'D304' },
      { rank: 2, name: 'Sara T.', dorm: '202', delta: '+ 360 XP', percent: 16 },
      { rank: 3, name: 'Carl C.', dorm: '304', delta: '+ 280 XP', percent: 18, squad: 'D304', isYou: true },
      { rank: 4, name: 'Devon B.', dorm: '511', delta: '+ 250 XP', percent: 14 },
      { rank: 5, name: 'Rohan M.', dorm: '304', delta: '+ 220 XP', percent: 11, squad: 'D304' },
      { rank: 6, name: 'Iris W.', dorm: '109', delta: '+ 200 XP', percent: 9 },
    ],
    squadRanking: [
      { rank: 1, name: 'East Wing Wolves', dorm: '2F', minutes: 612, members: 5 },
      { rank: 2, name: 'Dorm 304 Crew', dorm: '3F', minutes: 420, members: 4, isYou: true },
      { rank: 3, name: 'Library Lifters', dorm: '4F', minutes: 380, members: 3 },
      { rank: 4, name: 'Kappa Run Club', dorm: '1F', minutes: 290, members: 6 },
      { rank: 5, name: 'Stair Master', dorm: '5F', minutes: 240, members: 2 },
    ],
  }
}

export function buildDemoState() {
  return {
    version: 3,
    user: demoUser(),
    quests: QUEST_LIBRARY.map((q) => ({ ...q })),
    achievements: ACHIEVEMENT_LIBRARY.map((a) => {
      // Pre-unlock a couple to make Achievements page feel lived-in.
      if (a.id === 'first-sweat') return { ...a, unlocked: true, unlockedAt: '2026-04-22T10:14:00Z' }
      if (a.id === 'three-day-streak') return { ...a, unlocked: true, unlockedAt: '2026-04-25T19:00:00Z' }
      return { ...a }
    }),
    squad: demoSquad(),
    leaderboard: demoLeaderboard(),
    lifecycle: {
      seenPushAt: null,
      pushQueue: [
        { id: 'p-lily-1', from: 'Lily', dorm: '304', body: 'just verified · 25 min run', icon: 'LP' },
      ],
      newDots: { achievements: false, leaderboard: false, squad: false },
      lastVerifiedTaskId: null,
    },
  }
}

export function buildFreshState() {
  return {
    version: 3,
    user: freshUser(),
    quests: [],
    achievements: ACHIEVEMENT_LIBRARY.map((a) => ({ ...a })),
    squad: null,
    leaderboard: demoLeaderboard(),
    lifecycle: {
      seenPushAt: null,
      pushQueue: [],
      newDots: { achievements: false, leaderboard: false, squad: false },
      lastVerifiedTaskId: null,
    },
  }
}
