import { motion } from 'motion/react'
import { useStore, xpProgress } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { VerifyButton } from '../components/VerifyButton.jsx'
import { Stamp, Tape } from '../components/Stamp.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { Calendar21 } from '../components/Calendar21.jsx'

export function Home({ onNavigate }) {
  const { state, actions } = useStore()
  const { t } = useI18n()
  const toast = useToast()
  const { user, quests, squad } = state
  const xp = xpProgress(user.xp)
  const mainQuest = quests.find((q) => !q.verified && !q.locked) || quests[0]

  const status = user.status || 'active'
  const kicker = t(`home.copy.${status}.line`)
  const kickerTag = t(`home.copy.${status}.kicker`)

  const handleVerified = ({ steps, minutes }) => {
    if (!mainQuest) return
    actions.verifyTask(mainQuest.id, { mockSteps: steps, mockMinutes: minutes })
    toast.push({
      title: t('toast.title.xpStreak', { xp: mainQuest.xp, streak: user.streak + 1 }),
      body: t('toast.body.verifyDetail', {
        steps: steps.toLocaleString(),
        minutes,
        title: t(`q.${mainQuest.id}.title`).toLowerCase(),
      }),
    })
  }

  const userName = user.nameKey ? t(`name.${user.nameKey}`) : user.name

  return (
    <main className="flex flex-col">
      <PageHeader
        section={t('page.section.home')}
        issue={`${(state.lifecycle.lastVerifiedTaskId ? '07' : '06')}`}
        kicker={kicker}
      />

      {/* Status block */}
      <section className="relative border-b-2 border-ink bg-cream px-4 pb-5 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono flex items-center gap-2 text-[9.5px] tracking-[0.22em] text-ink/60">
              <span>// {kickerTag}</span>
            </div>
            <div className="mt-1 font-display text-[28px] font-black leading-none">
              {t('home.greeting', { name: userName.toUpperCase() })}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Stamp color="oxblood">{t('home.lvl', { lvl: user.level })}</Stamp>
              <Tape>
                {user.streakPaused
                  ? t('home.streakPaused', { n: user.streak })
                  : t('home.streak', { n: user.streak })}
              </Tape>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/55">{t('home.xpInLv')}</div>
            <div className="font-display text-[32px] font-black leading-none tabular-nums">
              {xp.current}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-ink/55">/ {xp.max}</div>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar current={xp.current} max={xp.max} color="oxblood" height={10} ticks={5} />
        </div>

        {/* 21-day grid */}
        <div className="mt-5">
          <div className="font-mono flex items-center justify-between text-[9.5px] tracking-[0.22em] text-ink/60 uppercase">
            <span>{t('home.last21')}</span>
            <span>{t('home.longest', { n: user.longestStreak })}</span>
          </div>
          <div className="mt-2">
            <Calendar21 history={user.streakHistory} todayIndex={20} />
          </div>
        </div>
      </section>

      {/* Today's quest */}
      <section className="relative border-b-2 border-ink bg-paper px-4 pb-5 pt-5">
        <div className="flex items-center gap-2">
          <span className="h-[2px] flex-1 bg-ink" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/65">{t('home.todayMain')}</span>
          <span className="h-[2px] flex-1 bg-ink" />
        </div>

        {mainQuest ? (
          <article
            className="relative mt-3 overflow-hidden border-2 border-ink bg-cream"
            style={{ borderRadius: '4px', boxShadow: '5px 5px 0 0 #0E0B08' }}
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-oxblood px-3 py-1.5 text-cream">
              <span className="font-mono text-[10px] tracking-[0.22em]">{t('home.questHeader.code', { code: mainQuest.code })}</span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase">{t(`quests.type.${mainQuest.type}`)}</span>
            </div>
            <div className="px-4 pb-4 pt-3">
              <div className="font-display text-[26px] font-black uppercase leading-[0.95] text-ink">
                {t(`q.${mainQuest.id}.title`)}
              </div>
              <p className="mt-2 text-[13px] leading-snug text-ink/70">{t(`q.${mainQuest.id}.blurb`)}</p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Cell label={t('home.cell.min')} value={mainQuest.minutes} suffix={t('home.cell.minSuffix')} />
                <Cell label={t('home.cell.reward')} value={`+${mainQuest.xp}`} suffix={t('home.cell.xp')} />
                <Cell label={t('home.cell.weekly')} value={user.weeklyMinutes} suffix={`/${user.weeklyGoal}`} />
              </div>

              <div className="mt-4">
                <VerifyButton taskMinutes={mainQuest.minutes} onVerified={handleVerified} />
                <div className="font-mono mt-2 text-center text-[9.5px] tracking-[0.18em] text-ink/45">
                  {t('home.poweredBy')}
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="mt-3 border-2 border-dashed border-ink/30 p-6 text-center text-ink/60">
            <div className="font-display text-[18px] font-black">{t('home.allDone.title')}</div>
            <p className="mt-1 text-[12px]">{t('home.allDone.body')}</p>
          </div>
        )}
      </section>

      {/* Weekly progress */}
      <section className="border-b-2 border-ink bg-cream-deep/40 px-4 pb-5 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-ink/65">{t('home.thisWeek')}</div>
            <div className="font-display text-[22px] font-black leading-none">
              <span className="tabular-nums">{user.weeklyMinutes}</span>{' '}
              <span className="text-ink/50">/ {user.weeklyGoal} {t('home.cell.min')}</span>
            </div>
          </div>
          <div className="font-mono text-right text-[10px] tracking-[0.18em] text-ink/55">
            <div>{t('home.goal')}</div>
            <div className="font-display text-[18px] text-oxblood">
              {Math.round((user.weeklyMinutes / user.weeklyGoal) * 100)}%
            </div>
          </div>
        </div>
        <div className="mt-2">
          <ProgressBar current={user.weeklyMinutes} max={user.weeklyGoal} color="oxblood" />
        </div>
      </section>

      {/* Squad sync row */}
      {squad ? (
        <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] tracking-[0.22em] text-ink/60">
              {t('home.squad.tag', { name: t(`squad.name.${squad.nameKey || 'dorm304'}`).toUpperCase() })}
            </div>
            <button
              onClick={() => onNavigate('squad')}
              className="font-mono border border-ink px-2 py-0.5 text-[10px] tracking-[0.18em] text-ink hover:bg-ink hover:text-cream"
            >
              {t('common.open')}
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {squad.members.map((m) => (
              <motion.div
                key={m.id}
                initial={false}
                animate={m.todayVerified ? { y: -1 } : { y: 0 }}
                className="relative"
              >
                <Avatar name={m.avatar} color={m.color} size={32} dimmed={!m.todayVerified} ring={m.isYou && m.todayVerified} />
                {m.todayVerified && (
                  <span className="font-display absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center bg-mint text-ink text-[9px] font-black" style={{ borderRadius: '50%' }}>✓</span>
                )}
              </motion.div>
            ))}
            <div className="ml-auto text-right">
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/60">{t('home.squad.weekly')}</div>
              <div className="font-display text-[16px] font-black leading-none">
                {squad.members.reduce((s, m) => s + m.weeklyMinutes, 0)}<span className="text-ink/50">/{squad.weeklyGoalPerHead * squad.members.length}</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar
              current={squad.members.reduce((s, m) => s + m.weeklyMinutes, 0)}
              max={squad.weeklyGoalPerHead * squad.members.length}
              color="navy"
              height={10}
            />
          </div>
        </section>
      ) : (
        <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/60">{t('home.solo.tag')}</div>
              <div className="font-display text-[18px] font-black uppercase">{t('home.solo.title')}</div>
              <p className="mt-0.5 text-[12px] text-ink/60">{t('home.solo.body')}</p>
            </div>
            <button
              onClick={() => onNavigate('squad')}
              className="font-display stamp-press border-2 border-ink bg-jersey px-3 py-2 text-[12px] font-black uppercase tracking-[0.1em] text-ink"
              style={{ borderRadius: '3px' }}
            >
              {t('home.solo.cta')}
            </button>
          </div>
        </section>
      )}

      {/* Footer mark */}
      <section className="px-4 pb-6 pt-5">
        <div className="font-mono text-[9.5px] tracking-[0.24em] text-ink/40 uppercase">
          // {t('brand.assoc')}
        </div>
        <div className="mt-2 h-2 stripe-tape opacity-60" />
      </section>
    </main>
  )
}

function Cell({ label, value, suffix }) {
  return (
    <div className="border border-ink/30 bg-paper px-2 py-1.5">
      <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55 uppercase">{label}</div>
      <div className="font-display flex items-baseline gap-1 text-[20px] font-black leading-none tabular-nums">
        {value}
        <span className="font-mono text-[10px] font-normal tracking-wide text-ink/55">{suffix}</span>
      </div>
    </div>
  )
}
