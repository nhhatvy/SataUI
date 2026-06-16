'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useActiveChildStore } from '@/shared/stores/useActiveChildStore'
import { useScoreStore } from '@/shared/stores/useScoreStore'
import { getClassLeaderboard, type LeaderboardStudent } from '@/shared/mock-data/student-data'
import { cn } from '@/shared/utils/utils'
import { PageHeader } from '@/shared/components/page-header'
import { Trophy, Medal, Target, ClipboardCheck, ArrowRight } from 'lucide-react'

type Ranked = LeaderboardStudent & { rank: number }

export function StudentLeaderboard() {
  const router = useRouter()
  const { child } = useActiveChildStore()
  const board = useMemo(() => getClassLeaderboard(child.id), [child.id])
  const live = useScoreStore((s) => s.scores[child.id])

  const ranked: Ranked[] = useMemo(() => {
    const merged = board.students.map((s) => {
      if (!s.isMe || !live || live.completed === 0) return s
      const baseTotal = s.avgScore * s.completed
      const liveTotal = live.scores.reduce((a, b) => a + b, 0)
      const completed = s.completed + live.completed
      const avgScore = Math.round(((baseTotal + liveTotal) / completed) * 10) / 10
      return { ...s, completed, avgScore, points: s.points + live.points }
    })
    return merged.sort((a, b) => b.points - a.points).map((s, i) => ({ ...s, rank: i + 1 }))
  }, [board, live])
  const me = ranked.find((s) => s.isMe)
  const top3 = ranked.slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <PageHeader
        icon={Trophy}
        title={`Bảng xếp hạng lớp ${board.className}`}
        subtitle="Điểm thành tích tích lũy từ bài tập và bài kiểm tra trắc nghiệm. Hãy hoàn thành thật tốt để leo hạng nhé!"
      />

      {/* Thành tích của con */}
      {me && (
        <Card className="border-primary/30 bg-primary/[0.04] rounded-2xl shadow-none mb-6">
          <CardContent className="p-5 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary text-white text-xl font-black shrink-0">
                #{me.rank}
              </span>
              <div>
                <p className="text-sm text-slate-500 font-medium">Hạng của {child.shortName}</p>
                <p className="text-lg font-bold text-slate-900">Top {me.rank}/{ranked.length} trong lớp</p>
              </div>
            </div>
            <div className="flex gap-3 ml-auto flex-wrap">
              <MiniStat icon={Trophy} label="Điểm thành tích" value={`${me.points}`} />
              <MiniStat icon={Target} label="Điểm trung bình" value={`${me.avgScore}/10`} />
              <MiniStat icon={ClipboardCheck} label="Đã hoàn thành" value={`${me.completed} bài`} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[top3[1], top3[0], top3[2]].filter(Boolean).map((s) => {
          const isFirst = s.rank === 1
          return (
            <Card
              key={s.id}
              className={cn(
                'rounded-2xl shadow-none border text-center',
                isFirst ? 'border-amber-400/50 bg-amber-50' : 'border-border/60 bg-white',
                s.isMe && !isFirst && 'ring-2 ring-primary/30'
              )}
            >
              <CardContent className={cn('p-4 flex flex-col items-center', isFirst ? 'pt-5' : 'pt-6')}>
                <span className={cn('mb-2 inline-flex items-center justify-center rounded-full', isFirst ? 'text-amber-500' : s.rank === 2 ? 'text-slate-400' : 'text-amber-700')}>
                  {isFirst ? <Trophy className="size-7" /> : <Medal className="size-6" />}
                </span>
                <span
                  className={cn('grid place-items-center rounded-full text-white font-black mb-2', isFirst ? 'size-14 text-lg' : 'size-12')}
                  style={{ backgroundColor: s.avatarColor }}
                >
                  {s.initials}
                </span>
                <p className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">{s.isMe ? `${s.name} (Con)` : s.name}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Hạng {s.rank}</p>
                <p className={cn('text-base font-black mt-1', isFirst ? 'text-amber-600' : 'text-primary')}>{s.points} điểm</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Full ranking table */}
      <Card className="border-border/60 rounded-2xl shadow-none overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="px-4 py-3 w-14">Hạng</th>
                  <th className="px-4 py-3">Học sinh</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Bài đã làm</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Điểm TB</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Tổng điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ranked.map((s) => (
                  <tr key={s.id} className={cn(s.isMe ? 'bg-primary/5' : 'hover:bg-slate-50/60 transition-colors')}>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'grid size-7 place-items-center rounded-lg text-sm font-black',
                          s.rank === 1 ? 'bg-amber-400 text-white' : s.rank === 2 ? 'bg-slate-300 text-white' : s.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {s.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="grid size-8 place-items-center rounded-lg text-xs font-black text-white shrink-0" style={{ backgroundColor: s.avatarColor }}>
                          {s.initials}
                        </span>
                        <span className="font-bold text-slate-900 truncate">{s.name}</span>
                        {s.isMe && <Badge className="bg-primary text-white border-none text-[10px] font-bold px-1.5 py-0 rounded shrink-0">Con</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">{s.completed}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{s.avgScore}</td>
                    <td className="px-4 py-3 text-right font-black text-primary">{s.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 font-medium">
          Điểm thành tích = số bài hoàn thành × điểm trung bình. Làm thêm bài tập & kiểm tra để tăng hạng.
        </p>
        <button
          onClick={() => router.push('/student/homework')}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-white text-sm font-black hover:opacity-90 cursor-pointer"
        >
          Làm bài để leo hạng <ArrowRight className="size-4" />
        </button>
      </div>
    </main>
  )
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white border border-border/60 px-3.5 py-2">
      <Icon className="size-4.5 text-primary shrink-0" />
      <div>
        <p className="text-xs text-slate-500 font-medium leading-tight">{label}</p>
        <p className="text-sm font-black text-slate-900">{value}</p>
      </div>
    </div>
  )
}
