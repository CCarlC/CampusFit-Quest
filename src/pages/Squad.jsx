import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { Crest } from '../components/Crest.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { Stamp } from '../components/Stamp.jsx'
import { demoSquad } from '../lib/seed.js'

export function Squad() {
  const { state, actions } = useStore()
  const { t } = useI18n()
  const toast = useToast()
  const { squad } = state

  if (!squad) return <SoloFallback onJoin={actions.joinDemoSquad} />

  const totalMinutes = squad.members.reduce((s, m) => s + m.weeklyMinutes, 0)
  const totalGoal = squad.weeklyGoalPerHead * squad.members.length
  const todayCount = squad.members.filter((m) => m.todayVerified).length
  const squadName = t(`squad.name.${squad.nameKey || 'dorm304'}`)

  const handleHighFive = (m) => {
    if (!m.todayVerified || m.isYou) return
    actions.highFive(m.id)
    const memberName = m.nameKey ? t(`name.${m.nameKey}`) : m.name
    toast.push({
      title: t('toast.title.highFive', { name: memberName.toUpperCase() }),
      body: t('toast.body.highFive'),
      icon: '✋',
    })
  }

  return (
    <main className="flex flex-col">
      <PageHeader
        section={t('page.section.squad')}
        issue={t('squad.issue.day', { n: squad.foundedDay })}
        kicker={t('squad.kicker')}
      />

      {/* Crest banner */}
      <section className="relative border-b-2 border-ink bg-cream px-4 pb-5 pt-5">
        <div className="absolute right-0 top-0 h-full w-32 stripe-tape opacity-25" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('squad.coatOfArms')}</div>
            <h2 className="font-display mt-0.5 text-[26px] font-black uppercase leading-[0.95]">
              {squadName}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Stamp color="oxblood">{t('squad.dorm304')}</Stamp>
              <span className="font-mono text-[10px] tracking-[0.18em] text-ink/55 uppercase">
                {t('squad.membersInvite', { n: squad.members.length, code: squad.inviteCode })}
              </span>
            </div>
          </div>
          <Crest members={squad.members.map((m) => ({ avatar: m.avatar, color: m.color }))} size={92} />
        </div>

        {/* Weekly goal */}
        <div className="mt-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('squad.weeklyGoal')}</div>
              <div className="font-display text-[22px] font-black leading-none">
                <span className="tabular-nums">{totalMinutes}</span>
                <span className="text-ink/45"> / {totalGoal} {t('home.cell.min')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('squad.todayVerified')}</div>
              <div className="font-display text-[18px] font-black text-oxblood">
                {todayCount} / {squad.members.length}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar current={totalMinutes} max={totalGoal} color="navy" />
          </div>
          <p className="font-mono mt-2 text-[9.5px] tracking-[0.18em] text-ink/50 uppercase">
            {t('squad.scaleNote')}
          </p>
        </div>
      </section>

      {/* Roster */}
      <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-[2px] flex-1 bg-ink" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/65">{t('squad.rollcall')}</span>
          <span className="h-[2px] flex-1 bg-ink" />
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {squad.members.map((m, i) => {
            const memberName = m.nameKey ? t(`name.${m.nameKey}`) : m.name
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={[
                  'relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 border-ink px-3 py-2.5',
                  m.todayVerified ? 'bg-cream' : 'bg-cream-deep/40',
                ].join(' ')}
                style={{ borderRadius: '3px' }}
              >
                <Avatar name={m.avatar} color={m.color} size={40} dimmed={!m.todayVerified} />
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-[16px] font-black uppercase truncate">
                      {memberName}{m.isYou && <span className="ml-1 text-jersey-deep">{t('common.youDash')}</span>}
                    </div>
                    {m.todayVerified ? (
                      <span className="font-mono bg-mint px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-ink uppercase">{t('common.verified')}</span>
                    ) : (
                      <span className="font-mono border border-ink/25 px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-ink/55 uppercase">{t('common.pending')}</span>
                    )}
                  </div>
                  <div className="font-mono mt-0.5 flex items-center gap-2.5 text-[10px] tracking-wide text-ink/55 uppercase">
                    <span>{t('squad.streak', { n: m.streak })}</span>
                    <span className="opacity-30">·</span>
                    <span>{t('squad.weeklyMinShort', { n: m.weeklyMinutes })}</span>
                    {m.lastSeen && <><span className="opacity-30">·</span><span>{m.lastSeen}</span></>}
                  </div>
                </div>

                {m.isYou ? (
                  <span className="font-mono text-right text-[9.5px] tracking-[0.2em] text-ink/40 uppercase">
                    {t('common.you')}
                  </span>
                ) : m.todayVerified ? (
                  <button
                    onClick={() => handleHighFive(m)}
                    className="font-display stamp-press grid h-10 w-10 place-items-center border-2 border-ink bg-jersey text-ink text-[18px] font-black"
                    style={{ borderRadius: '3px' }}
                    aria-label={`High-five ${memberName}`}
                  >
                    ✋
                  </button>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="font-mono border border-ink/20 bg-cream-deep/30 px-2 py-1 text-[9px] tracking-[0.2em] text-ink/35 uppercase line-through">
                      {t('squad.nudge')}
                    </span>
                    <span className="font-mono mt-0.5 text-[8.5px] tracking-[0.18em] text-ink/35 uppercase">
                      {t('squad.nudgeDisabled')}
                    </span>
                  </div>
                )}

                {m.highFiveCount && m.highFiveCount > 0 && (
                  <span className="font-mono absolute -right-1 -top-1 bg-oxblood px-1.5 py-0.5 text-[9px] tracking-wider text-cream">
                    ×{m.highFiveCount}
                  </span>
                )}
              </motion.li>
            )
          })}
        </ul>

        {squad.members.length < 6 && (
          <button className="font-display stamp-press mt-3 flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 bg-paper py-3 text-[14px] font-black uppercase tracking-[0.12em] text-ink/65">
            {t('squad.invite')}
          </button>
        )}
      </section>

      {/* Design note */}
      <section className="border-b-2 border-ink bg-cream-deep/30 px-4 py-4">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-oxblood">{t('squad.note.tag')}</div>
        <p className="mt-1 text-[12px] leading-snug text-ink/75">{t('squad.note.body')}</p>
      </section>

      {/* Solo eject */}
      <section className="px-4 pb-32 pt-4">
        <button
          onClick={actions.leaveSquad}
          className="font-mono text-[10px] tracking-[0.22em] text-ink/40 underline-offset-4 hover:text-oxblood hover:underline uppercase"
        >
          {t('squad.dropToSolo')}
        </button>
      </section>
    </main>
  )
}

