import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { VerifyButton } from '../components/VerifyButton.jsx'
import { Stamp, Tape } from '../components/Stamp.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { Crest } from '../components/Crest.jsx'
import { demoSquad } from '../lib/seed.js'

const GOALS = [
  { id: 'lean', label: 'LEAN OUT', sub: 'Cut · cardio-leaning weeks', glyph: 'L' },
  { id: 'build', label: 'BUILD', sub: 'Strength · 3-4× per wk', glyph: 'B' },
  { id: 'destress', label: 'DESTRESS', sub: 'Mobility · short, often', glyph: 'D' },
  { id: 'maintain', label: 'MAINTAIN', sub: 'Stay where you are', glyph: 'M' },
]

const PHASES = ['intro', 'goal', 'invite', 'first-quest', 'verify-done']

export function Onboarding({ onDone }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [phase, setPhase] = useState('intro')
  const [goal, setGoal] = useState(null)
  const [phone, setPhone] = useState('+1 415 ')
  const [stepStartedAt] = useState(Date.now())

  const elapsed = Math.round((Date.now() - stepStartedAt) / 1000)

  function next(to) { setPhase(to) }

  function handleGoalContinue() {
    actions.onboardPickGoal(goal)
    next('invite')
  }

  function handleSquadChoice(mode) {
    if (mode === 'squad') {
      actions.onboardInvite('squad', demoSquad())
    } else {
      actions.onboardInvite('solo')
    }
    actions.onboardSeedFirstQuest()
    next('first-quest')
  }

  function handleFirstVerified({ steps, minutes }) {
    const firstQuest = state.quests[0] || { id: 'q-onboard-walk' }
    actions.verifyTask(firstQuest.id, { mockSteps: steps, mockMinutes: minutes })
    toast.push({
      title: '+50 XP · STREAK 1',
      body: `${steps.toLocaleString()} steps · ${minutes} min · first verify`,
    })
    next('verify-done')
  }

  function handleEnter() {
    actions.completeOnboarding()
    onDone?.()
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-paper text-ink">
      {/* Top hairline */}
      <div className="font-mono flex items-center justify-between border-b border-ink/15 bg-paper px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-ink/55">
        <span>9:41</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 bg-mint" style={{ borderRadius: '50%' }} />ONBOARDING</span>
        <span>EST. 2026</span>
      </div>

      {/* Progress strip */}
      <ProgressStrip phase={phase} />

      <div className="grain relative flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {phase === 'intro' && <IntroStep key="intro" onStart={() => next('goal')} />}
          {phase === 'goal' && <GoalStep key="goal" goal={goal} setGoal={setGoal} onContinue={handleGoalContinue} />}
          {phase === 'invite' && <InviteStep key="invite" onPick={handleSquadChoice} />}
          {phase === 'first-quest' && <FirstQuestStep key="first" onVerified={handleFirstVerified} />}
          {phase === 'verify-done' && <DoneStep key="done" onEnter={handleEnter} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProgressStrip({ phase }) {
  const idx = PHASES.indexOf(phase)
  return (
    <div className="border-b-2 border-ink bg-cream-deep/50 px-4 py-2">
      <div className="flex items-center gap-2">
        {PHASES.slice(0, 3).map((_, i) => (
          <span
            key={i}
            className={[
              'h-2 flex-1',
              i < (phase === 'intro' ? 0 : phase === 'goal' ? 1 : phase === 'invite' ? 2 : 3) ? 'bg-oxblood' : 'bg-cream-deep border border-ink/30',
            ].join(' ')}
          />
        ))}
        <span className="font-mono ml-2 text-[10px] tracking-[0.22em] text-ink/55 uppercase">
          STEP {Math.min(idx + 1, 3)} / 3
        </span>
      </div>
    </div>
  )
}

function StepShell({ children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col px-5 pb-6 pt-5"
    >
      {children}
    </motion.section>
  )
}

function IntroStep({ onStart }) {
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// CAMPUSFIT QUEST · DORM 304</div>
      <h1 className="font-display mt-2 text-[44px] font-black uppercase leading-[0.9] tracking-[-0.01em] text-oxblood">
        Move your body.<br />Get the<br />stamp.
      </h1>
      <p className="mt-3 text-[14px] leading-snug text-ink/70">
        Daily quests, verified by HealthKit. No screenshots. No self-report. Squads optional.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Pill k="3" v="STEP SETUP" />
        <Pill k="≤90s" v="TIME TO TASK 1" />
        <Pill k="0" v="SELF-REPORT" />
      </div>

      <div className="mt-6 flex-1">
        <div
          className="relative overflow-hidden border-2 border-ink bg-cream p-4"
          style={{ borderRadius: '4px' }}
        >
          <div className="halftone absolute inset-0 text-oxblood opacity-[0.06]" />
          <div className="font-mono relative flex items-center justify-between text-[10px] tracking-[0.22em] text-ink/55 uppercase">
            <span>// SAMPLE QUEST</span>
            <span>#01</span>
          </div>
          <div className="font-display relative mt-1 text-[24px] font-black uppercase">
            Walk 1500 steps
          </div>
          <div className="font-mono relative mt-1 text-[11px] tracking-wide text-ink/65">
            HealthKit reads, we stamp it. +50 XP.
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={onStart}
          className="font-display stamp-press relative w-full overflow-hidden border-2 border-ink bg-jersey px-4 py-3.5 text-[18px] font-black uppercase tracking-[0.08em] text-ink"
          style={{ borderRadius: '3px' }}
        >
          ENROLL — 90 SECONDS
        </button>
        <p className="font-mono mt-2 text-center text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
          // Phone number · 1 goal · 1 squad pick (skippable)
        </p>
      </div>
    </StepShell>
  )
}

function Pill({ k, v }) {
  return (
    <div className="border border-ink/30 bg-paper px-2 py-1.5">
      <div className="font-display text-[20px] font-black leading-none">{k}</div>
      <div className="font-mono text-[9px] tracking-[0.18em] text-ink/55 uppercase">{v}</div>
    </div>
  )
}

function GoalStep({ goal, setGoal, onContinue }) {
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// STEP 02 · ONE PICK</div>
      <h1 className="font-display mt-2 text-[36px] font-black uppercase leading-[0.92] text-ink">
        What are you here for?
      </h1>
      <p className="mt-2 text-[13px] leading-snug text-ink/65">
        Single answer. We'll route quests around it. We <i>don't</i> ask preferred sports yet — that's day 7.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {GOALS.map((g) => {
          const active = goal === g.id
          return (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={[
                'relative flex flex-col items-start gap-1.5 border-2 px-3 py-3.5 text-left transition-colors',
                active ? 'border-ink bg-oxblood text-cream' : 'border-ink/40 bg-cream text-ink hover:border-ink',
              ].join(' ')}
              style={{ borderRadius: '3px', boxShadow: active ? '4px 4px 0 0 #0E0B08' : 'none' }}
            >
              <div className={['font-display flex h-10 w-10 items-center justify-center text-[20px] font-black', active ? 'bg-jersey text-ink' : 'bg-ink text-jersey'].join(' ')} style={{ borderRadius: '2px' }}>
                {g.glyph}
              </div>
              <div>
                <div className="font-display text-[16px] font-black uppercase leading-none">{g.label}</div>
                <div className={['font-mono mt-0.5 text-[9.5px] tracking-[0.18em] uppercase', active ? 'text-cream/75' : 'text-ink/55'].join(' ')}>
                  {g.sub}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-auto pt-5">
        <button
          disabled={!goal}
          onClick={onContinue}
          className="font-display stamp-press w-full border-2 border-ink bg-jersey px-4 py-3 text-[16px] font-black uppercase tracking-[0.08em] text-ink disabled:opacity-40"
          style={{ borderRadius: '3px' }}
        >
          CONTINUE →
        </button>
      </div>
    </StepShell>
  )
}

function InviteStep({ onPick }) {
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// STEP 03 · OPTIONAL</div>
      <h1 className="font-display mt-2 text-[34px] font-black uppercase leading-[0.92]">
        Roll with a squad?
      </h1>
      <p className="mt-2 text-[13px] leading-snug text-ink/65">
        Squads add high-fives & shared goals. They're <b className="text-oxblood">never</b> a gate —
        every feature works solo.
      </p>

      <div className="mt-5 grid gap-3">
        <Card
          onClick={() => onPick('squad')}
          tag="DEMO"
          glyph={<Crest members={demoSquad().members.map((m) => ({ avatar: m.avatar, color: m.color }))} size={64} />}
          title="Join Dorm 304 Crew"
          sub="Lily · Rohan · Mia + you · 4 of 6"
          accent="oxblood"
        />
        <Card
          onClick={() => onPick('solo')}
          tag="SOLO"
          glyph={<Avatar name="ME" color="ink" size={56} />}
          title="Train alone for now"
          sub="Pick this up later from Squad tab."
          accent="cream"
        />
      </div>

      <div className="mt-auto pt-5">
        <p className="font-mono text-center text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
          // We don't ask for weekly day-count yet · default 3, you can tune later
        </p>
      </div>
    </StepShell>
  )
}

function Card({ onClick, tag, glyph, title, sub, accent }) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 border-ink px-4 py-3 text-left transition-shadow',
        accent === 'oxblood' ? 'bg-cream' : 'bg-paper',
      ].join(' ')}
      style={{ borderRadius: '3px', boxShadow: '4px 4px 0 0 #0E0B08' }}
    >
      <div>{glyph}</div>
      <div className="min-w-0">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-oxblood uppercase">// {tag}</div>
        <div className="font-display text-[18px] font-black uppercase leading-tight">{title}</div>
        <div className="font-mono text-[10px] tracking-wide text-ink/55 uppercase truncate">{sub}</div>
      </div>
      <span className="font-display text-[18px] font-black text-ink/40">→</span>
    </button>
  )
}

