import { motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { Avatar } from '../components/Avatar.jsx'

export function Achievements() {
  const { state } = useStore()
  const { t } = useI18n()
  const { achievements, user } = state
  const personal = achievements.filter((a) => a.type === 'personal')
  const squad = achievements.filter((a) => a.type === 'squad')
  const unlockedPersonal = personal.filter((a) => a.unlocked).length
  const unlockedSquad = squad.filter((a) => a.unlocked).length

  return (
    <main className="flex flex-col">
      <PageHeader
        section={t('page.section.badges')}
        issue={`${unlockedPersonal + unlockedSquad}/${achievements.length}`}
        kicker={t('badges.kicker')}
      />

      {/* Trophy case header */}
      <section className="border-b-2 border-ink bg-cream px-4 pb-5 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label={t('badges.stat.unlocked')} value={`${unlockedPersonal + unlockedSquad}`} sub={t('badges.stat.unlockedSub', { n: achievements.length })} />
          <Stat label={t('badges.stat.lv')} value={user.level} sub={t('badges.stat.lvSub', { xp: user.xp })} />
          <Stat label={t('badges.stat.streak')} value={user.streak} sub={t('badges.stat.streakSub', { n: user.longestStreak })} />
        </div>
      </section>

      {/* Personal */}
      <Section title={t('badges.section.personal')} sub={t('badges.section.unlockedOf', { cur: unlockedPersonal, max: personal.length })}>
        <div className="grid grid-cols-2 gap-3">
          {personal.map((a, i) => (
            <BadgeTile key={a.id} a={a} index={i} />
          ))}
        </div>
      </Section>

      {/* Squad */}
      <Section
        title={t('badges.section.squad')}
        sub={t('badges.section.unlockedOf', { cur: unlockedSquad, max: squad.length })}
        note={t('badges.squadNote')}
      >
        <div className="grid grid-cols-2 gap-3">
          {squad.map((a, i) => (
            <BadgeTile key={a.id} a={a} index={i} variant="squad" />
          ))}
        </div>
      </Section>

      {/* Note */}
      <section className="border-t-2 border-ink bg-cream-deep/40 px-4 py-4 pb-32">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-oxblood">{t('badges.note.tag')}</div>
        <p className="mt-1 text-[12px] leading-snug text-ink/75">{t('badges.note.body')}</p>
      </section>
    </main>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-ink bg-paper py-2"
      style={{ borderRadius: '3px' }}
    >
      <div className="font-mono text-[9px] tracking-[0.22em] text-ink/55">{label}</div>
      <div className="font-display text-[28px] font-black leading-none tabular-nums">{value}</div>
      <div className="font-mono text-[9px] tracking-[0.18em] text-ink/45">{sub}</div>
    </div>
  )
}

function Section({ title, sub, note, children }) {
  return (
    <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[20px] font-black uppercase leading-none">
          {title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.22em] text-ink/55 uppercase">{sub}</span>
      </div>
      {note && (
        <p className="font-mono mt-1 text-[10px] tracking-[0.18em] text-ink/45 uppercase">{note}</p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  )
}

function BadgeTile({ a, index, variant = 'personal' }) {
  const { t } = useI18n()
  const unlocked = a.unlocked
  const color = variant === 'squad' ? 'navy' : 'oxblood'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={[
        'relative overflow-hidden border-2 px-3 pb-3 pt-3',
        unlocked ? 'border-ink bg-cream' : 'border-ink/25 bg-cream-deep/40',
      ].join(' ')}
      style={{ borderRadius: '4px', boxShadow: unlocked ? '4px 4px 0 0 #0E0B08' : 'none' }}
    >
      <div className="flex items-start justify-between">
        <Avatar name={a.crest} color={color} size={48} dimmed={!unlocked} />
        {unlocked ? (
          <span className="font-mono bg-jersey px-1.5 py-0.5 text-[9px] tracking-[0.22em] text-ink uppercase skew-stamp-r">
            {t('common.stamped')}
          </span>
        ) : (
          <span className="font-mono border border-dashed border-ink/40 px-1.5 py-0.5 text-[9px] tracking-[0.22em] text-ink/40 uppercase">
            {t('common.locked')}
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <div className={['font-display text-[16px] font-black uppercase leading-tight', unlocked ? '' : 'text-ink/55'].join(' ')}>
          {t(`ach.${a.id}.name`)}
        </div>
        <p className={['mt-0.5 text-[11px] leading-snug', unlocked ? 'text-ink/70' : 'text-ink/40'].join(' ')}>
          {t(`ach.${a.id}.desc`)}
        </p>
      </div>
      {unlocked && a.unlockedAt && (
        <div className="font-mono mt-2 text-[9px] tracking-[0.18em] text-ink/45 uppercase">
          {t('badges.unlockedAt', { date: new Date(a.unlockedAt).toLocaleDateString() })}
        </div>
      )}
      {!unlocked && (
        <div className="font-mono mt-2 text-[9px] tracking-[0.18em] text-ink/40 uppercase">
          {t('badges.pendingHint')}
        </div>
      )}
      {!unlocked && (
        <span className="halftone-tight pointer-events-none absolute inset-0 text-ink opacity-[0.04]" />
      )}
    </motion.div>
  )
}