function SoloFallback({ onJoin }) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  return (
    <main className="flex flex-col">
      <PageHeader
        section={t('page.section.solo')}
        issue={t('page.section.solo.issue')}
        kicker={t('squad.solo.kicker')}
      />
      <section className="px-4 pb-8 pt-6">
        <div
          className="border-2 border-ink bg-cream p-5"
          style={{ borderRadius: '3px', boxShadow: '5px 5px 0 0 #0E0B08' }}
        >
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('squad.solo.tag')}</div>
          <h2 className="font-display mt-1 text-[28px] font-black uppercase leading-[0.95]">{t('squad.solo.title')}</h2>
          <p className="mt-2 text-[13px] leading-snug text-ink/70">{t('squad.solo.body')}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <FeatureRow on label={t('squad.solo.feat.daily')} />
            <FeatureRow on label={t('squad.solo.feat.verify')} />
            <FeatureRow on label={t('squad.solo.feat.personal')} />
            <FeatureRow on label={t('squad.solo.feat.improved')} />
            <FeatureRow off label={t('squad.solo.feat.squadBadges')} />
            <FeatureRow off label={t('squad.solo.feat.highFives')} />
          </div>
        </div>

        <div
          className="mt-5 border-2 border-ink bg-paper p-5"
          style={{ borderRadius: '3px' }}
        >
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">{t('squad.solo.join.tag')}</div>
          <div className="font-display mt-1 text-[18px] font-black uppercase">{t('squad.solo.join.title')}</div>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="D304-FIT"
              className="font-mono w-full border-2 border-ink bg-cream px-3 py-2 text-[14px] tracking-[0.18em] text-ink placeholder-ink/30 outline-none focus:bg-cream-deep"
              style={{ borderRadius: '3px' }}
            />
            <button
              onClick={() => onJoin(demoSquad())}
              className="font-display stamp-press border-2 border-ink bg-jersey px-3 py-2 text-[13px] font-black uppercase tracking-[0.1em] text-ink"
              style={{ borderRadius: '3px' }}
            >
              {t('squad.solo.join.cta')}
            </button>
          </div>
          <p className="font-mono mt-2 text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
            {t('squad.solo.join.note')}
          </p>
        </div>
      </section>
    </main>
  )
}

function FeatureRow({ label, on, off }) {
  return (
    <div className="flex items-center gap-2 border border-ink/20 bg-paper px-2 py-1.5">
      <span
        className={[
          'font-display grid h-5 w-5 place-items-center text-[12px] font-black',
          on ? 'bg-mint text-ink' : 'bg-cream-deep text-ink/40 line-through',
        ].join(' ')}
        style={{ borderRadius: '2px' }}
      >
        {on ? '✓' : '–'}
      </span>
      <span className={['font-display text-[12px] font-bold uppercase tracking-wide', off ? 'text-ink/40' : 'text-ink'].join(' ')}>
        {label}
      </span>
    </div>
  )
}