function FirstQuestStep({ onVerified }) {
  return (
    <StepShell>
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.22em] text-ink/55 uppercase">
        <span>// FIRST QUEST · ON YOUR LOCKER</span>
        <Tape>FRESH</Tape>
      </div>

      <h1 className="font-display mt-3 text-[28px] font-black uppercase leading-[0.95]">
        Pin this one in.
      </h1>
      <p className="mt-1.5 text-[13px] leading-snug text-ink/65">
        Your first quest is a deliberately easy walk. Verifying it unlocks <b>First Sweat</b>.
      </p>

      <div
        className="relative mt-5 overflow-hidden border-2 border-ink bg-cream"
        style={{ borderRadius: '4px', boxShadow: '5px 5px 0 0 #0E0B08' }}
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-oxblood px-3 py-1.5 text-cream">
          <span className="font-mono text-[10px] tracking-[0.22em]">QUEST · #01</span>
          <span className="font-mono text-[10px] tracking-[0.22em]">DAILY · EASY</span>
        </div>
        <div className="px-4 pb-4 pt-3">
          <div className="font-display text-[28px] font-black uppercase leading-[0.95]">Walk 1500 steps</div>
          <p className="mt-1.5 text-[12px] text-ink/65 leading-snug">
            12 minutes outdoors. HealthKit will count it for you. We stamp it after.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Mini label="MIN" value="12" />
            <Mini label="REWARD" value="+50" />
            <Mini label="UNLOCKS" value="FS" />
          </div>
          <div className="mt-4">
            <VerifyButton taskMinutes={12} onVerified={onVerified} />
            <div className="font-mono mt-2 text-center text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
              demo · the read takes 1.5 sec
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <p className="font-mono text-center text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
          // first-task verify is the keystone moment — V3 calls this out
        </p>
      </div>
    </StepShell>
  )
}

