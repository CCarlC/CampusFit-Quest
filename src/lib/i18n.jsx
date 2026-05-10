import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'campusfit.v4.locale'
const DEFAULT_LOCALE = 'zh'

function detectInitial() {
  // Default to Chinese for new visitors. Respect an explicit prior pick.
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch (error) {
    void error
  }
  return DEFAULT_LOCALE
}

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectInitial)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, locale) } catch (error) { void error }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
      document.documentElement.dataset.locale = locale
    }
  }, [locale])

  const setLocale = useCallback((l) => setLocaleState(l), [])
  const toggleLocale = useCallback(() => setLocaleState((l) => (l === 'zh' ? 'en' : 'zh')), [])

  const t = useCallback((key, vars) => {
    const entry = DICT[key]
    if (!entry) return key
    const raw = entry[locale] ?? entry.en ?? key
    return interpolate(raw, vars)
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, toggleLocale, t }), [locale, setLocale, toggleLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

// ---------------------------------------------------------------------------
// Dictionary
// ---------------------------------------------------------------------------

const DICT = {
  // -- Brand / chrome ----
  'brand.name': { en: 'CampusFit Quest', zh: 'CampusFit 校园健身' },
  'brand.tagline': { en: 'CampusFit Quest · Dorm 304', zh: 'CampusFit · 宿舍 304' },
  'brand.vol': { en: 'VOL.III', zh: '第三卷' },
  'brand.assoc': { en: 'CampusFit Athletic Association · est. 2026 · vol III', zh: 'CampusFit 校园健身协会 · 创立于 2026 · 第三卷' },
  'brand.tickerLine': { en: 'EST. 2026 — DORM 304 ATHLETIC ASSOCIATION   ·   VERIFIED BY HEALTHKIT   ·   NO SELF-REPORT, NO CHEAT   ·   THE STREAK CONTINUES   ·', zh: '2026 创立 · 宿舍 304 健身联盟  ·  HealthKit 全程校验  ·  拒绝自报 · 拒绝作弊  ·  连续打卡进行中  ·' },

  // -- Status bar / header chrome ----
  'chrome.healthkitConnected': { en: 'HEALTHKIT · CONNECTED', zh: 'HEALTHKIT · 已连接' },
  'chrome.onboarding': { en: 'ONBOARDING', zh: '新用户引导' },
  'chrome.est': { en: 'EST. 2026', zh: '创立 2026' },
  'chrome.dormLabel': { en: 'DORM', zh: '宿舍' },
  'chrome.issue': { en: 'ISSUE · {issue}', zh: '期号 · {issue}' },

  // -- Bottom nav ----
  'nav.home': { en: 'HOME', zh: '主页' },
  'nav.quests': { en: 'QUESTS', zh: '任务' },
  'nav.squad': { en: 'SQUAD', zh: '小队' },
  'nav.badges': { en: 'BADGES', zh: '徽章' },
  'nav.ranks': { en: 'RANKS', zh: '排行' },

  // -- Common buttons / UI ----
  'common.continue': { en: 'CONTINUE →', zh: '继续 →' },
  'common.you': { en: 'YOU', zh: '你' },
  'common.youDash': { en: '— YOU', zh: '— 你' },
  'common.open': { en: 'OPEN →', zh: '查看 →' },
  'common.close': { en: '× CLOSE', zh: '× 关闭' },
  'common.now': { en: 'NOW', zh: '今日' },
  'common.locked': { en: 'LOCKED', zh: '未解锁' },
  'common.stamped': { en: 'STAMPED', zh: '已盖章' },
  'common.verified': { en: 'VERIFIED', zh: '已校验' },
  'common.pending': { en: 'PENDING', zh: '待完成' },
  'common.fresh': { en: 'FRESH', zh: '新鲜' },
  'common.solo': { en: 'SOLO', zh: '单人' },
  'common.demoTag': { en: 'DEMO', zh: '示例' },

  // -- VerifyButton ----
  'verify.cta': { en: 'VERIFY WORKOUT', zh: '校验运动数据' },
  'verify.healthkit': { en: 'HEALTHKIT', zh: 'HEALTHKIT' },
  'verify.read': { en: 'READ', zh: '读取中' },
  'verify.line.connect': { en: 'Connecting to HealthKit…', zh: '正在连接 HealthKit…' },
  'verify.line.steps': { en: 'Reading step count…', zh: '读取步数…' },
  'verify.line.minutes': { en: 'Reading active minutes…', zh: '读取活动分钟数…' },
  'verify.line.heart': { en: 'Cross-checking heart rate…', zh: '交叉校验心率区间…' },
  'verify.line.stamp': { en: 'Stamping signature…', zh: '盖章签名…' },
  'verify.steps': { en: 'steps', zh: '步' },
  'verify.minutes': { en: 'min', zh: '分钟' },

  // -- Toast ----
  'toast.title.xpStreak': { en: '+{xp} XP · STREAK {streak}', zh: '+{xp} XP · 连续 {streak} 天' },
  'toast.body.verifyDetail': { en: '{steps} steps · {minutes} min · {title}', zh: '{steps} 步 · {minutes} 分钟 · {title}' },
  'toast.title.verified': { en: '+{xp} XP VERIFIED{tail}', zh: '+{xp} XP 已校验{tail}' },
  'toast.tail.noBadge': { en: ' · NO EXTRA BADGE — BY DESIGN', zh: ' · 不发额外徽章（设计如此）' },
  'toast.title.firstVerify': { en: '+50 XP · STREAK 1', zh: '+50 XP · 连续 1 天' },
  'toast.body.firstVerify': { en: '{steps} steps · {minutes} min · first verify', zh: '{steps} 步 · {minutes} 分钟 · 首次校验通过' },
  'toast.title.highFive': { en: 'HIGH-FIVE → {name}', zh: '击掌 → {name}' },
  'toast.body.highFive': { en: 'Sent for a verified workout. (Disabled for unfinished members by design.)', zh: '已为对方的已校验运动击掌。未完成成员故意禁用。' },

  // -- Onboarding ----
  'onb.intro.tag': { en: '// CAMPUSFIT QUEST · DORM 304', zh: '// CAMPUSFIT · 宿舍 304' },
  'onb.intro.headlineA': { en: 'Move your body.', zh: '动起来。' },
  'onb.intro.headlineB': { en: 'Get the', zh: '把这一刻' },
  'onb.intro.headlineC': { en: 'stamp.', zh: '盖个章。' },
  'onb.intro.body': { en: 'Daily quests, verified by HealthKit. No screenshots. No self-report. Squads optional.', zh: '每日任务，HealthKit 校验。不用截图，不用自报，小队可选。' },
  'onb.intro.pill1k': { en: '3', zh: '3' },
  'onb.intro.pill1v': { en: 'STEP SETUP', zh: '步注册' },
  'onb.intro.pill2k': { en: '≤90s', zh: '≤90 秒' },
  'onb.intro.pill2v': { en: 'TIME TO TASK 1', zh: '上首个任务' },
  'onb.intro.pill3k': { en: '0', zh: '0' },
  'onb.intro.pill3v': { en: 'SELF-REPORT', zh: '自报字段' },
  'onb.intro.sample.tag': { en: '// SAMPLE QUEST', zh: '// 任务示例' },
  'onb.intro.sample.code': { en: '#01', zh: '#01' },
  'onb.intro.sample.title': { en: 'Walk 1500 steps', zh: '走 1500 步' },
  'onb.intro.sample.body': { en: 'HealthKit reads, we stamp it. +50 XP.', zh: 'HealthKit 自动读，我们来盖章。+50 XP。' },
  'onb.intro.cta': { en: 'ENROLL — 90 SECONDS', zh: '开始注册 — 90 秒' },
  'onb.intro.note': { en: '// Phone number · 1 goal · 1 squad pick (skippable)', zh: '// 手机号 · 1 个目标 · 1 个小队选择（可跳过）' },

  'onb.goal.tag': { en: '// STEP 02 · ONE PICK', zh: '// 步骤 02 · 单选' },
  'onb.goal.title': { en: 'What are you here for?', zh: '你来这是为了什么？' },
  'onb.goal.body': { en: "Single answer. We'll route quests around it. We don't ask preferred sports yet — that's day 7.", zh: '单选即可，任务会围绕这个目标分发。运动偏好留到第 7 天再问。' },
  'onb.goal.lean.l': { en: 'LEAN OUT', zh: '减脂' },
  'onb.goal.lean.s': { en: 'Cut · cardio-leaning weeks', zh: '降脂 · 偏有氧的安排' },
  'onb.goal.build.l': { en: 'BUILD', zh: '增肌' },
  'onb.goal.build.s': { en: 'Strength · 3-4× per wk', zh: '力量 · 每周 3-4 次' },
  'onb.goal.destress.l': { en: 'DESTRESS', zh: '解压' },
  'onb.goal.destress.s': { en: 'Mobility · short, often', zh: '舒展 · 短而频' },
  'onb.goal.maintain.l': { en: 'MAINTAIN', zh: '维持' },
  'onb.goal.maintain.s': { en: 'Stay where you are', zh: '保持当前状态' },

  'onb.invite.tag': { en: '// STEP 03 · OPTIONAL', zh: '// 步骤 03 · 可选' },
  'onb.invite.title': { en: 'Roll with a squad?', zh: '要带个小队吗？' },
  'onb.invite.body': { en: "Squads add high-fives & shared goals. They're never a gate — every feature works solo.", zh: '小队提供击掌和共同目标。它从不是门槛——所有功能都能单人完整使用。' },
  'onb.invite.squad.title': { en: 'Join Dorm 304 Crew', zh: '加入 304 训练小队' },
  'onb.invite.squad.sub': { en: 'Lily · Rohan · Mia + you · 4 of 6', zh: '林溪 · 罗航 · 米雅 + 你 · 4/6 人' },
  'onb.invite.solo.title': { en: 'Train alone for now', zh: '先单人开始' },
  'onb.invite.solo.sub': { en: 'Pick this up later from Squad tab.', zh: '随时可在「小队」页加入。' },
  'onb.invite.note': { en: "// We don't ask for weekly day-count yet · default 3, you can tune later", zh: '// 暂不问每周天数 · 默认 3 天，后续可调' },

  'onb.first.tag': { en: '// FIRST QUEST · ON YOUR LOCKER', zh: '// 第一个任务 · 你的储物柜' },
  'onb.first.title': { en: 'Pin this one in.', zh: '给它盖个章。' },
  'onb.first.body': { en: 'Your first quest is a deliberately easy walk. Verifying it unlocks First Sweat.', zh: '首个任务故意设得容易。校验通过将解锁「First Sweat 初汗」徽章。' },
  'onb.first.code': { en: 'QUEST · #01', zh: '任务 · #01' },
  'onb.first.tag2': { en: 'DAILY · EASY', zh: '每日 · 简单' },
  'onb.first.questTitle': { en: 'Walk 1500 steps', zh: '走 1500 步' },
  'onb.first.questBody': { en: '12 minutes outdoors. HealthKit will count it for you. We stamp it after.', zh: '12 分钟户外即可。HealthKit 自动计数，我们随后盖章。' },
  'onb.first.mini.min': { en: 'MIN', zh: '分钟' },
  'onb.first.mini.reward': { en: 'REWARD', zh: '奖励' },
  'onb.first.mini.unlocks': { en: 'UNLOCKS', zh: '解锁' },
  'onb.first.note': { en: '// first-task verify is the keystone moment — V3 calls this out', zh: '// 首任务校验是最关键的体验时刻 — V3 把它写进 PRD' },
  'onb.first.demoNote': { en: 'demo · the read takes 1.5 sec', zh: '示例 · 读取耗时 1.5 秒' },

  'onb.done.tag': { en: '// SETUP COMPLETE', zh: '// 注册完成' },
  'onb.done.under90': { en: 'UNDER 90s', zh: '90 秒以内' },
  'onb.done.badgeKind': { en: 'PERSONAL BADGE', zh: '个人徽章' },
  'onb.done.badgeName': { en: 'First Sweat', zh: '初汗 First Sweat' },
  'onb.done.badgeStatus': { en: 'UNLOCKED — KEEP GOING', zh: '已解锁 — 继续' },
  'onb.done.mini.xp': { en: 'XP', zh: 'XP' },
  'onb.done.mini.streak': { en: 'STREAK', zh: '连续' },
  'onb.done.mini.tomorrow': { en: 'TOMORROW', zh: '明天' },
  'onb.done.body': { en: 'Tomorrow we surface a new quest at 9am — and a push if your squad lights up first.', zh: '明早 9 点会派发新任务——若小队先动起来，会先给你一条推送。' },
  'onb.done.cta': { en: 'ENTER THE LOCKER →', zh: '走进储物柜 →' },

  'onb.progress.step': { en: 'STEP {n} / 3', zh: '步骤 {n} / 3' },

  // -- Page headers ----
  'page.section.home': { en: 'HOME', zh: '主页' },
  'page.section.quests': { en: 'QUESTS', zh: '任务' },
  'page.section.squad': { en: 'SQUAD', zh: '小队' },
  'page.section.badges': { en: 'BADGES', zh: '徽章' },
  'page.section.ranks': { en: 'RANKS', zh: '排行' },
  'page.section.solo': { en: 'SOLO', zh: '单人' },
  'page.section.solo.issue': { en: 'MODE', zh: '模式' },

  // -- Home ----
  'home.copy.new.kicker': { en: 'NEW MEMBER', zh: '新成员' },
  'home.copy.new.line': { en: "Day 1. Pick a quest. We'll handle the proof.", zh: '第 1 天。挑一个任务，校验由我们来。' },
  'home.copy.active.kicker': { en: 'ACTIVE STREAK', zh: '连续中' },
  'home.copy.active.line': { en: 'You said you would. The locker room is open.', zh: '你说过你要练的。更衣室已打开。' },
  'home.copy.comeback.kicker': { en: 'WELCOME BACK', zh: '欢迎回来' },
  'home.copy.comeback.line': { en: 'Streak is paused, not lost. Easy 10 min today.', zh: 'streak 是暂停不是清零。今天来 10 分钟轻量。' },
  'home.kicker': { en: 'Today\'s main quest, weekly progress, and your squad — one screen.', zh: '今日主任务、周进度和你的小队 —— 一屏可见。' },
  'home.greeting': { en: 'HEY, {name}.', zh: '嘿，{name}。' },
  'home.lvl': { en: 'LV.{lvl}', zh: 'LV.{lvl}' },
  'home.streak': { en: 'STREAK · {n}', zh: '连续 · {n}' },
  'home.streakPaused': { en: 'STREAK · {n} · PAUSED', zh: '连续 · {n} · 已暂停' },
  'home.xpInLv': { en: 'XP IN LV', zh: '本级 XP' },
  'home.last21': { en: 'Last 21 days', zh: '最近 21 天' },
  'home.longest': { en: 'longest · {n}', zh: '最长 · {n}' },
  'home.todayMain': { en: 'TODAY · MAIN QUEST', zh: '今日 · 主任务' },
  'home.questHeader.code': { en: 'QUEST · {code}', zh: '任务 · {code}' },
  'home.cell.min': { en: 'MIN', zh: '分钟' },
  'home.cell.reward': { en: 'REWARD', zh: '奖励' },
  'home.cell.weekly': { en: 'WEEKLY', zh: '本周' },
  'home.cell.minSuffix': { en: 'm', zh: '分' },
  'home.cell.xp': { en: 'xp', zh: 'XP' },
  'home.poweredBy': { en: 'POWERED BY HEALTHKIT · NO SELF-REPORT', zh: '由 HEALTHKIT 提供校验 · 无需自报' },
  'home.poweredByMid': { en: 'HEALTHKIT', zh: 'HEALTHKIT' },
  'home.allDone.title': { en: 'ALL VERIFIED.', zh: '全部已校验。' },
  'home.allDone.body': { en: 'Hit the Quests tab for bonus & challenge work.', zh: '去「任务」页看看 Bonus 和 Challenge。' },
  'home.thisWeek': { en: 'THIS WEEK', zh: '本周' },
  'home.weeklyMin': { en: '{cur} / {max} MIN', zh: '{cur} / {max} 分钟' },
  'home.goal': { en: 'GOAL', zh: '达成' },
  'home.squad.tag': { en: 'SQUAD · {name}', zh: '小队 · {name}' },
  'home.squad.weekly': { en: 'WEEKLY', zh: '本周' },
  'home.solo.tag': { en: 'SOLO MODE', zh: '单人模式' },
  'home.solo.title': { en: 'No squad yet.', zh: '还没小队。' },
  'home.solo.body': { en: 'Squads unlock high-fives & shared goals — totally optional.', zh: '小队解锁击掌与共同目标 —— 完全可选。' },
  'home.solo.cta': { en: 'JOIN A SQUAD', zh: '加入小队' },

  // -- Quests ----
  'quests.kicker': { en: 'Five categories, all verified by HealthKit. Pick what fits today.', zh: '5 类任务，全部 HealthKit 校验。今天挑一个合适的。' },
  'quests.issue': { en: 'WK 19', zh: '第 19 周' },
  'quests.chip.all': { en: 'ALL · {n}', zh: '全部 · {n}' },
  'quests.type.daily': { en: 'DAILY', zh: '每日' },
  'quests.type.bonus': { en: 'BONUS', zh: 'BONUS' },
  'quests.type.social': { en: 'SOCIAL', zh: '社交' },
  'quests.type.challenge': { en: 'CHALLENGE', zh: '挑战' },
  'quests.type.comeback': { en: 'COMEBACK', zh: '回归' },
  'quests.dot.daily': { en: 'CORE', zh: '核心' },
  'quests.dot.bonus': { en: 'EXTRA', zh: '额外' },
  'quests.dot.social': { en: 'WITH SQUAD', zh: '小队同行' },
  'quests.dot.challenge': { en: 'HARD', zh: '高难' },
  'quests.dot.comeback': { en: 'RETURN', zh: '回归' },
  'quests.available': { en: '// AVAILABLE TODAY', zh: '// 今日可领' },
  'quests.upForGrabs': { en: 'XP UP FOR GRABS', zh: 'XP 待领取' },
  'quests.empty.title': { en: 'No quests pending.', zh: '没有待完成任务。' },
  'quests.empty.body': { en: 'Comeback quests unlock if you pause for 3+ days.', zh: '中断 3 天以上才会出现 Comeback 任务。' },
  'quests.diff.easy': { en: 'EASY', zh: '简单' },
  'quests.diff.core': { en: 'CORE', zh: '常规' },
  'quests.diff.hard': { en: 'HARD', zh: '高难' },
  'quests.reward': { en: 'REWARD', zh: '奖励' },
  'quests.rewardSuffix': { en: 'XP · {min}m', zh: 'XP · {min} 分钟' },
  'quests.verifiedDetail': { en: '{steps} steps · {min} min', zh: '{steps} 步 · {min} 分钟' },
  'quests.note.tag': { en: '// V3 DESIGN NOTE', zh: '// V3 设计笔记' },
  'quests.note.body': { en: 'Comeback Quest awards normal XP — no extra badge. We reward the workout, not the act of returning. (Removes the "fake-pause to farm" loop in V1.)', zh: 'Comeback 任务发放正常 XP —— 不发额外徽章。我们奖励的是「运动」本身，而不是「回归」这个动作。（V1 的「假装中断刷徽章」漏洞由此修复。）' },

  // -- Quest content (titles / blurbs / codes) ----
  'q.q-daily-01.title': { en: '20-min any workout', zh: '20 分钟任意训练' },
  'q.q-daily-01.blurb': { en: 'Move your body. Type-agnostic. Counts in HealthKit minutes.', zh: '动起来即可。不限项目，按 HealthKit 活动分钟计。' },
  'q.q-bonus-01.title': { en: 'After-dinner walk', zh: '晚饭后散步' },
  'q.q-bonus-01.blurb': { en: '10 minutes outside, post 7pm. Fresh air bonus.', zh: '晚 7 点后户外 10 分钟。新鲜空气加成。' },
  'q.q-social-01.title': { en: 'Workout with a squadmate', zh: '与小队成员同练' },
  'q.q-social-01.blurb': { en: 'Verified by overlapping HealthKit windows. No screenshot needed.', zh: '通过 HealthKit 时间窗重叠校验。无需截图。' },
  'q.q-challenge-01.title': { en: '45-min push session', zh: '45 分钟硬仗' },
  'q.q-challenge-01.blurb': { en: 'For the days you have it in you. Heart rate zone 3+.', zh: '心率 Zone 3 以上。状态好的日子来挑战。' },
  'q.q-comeback-01.title': { en: 'Easy 10-min return', zh: '10 分钟轻量回归' },
  'q.q-comeback-01.blurb': { en: 'Welcome back. Same XP as a daily, no extra badge — by design.', zh: '欢迎回来。XP 同每日任务，不发额外徽章——设计如此。' },
  'q.q-onboard-walk.title': { en: 'Walk 1500 steps', zh: '走 1500 步' },
  'q.q-onboard-walk.blurb': { en: "A gentle first quest. HealthKit will count it for you.", zh: '温和的第一个任务。HealthKit 自动计数。' },

  // -- Squad ----
  'squad.kicker': { en: 'Roll-call, weekly goal, and high-fives — only for those who actually moved.', zh: '点名、周目标、击掌——只发给真动了的人。' },
  'squad.issue.day': { en: 'DAY {n}', zh: '第 {n} 天' },
  'squad.coatOfArms': { en: '// COAT OF ARMS', zh: '// 队徽' },
  'squad.dorm304': { en: 'DORM 304', zh: '宿舍 304' },
  'squad.membersInvite': { en: '{n} members · invite {code}', zh: '{n} 人 · 邀请码 {code}' },
  'squad.weeklyGoal': { en: 'WEEKLY GOAL', zh: '周目标' },
  'squad.weeklyMin': { en: '{cur} / {max} MIN', zh: '{cur} / {max} 分钟' },
  'squad.todayVerified': { en: 'TODAY VERIFIED', zh: '今日已校验' },
  'squad.scaleNote': { en: '// SCALES BY HEAD-COUNT · 1 PERSON = 150M · 6 PEOPLE = 900M', zh: '// 目标按人数缩放 · 1 人 = 150 分钟 · 6 人 = 900 分钟' },
  'squad.rollcall': { en: 'ROLL-CALL', zh: '今日点名' },
  'squad.streak': { en: 'STREAK · {n}', zh: '连续 · {n}' },
  'squad.weeklyMinShort': { en: '{n}M / WK', zh: '{n} 分/周' },
  'squad.nudge': { en: 'NUDGE', zh: '催一下' },
  'squad.nudgeDisabled': { en: 'DISABLED · BY DESIGN', zh: '已禁用 · 设计如此' },
  'squad.invite': { en: '＋ INVITE — UP TO 6', zh: '＋ 邀请 — 最多 6 人' },
  'squad.invite.toast.title': { en: 'INVITE CODE READY', zh: '邀请码已就绪' },
  'squad.invite.toast.body': { en: 'Share {code} with a squadmate.', zh: '把 {code} 发给队友即可加入。' },
  'squad.note.tag': { en: '// V3 DESIGN NOTE · SOCIAL PRESSURE', zh: '// V3 设计笔记 · 社交压力' },
  'squad.note.body': { en: 'High-fives only fire on verified members. We removed "Nudge" on unfinished squadmates — passive-aggressive notifications were the #1 reason V1 testers said the squad felt "guilty."', zh: '击掌仅发给已校验成员。我们移除了对未完成成员的「催一下」按钮——被动攻击式通知是 V1 测试中「小队让人有负罪感」的头号原因。' },
  'squad.dropToSolo': { en: '// demo · drop to solo mode', zh: '// 示例 · 切回单人模式' },

  'squad.solo.kicker': { en: "Squads are an upgrade, not a gate. Walk in alone if you want.", zh: '小队是升级，不是门槛。一个人来也完整。' },
  'squad.solo.tag': { en: '// SOLO MEMBERSHIP', zh: '// 单人会员' },
  'squad.solo.title': { en: 'Train alone, fully.', zh: '完全可以一个人练。' },
  'squad.solo.body': { en: 'Every quest, badge, and verification works without a squad. Joining adds high-fives, shared goals, and a dorm crest — but never adds friction.', zh: '所有任务、徽章和校验都不依赖小队。加入只会带来击掌、共同目标和队徽——绝不增加摩擦。' },
  'squad.solo.feat.daily': { en: 'Daily quests', zh: '每日任务' },
  'squad.solo.feat.verify': { en: 'HealthKit verify', zh: 'HealthKit 校验' },
  'squad.solo.feat.personal': { en: 'Personal badges', zh: '个人徽章' },
  'squad.solo.feat.improved': { en: 'Most Improved board', zh: 'Most Improved 榜' },
  'squad.solo.feat.squadBadges': { en: 'Squad badges', zh: '小队徽章' },
  'squad.solo.feat.highFives': { en: 'High-fives', zh: '击掌互动' },
  'squad.solo.join.tag': { en: '// JOIN A SQUAD', zh: '// 加入小队' },
  'squad.solo.join.title': { en: 'Got an invite code?', zh: '有邀请码？' },
  'squad.solo.join.cta': { en: 'JOIN', zh: '加入' },
  'squad.solo.join.note': { en: '// any code joins the demo squad — Dorm 304 Crew', zh: '// 任意码进入示例小队「304 训练小队」' },

  // -- Achievements ----
  'badges.kicker': { en: 'Long-term sediment. Personal trophy case + Dorm 304 squad heraldry.', zh: '长期沉淀。个人战利品柜 + 宿舍 304 队徽列阵。' },
  'badges.stat.unlocked': { en: 'UNLOCKED', zh: '已解锁' },
  'badges.stat.unlockedSub': { en: 'OF {n}', zh: '/ {n}' },
  'badges.stat.lv': { en: 'LV', zh: '等级' },
  'badges.stat.lvSub': { en: '{xp} XP', zh: '{xp} XP' },
  'badges.stat.streak': { en: 'STREAK', zh: '连续' },
  'badges.stat.streakSub': { en: 'PEAK {n}', zh: '峰值 {n}' },
  'badges.section.personal': { en: 'PERSONAL', zh: '个人' },
  'badges.section.squad': { en: 'SQUAD', zh: '小队' },
  'badges.section.unlockedOf': { en: '{cur} of {max} unlocked', zh: '已解锁 {cur} / {max}' },
  'badges.squadNote': { en: 'Heraldry — earned by the whole crew.', zh: '队徽 — 全队共得。' },
  'badges.unlockedAt': { en: 'UNLOCK · {date}', zh: '解锁 · {date}' },
  'badges.pendingHint': { en: 'PENDING · COMPLETE TO STAMP', zh: '待解锁 · 完成即盖章' },
  'badges.note.tag': { en: '// V3 DESIGN NOTE · NO COMEBACK BADGE', zh: '// V3 设计笔记 · 不再发 Comeback 徽章' },
  'badges.note.body': { en: 'Returning from a paused streak gives standard XP — no dedicated badge. V1\'s "Comeback Badge" let rational users farm badges by intentionally pausing. We removed the loop; we still pay for the workout.', zh: '从暂停状态回归只发标准 XP，没有专属徽章。V1 的「Comeback 徽章」让理性用户可以「主动中断 → 刷徽章」。我们关掉了这个循环，但运动本身还是照常奖励。' },

  // -- Achievement names + descriptions ----
  'ach.first-sweat.name': { en: 'First Sweat', zh: '初汗 First Sweat' },
  'ach.first-sweat.desc': { en: 'Verified your first quest. The streak begins.', zh: '完成首个校验任务。连续打卡从这里开始。' },
  'ach.three-day-streak.name': { en: '3-Day Streak', zh: '连续 3 天' },
  'ach.three-day-streak.desc': { en: 'Three days in a row. Habit forming.', zh: '连续 3 天。习惯正在形成。' },
  'ach.campus-runner.name': { en: 'Campus Runner', zh: '校园奔跑者' },
  'ach.campus-runner.desc': { en: '100+ verified minutes this week.', zh: '本周校验通过 100+ 分钟。' },
  'ach.gym-rookie.name': { en: 'Gym Rookie', zh: '健身新兵' },
  'ach.gym-rookie.desc': { en: '5 verified quests in your locker.', zh: '储物柜里 5 个已校验任务。' },
  'ach.squad-player.name': { en: 'Squad Player', zh: '小队伙伴' },
  'ach.squad-player.desc': { en: 'Completed a Social Quest with a squadmate.', zh: '与小队成员合作完成 1 个社交任务。' },
  'ach.squad-first-together.name': { en: 'First Together', zh: '首次同行' },
  'ach.squad-first-together.desc': { en: 'Whole squad verified on the same day.', zh: '小队全员同日校验通过。' },
  'ach.dorm-marathon.name': { en: 'Dorm Marathon', zh: '宿舍马拉松' },
  'ach.dorm-marathon.desc': { en: '21 days, squad still intact.', zh: '21 天小队不解散。' },
  'ach.night-owl.name': { en: 'Night Owl', zh: '夜行者' },
  'ach.night-owl.desc': { en: 'Two squadmates verified after 22:00 on the same night.', zh: '同夜 22:00 之后有两位队员校验通过。' },

  // -- Badge unlock modal ----
  'modal.unlocked': { en: '// BADGE UNLOCKED', zh: '// 徽章已解锁' },
  'modal.new': { en: 'NEW', zh: '新' },
  'modal.kind.personal': { en: 'Personal badge', zh: '个人徽章' },
  'modal.kind.squad': { en: 'Squad badge', zh: '小队徽章' },
  'modal.cta': { en: 'STAMP IT IN', zh: '盖章入册' },
  'modal.unlockDate': { en: 'UNLOCK · {date}', zh: '解锁 · {date}' },

  // -- Leaderboard ----
  'rank.kicker': { en: 'Three boards by design — one for high-activity, one for new users, one for squads.', zh: '三榜分层 — 一榜服务高活跃，一榜服务新用户，一榜服务小队。' },
  'rank.tab.improved': { en: 'MOST IMPROVED', zh: 'MOST IMPROVED' },
  'rank.tab.improvedSub': { en: 'PROTECT NEW USERS', zh: '保护普通用户' },
  'rank.tab.xp': { en: 'XP RANKING', zh: 'XP 总榜' },
  'rank.tab.xpSub': { en: 'COMPETITIVE', zh: '竞争向' },
  'rank.tab.squad': { en: 'SQUAD RANKING', zh: '小队榜' },
  'rank.tab.squadSub': { en: 'COLLECTIVE', zh: '集体向' },
  'rank.note.improved': { en: '// DEFAULT TAB · WHO MOVED THE MOST RELATIVE TO LAST WEEK', zh: '// 默认榜 · 相对上周进步最多' },
  'rank.note.xp': { en: '// CUMULATIVE — FOR THE GRINDERS', zh: '// 累积总榜 — 给硬核用户' },
  'rank.note.squad': { en: '// BY-CREW · WEEKLY MINUTES', zh: '// 按小队 · 本周分钟数' },
  'rank.dormDelta': { en: 'DORM {dorm} · WK Δ {delta}', zh: '宿舍 {dorm} · 周变化 {delta}' },
  'rank.dormVs': { en: 'DORM {dorm} · vs LAST WK', zh: '宿舍 {dorm} · 对比上周' },
  'rank.xpLabel': { en: 'XP', zh: 'XP' },
  'rank.deltaLabel': { en: 'DELTA', zh: '增量' },
  'rank.minPerWk': { en: 'MIN / WK', zh: '分/周' },
  'rank.membersGoal': { en: '{n} MEMBERS · GOAL {goal}M', zh: '{n} 人 · 目标 {goal} 分钟' },
  'rank.note': { en: '// V3 DESIGN NOTE', zh: '// V3 设计笔记' },
  'rank.note.body': { en: 'Leaderboard splits by user lifecycle. New & low-frequency users default to Most Improved so they never see "you\'re 213th" on day one.', zh: '排行榜按用户生命周期分层。新/低频用户默认进 Most Improved，不会在第一天看到「你排第 213」。' },

  // -- Demo Console ----
  'demo.cta': { en: 'DEMO · ⚙', zh: '演示控制 · ⚙' },
  'demo.lang': { en: 'LANGUAGE', zh: '语言切换' },
  'demo.lang.en': { en: 'English', zh: 'English' },
  'demo.lang.zh': { en: '中文', zh: '中文' },
  'demo.action.onboarding': { en: 'Run onboarding (reset to new user)', zh: '走一遍 onboarding（重置为新用户）' },
  'demo.action.reset': { en: 'Reset to demo state (active streak)', zh: '重置为示例状态（连续中）' },
  'demo.action.push': { en: "Trigger 'Lily verified' push", zh: '触发「林溪刚校验」推送' },
  'demo.storage': { en: 'localStorage · campusfit.v3.state', zh: 'localStorage · campusfit.v3.state' },

  // -- Push notification ----
  'push.appName': { en: 'CampusFit Quest', zh: 'CampusFit 校园健身' },
  'push.now': { en: '· now', zh: '· 刚刚' },
  'push.dorm': { en: 'DORM {dorm}', zh: '宿舍 {dorm}' },
  'push.lily.body': { en: 'just verified · 25 min run', zh: '刚校验通过 · 25 分钟跑步' },

  // -- Names (people / squads) ----
  'name.carl': { en: 'Carl', zh: '卡尔' },
  'name.lily': { en: 'Lily', zh: '林溪' },
  'name.rohan': { en: 'Rohan', zh: '罗航' },
  'name.mia': { en: 'Mia', zh: '米雅' },
  'name.taraN': { en: 'Tara N.', zh: '塔拉 N.' },
  'name.jinH': { en: 'Jin H.', zh: '金华' },
  'name.wendyK': { en: 'Wendy K.', zh: '温迪 K.' },
  'name.lilyP': { en: 'Lily P.', zh: '林溪' },
  'name.amanS': { en: 'Aman S.', zh: '阿曼 S.' },
  'name.rohanM': { en: 'Rohan M.', zh: '罗航' },
  'name.carlC': { en: 'Carl C.', zh: '卡尔 C.' },
  'name.miaC': { en: 'Mia C.', zh: '米雅 C.' },
  'name.saraT': { en: 'Sara T.', zh: '萨拉 T.' },
  'name.devonB': { en: 'Devon B.', zh: '德文 B.' },
  'name.irisW': { en: 'Iris W.', zh: '艾瑞丝 W.' },

  'squad.name.dorm304': { en: 'Dorm 304 Crew', zh: '304 训练小队' },
  'squad.name.eastWingWolves': { en: 'East Wing Wolves', zh: '东翼狼群' },
  'squad.name.libraryLifters': { en: 'Library Lifters', zh: '图书馆铁人' },
  'squad.name.kappaRunClub': { en: 'Kappa Run Club', zh: 'Kappa 跑团' },
  'squad.name.stairMaster': { en: 'Stair Master', zh: '楼梯大师' },
}

export const LOCALES = ['en', 'zh']
