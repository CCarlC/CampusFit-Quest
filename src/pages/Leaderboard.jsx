import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { DormPlate } from '../components/DormPlate.jsx'

export function Leaderboard() {
  const [tab, setTab] = useState('improved')
  const { state } = useStore()
  const { t } = useI18n()
  const lb = state.leaderboard

  const TABS = [
    { id: 'improved', label: t('rank.tab.improved'), sub: t('rank.tab.improvedSub') },
    { id: 'xp', label: t('rank.tab.xp'), sub: t('rank.tab.xpSub') },
    { id: 'squad', label: t('rank.tab.squad'), sub: t('rank.tab.squadSub') },
  ]

  const noteForTab = {
    improved: t('rank.note.improved'),
    xp: t('rank.note.xp'),
    squad: t('rank.note.squad'),
  }

  return (
    <main className="flex flex-col">
      <PageHeader
        section={t('page.section.ranks')}
        issue={t('quests.issue')}
        kicker={t('rank.kicker')}
      />

      {/* Tab strip */}
      <div className="grid grid-cols-3 border-b-2 border-ink bg-paper">
        {TABS.map((tabItem) => {
          const active = tab === tabItem.id
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={[
                'relative flex flex-col items-start gap-0.5 px-3 py-2.5 text-left',
                active ? 'bg-oxblood text-cream' : 'bg-paper text-ink/65 hover:text-ink',
                'border-r border-ink/15 last:border-r-0',
              ].join(' ')}
            >
              <span className="font-display text-[11.5px] font-black uppercase leading-none tracking-[0.06em]">{tabItem.label}</span>
              <span className={['font-mono text-[8.5px] tracking-[0.2em]', active ? 'text-jersey' : 'text-ink/45'].join(' ')}>{tabItem.sub}</span>
              {active && (
                <span className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-jersey" />
              )}
            </button>
          )
        })}
      </div>

      {/* Default note */}
      <div className="border-b-2 border-ink bg-cream-deep/40 px-4 py-2.5">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/65 uppercase">
          {noteForTab[tab]}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="px-4 pb-32 pt-4"
        >
          {tab === 'improved' && <MostImprovedList rows={lb.mostImproved} />}
          {tab === 'xp' && <XpList rows={lb.xpRanking} />}
          {tab === 'squad' && <SquadList rows={lb.squadRanking} />}

          <div className="mt-5 border border-dashed border-ink/30 bg-paper p-3 text-[11.5px] leading-snug text-ink/65">
            <div className="font-mono mb-1 text-[9.5px] tracking-[0.22em] text-oxblood">{t('rank.note')}</div>
            {t('rank.note.body')}
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  )
}

function RankBadge({ rank, isYou }) {
  const isPodium = rank <= 3
  const bg = isPodium
    ? rank === 1 ? 'bg-jersey text-ink'
      : rank === 2 ? 'bg-cream-deep text-ink'
      : 'bg-bruise text-cream'
    : 'bg-paper text-ink border-2 border-ink/40'
  return (
    <div
      className={['font-display grid h-12 w-10 place-items-center text-[20px] font-black leading-none', bg, isYou ? 'ring-2 ring-oxblood ring-offset-2 ring-offset-paper' : ''].join(' ')}
      style={{ borderRadius: '2px', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}
    >
      {rank}
    </div>
  )
}

function Row({ children, isYou }) {
  const { t } = useI18n()
  return (
    <li
      className={[
        'relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 px-3 py-2.5',
        isYou ? 'border-oxblood bg-cream' : 'border-ink/85 bg-paper',
      ].join(' ')}
      style={{ borderRadius: '3px', boxShadow: isYou ? '4px 4px 0 0 #7B1E1E' : 'none' }}
    >
      {children}
      {isYou && (
        <span className="font-mono absolute -right-1 -top-2 bg-oxblood px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-cream uppercase">
          {t('common.you')}
        </span>
      )}
    </li>
  )
}

function XpList({ rows }) {
  const { t } = useI18n()
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">
                {r.nameKey ? t(`name.${r.nameKey}`) : r.name}
              </span>
              {r.squad && <span className="font-mono bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">{r.squad}</span>}
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              {t('rank.dormDelta', { dorm: r.dorm, delta: r.delta })}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">{t('rank.xpLabel')}</div>
            <div className="font-display text-[20px] font-black tabular-nums leading-none text-ink">{r.xp.toLocaleString()}</div>
          </div>
        </Row>
      ))}
    </ul>
  )
}

function MostImprovedList({ rows }) {
  const { t } = useI18n()
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">
                {r.nameKey ? t(`name.${r.nameKey}`) : r.name}
              </span>
              {r.squad && <span className="font-mono bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">{r.squad}</span>}
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              {t('rank.dormVs', { dorm: r.dorm })}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="relative h-1.5 w-32 overflow-hidden bg-cream-deep">
                <div
                  className="h-full bg-oxblood"
                  style={{ width: `${Math.min(100, r.percent * 4)}%` }}
                />
              </div>
              <span className="font-mono text-[9.5px] tracking-wider text-oxblood">+{r.percent}%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">{t('rank.deltaLabel')}</div>
            <div className="font-display text-[16px] font-black tabular-nums leading-none text-oxblood">
              {r.delta}
            </div>
          </div>
        </Row>
      ))}
    </ul>
  )
}

function SquadList({ rows }) {
  const { t } = useI18n()
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">
                {r.nameKey ? t(`squad.name.${r.nameKey}`) : r.name}
              </span>
              <DormPlate number={r.dorm} label="FLR" />
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              {t('rank.membersGoal', { n: r.members, goal: r.members * 150 })}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">{t('rank.minPerWk')}</div>
            <div className="font-display text-[20px] font-black tabular-nums leading-none text-ink">
              {r.minutes}
            </div>
          </div>
        </Row>
      ))}
    </ul>
  )
}
