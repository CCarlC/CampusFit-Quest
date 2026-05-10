import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'
import { useToast } from '../components/Toast.jsx'
import { VerifyButton } from '../components/VerifyButton.jsx'
import { Stamp, Tape } from '../components/Stamp.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { Crest } from '../components/Crest.jsx'
import { demoSquad } from '../lib/seed.js'

const GOAL_IDS = [
  { id: 'lean', glyph: 'L' },
  { id: 'build', glyph: 'B' },
  { id: 'destress', glyph: 'D' },
  { id: 'maintain', glyph: 'M' },
]

const PHASES = ['intro', 'goal', 'invite', 'first-quest', 'verify-done']

export function Onboarding({ onDone }) {
  const { state, actions } = useStore()
  const { t, locale, toggleLocale } = useI18n()
  const toast = useToast()
  const [phase, setPhase] = useState('intro')
  const [goal, setGoal] = useState(null)

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
      title: t('toast.title.firstVerify'),
      body: t('toast.body.firstVerify', { steps: steps.toLocaleString(), minutes }),
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
        <span className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 bg-mint" style={{ borderRadius: '50%' }} />{t('chrome.onboarding')}</span>
        <button
          onClick={toggleLocale}
          className="font-mono inline-flex items-center gap-0.5 border border-ink/30 bg-paper px-1 py-0.5 text-[8.5px] tracking-[0.16em] text-ink/70 hover:bg-ink hover:text-jersey"
          style={{ borderRadius: '2px' }}
        >
          <span className={locale === 'en' ? 'text-oxblood font-bold' : 'opacity-50'}>EN</span>
          <span className="opacity-30">/</span>
          <span className={locale === 'zh' ? 'text-oxblood font-bold' : 'opacity-50'}>中</span>
        </button>
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
  const { t } = useI18n()
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
          {t('onb.progress.step', { n: Math.min(idx + 1, 3) })}
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
  const { t } = useI18n()
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('onb.intro.tag')}</div>
      <h1 className="font-display mt-2 text-[44px] font-black uppercase leading-[0.9] tracking-[-0.01em] text-oxblood">
        {t('onb.intro.headlineA')}<br />{t('onb.intro.headlineB')}<br />{t('onb.intro.headlineC')}
      </h1>
      <p className="mt-3 text-[14px] leading-snug text-ink/70">{t('onb.intro.body')}</p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Pill k={t('onb.intro.pill1k')} v={t('onb.intro.pill1v')} />
        <Pill k={t('onb.intro.pill2k')} v={t('onb.intro.pill2v')} />
        <Pill k={t('onb.intro.pill3k')} v={t('onb.intro.pill3v')} />
      </div>

      <div className="mt-6 flex-1">
        <div
          className="relative overflow-hidden border-2 border-ink bg-cream p-4"
          style={{ borderRadius: '4px' }}
        >
          <div className="halftone absolute inset-0 text-oxblood opacity-[0.06]" />
          <div className="font-mono relative flex items-center justify-between text-[10px] tracking-[0.22em] text-ink/55 uppercase">
            <span>{t('onb.intro.sample.tag')}</span>
            <span>{t('onb.intro.sample.code')}</span>
          </div>
          <div className="font-display relative mt-1 text-[24px] font-black uppercase">
            {t('onb.intro.sample.title')}
          </div>
          <div className="font-mono relative mt-1 text-[11px] tracking-wide text-ink/65">
            {t('onb.intro.sample.body')}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={onStart}
          className="font-display stamp-press relative w-full overflow-hidden border-2 border-ink bg-jersey px-4 py-3.5 text-[18px] font-black uppercase tracking-[0.08em] text-ink"
          style={{ borderRadius: '3px' }}
        >
          {t('onb.intro.cta')}
        </button>
        <p className="font-mono mt-2 text-center text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
          {t('onb.intro.note')}
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
  const { t } = useI18n()
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('onb.goal.tag')}</div>
      <h1 className="font-display mt-2 text-[36px] font-black uppercase leading-[0.92] text-ink">
        {t('onb.goal.title')}
      </h1>
      <p className="mt-2 text-[13px] leading-snug text-ink/65">{t('onb.goal.body')}</p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {GOAL_IDS.map((g) => {
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
                <div className="font-display text-[16px] font-black uppercase leading-none">{t(`onb.goal.${g.id}.l`)}</div>
                <div className={['font-mono mt-0.5 text-[9.5px] tracking-[0.18em] uppercase', active ? 'text-cream/75' : 'text-ink/55'].join(' ')}>
                  {t(`onb.goal.${g.id}.s`)}
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
          {t('common.continue')}
        </button>
      </div>
    </StepShell>
  )
}

function InviteStep({ onPick }) {
  const { t } = useI18n()
  return (
    <StepShell>
      <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('onb.invite.tag')}</div>
      <h1 className="font-display mt-2 text-[34px] font-black uppercase leading-[0.92]">
        {t('onb.invite.title')}
      </h1>
      <p className="mt-2 text-[13px] leading-snug text-ink/65">{t('onb.invite.body')}</p>

      <div className="mt-5 grid gap-3">
        <Card
          onClick={() => onPick('squad')}
          tag={t('common.demoTag')}
          glyph={<Crest members={demoSquad().members.map((m) => ({ avatar: m.avatar, color: m.color }))} size={64} />}
          title={t('onb.invite.squad.title')}
          sub={t('onb.invite.squad.sub')}
          accent="oxblood"
        />
        <Card
          onClick={() => onPick('solo')}
          tag={t('common.solo')}
          glyph={<Avatar name="ME" color="ink" size={56} />}
          title={t('onb.invite.solo.title')}
          sub={t('onb.invite.solo.sub')}
          accent="cream"
        />
      </div>

      <div className="mt-auto pt-5">
        <p className="font-mono text-center text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
          {t('onb.invite.note')}
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
  const { t } = useI18n()
  return (
    <StepShell>
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.22em] text-ink/55 uppercase">
        <span>{t('onb.first.tag')}</span>
        <Tape>{t('common.fresh')}</Tape>
      </div>

      <h1 className="font-display mt-3 text-[28px] font-black uppercase leading-[0.95]">
        {t('onb.first.title')}
      </h1>
      <p className="mt-1.5 text-[13px] leading-snug text-ink/65">{t('onb.first.body')}</p>

      <div
        className="relative mt-5 overflow-hidden border-2 border-ink bg-cream"
        style={{ borderRadius: '4px', boxShadow: '5px 5px 0 0 #0E0B08' }}
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-oxblood px-3 py-1.5 text-cream">
          <span className="font-mono text-[10px] tracking-[0.22em]">{t('onb.first.code')}</span>
          <span className="font-mono text-[10px] tracking-[0.22em]">{t('onb.first.tag2')}</span>
        </div>
        <div className="px-4 pb-4 pt-3">
          <div className="font-display text-[28px] font-black uppercase leading-[0.95]">{t('onb.first.questTitle')}</div>
          <p className="mt-1.5 text-[12px] text-ink/65 leading-snug">{t('onb.first.questBody')}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Mini label={t('onb.first.mini.min')} value="12" />
            <Mini label={t('onb.first.mini.reward')} value="+50" />
            <Mini label={t('onb.first.mini.unlocks')} value="FS" />
          </div>
          <div className="mt-4">
            <VerifyButton taskMinutes={12} onVerified={onVerified} />
            <div className="font-mono mt-2 text-center text-[9.5px] tracking-[0.18em] text-ink/45 uppercase">
              {t('onb.first.demoNote')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <p className="font-mono text-center text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
          {t('onb.first.note')}
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
  const { t } = useI18n()
  return (
    <StepShell>
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.22em] text-oxblood uppercase">
        <span>{t('onb.done.tag')}</span>
        <Stamp>{t('onb.done.under90')}</Stamp>
      </div>

      <div
        className="relative mt-5 overflow-hidden border-2 border-ink bg-cream p-5"
        style={{ borderRadius: '4px', boxShadow: '6px 6px 0 0 #0E0B08' }}
      >
        <div className="halftone absolute inset-0 text-oxblood opacity-[0.06]" />
        <div className="relative flex items-center gap-3">
          <Avatar name="FS" color="oxblood" size={64} />
          <div>
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/55 uppercase">{t('onb.done.badgeKind')}</div>
            <div className="font-display text-[26px] font-black uppercase leading-none">{t('onb.done.badgeName')}</div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">{t('onb.done.badgeStatus')}</div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <Mini label={t('onb.done.mini.xp')} value="+50" />
          <Mini label={t('onb.done.mini.streak')} value="1" />
          <Mini label={t('onb.done.mini.tomorrow')} value="+1" />
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-snug text-ink/65">{t('onb.done.body')}</p>

      <div className="mt-auto pt-5">
        <button
          onClick={onEnter}
          className="font-display stamp-press w-full border-2 border-ink bg-oxblood px-4 py-3.5 text-[18px] font-black uppercase tracking-[0.08em] text-cream"
          style={{ borderRadius: '3px' }}
        >
          {t('onb.done.cta')}
        </button>
      </div>
    </StepShell>
  )
}