function Mini({ label, value }) {
  return (
    <div className="border border-ink/25 bg-paper px-2 py-1.5">
      <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55 uppercase">{label}</div>
      <div className="font-display text-[20px] font-black leading-none">{value}</div>
    </div>
  )
}

function DoneStep({ onEnter }) {
  return (
    <StepShell>
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.22em] text-oxblood uppercase">
        <span>// SETUP COMPLETE</span>
        <Stamp>UNDER 90s</Stamp>
      </div>

      <div
        className="relative mt-5 overflow-hidden border-2 border-ink bg-cream p-5"
        style={{ borderRadius: '4px', boxShadow: '6px 6px 0 0 #0E0B08' }}
      >
        <div className="halftone absolute inset-0 text-oxblood opacity-[0.06]" />
        <div className="relative flex items-center gap-3">
          <Avatar name="FS" color="oxblood" size={64} />
          <div>
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/55 uppercase">PERSONAL BADGE</div>
            <div className="font-display text-[26px] font-black uppercase leading-none">First Sweat</div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">UNLOCKED — KEEP GOING</div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <Mini label="XP" value="+50" />
          <Mini label="STREAK" value="1" />
          <Mini label="TOMORROW" value="+1" />
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-snug text-ink/65">
        Tomorrow we surface a new quest at 9am — and a push if your squad lights up first.
      </p>

      <div className="mt-auto pt-5">
        <button
          onClick={onEnter}
          className="font-display stamp-press w-full border-2 border-ink bg-oxblood px-4 py-3.5 text-[18px] font-black uppercase tracking-[0.08em] text-cream"
          style={{ borderRadius: '3px' }}
        >
          ENTER THE LOCKER →
        </button>
      </div>
    </StepShell>
  )
}
