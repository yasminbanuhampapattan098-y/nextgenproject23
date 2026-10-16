import React from 'react';
import { Target, CheckCircle2, Award, Flame, Clock } from 'lucide-react';
import { StudentProfile, StudentGoal } from '../types/student';

interface QuickStatsStripProps {
  profile: StudentProfile;
  goals: StudentGoal[];
  onSelectCategory?: (category: string) => void;
}

export const QuickStatsStrip: React.FC<QuickStatsStripProps> = ({ profile, goals }) => {
  const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const completedMilestones = goals.reduce(
    (acc, g) => acc + g.milestones.filter((m) => m.completed).length,
    0
  );
  const milestoneRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const creditPercentage = Math.round((profile.completedCredits / profile.totalCreditsRequired) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* Stat 1: Active Goals */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Goals</span>
          <Target className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {goals.filter((g) => g.status === 'In Progress').length}
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            / {goals.length} total
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          <span>{goals.filter((g) => g.status === 'Completed').length} successfully archived</span>
        </div>
      </div>

      {/* Stat 2: Milestones Progress */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Milestones Done</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
            {completedMilestones}
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            / {totalMilestones} ({milestoneRate}%)
          </span>
        </div>
        <div className="mt-1 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${milestoneRate}%` }}
          />
        </div>
      </div>

      {/* Stat 3: Degree Credits */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Degree Progress</span>
          <Award className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {profile.completedCredits}
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            / {profile.totalCreditsRequired} credits ({creditPercentage}%)
          </span>
        </div>
        <div className="mt-1 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${creditPercentage}%` }}
          />
        </div>
      </div>

      {/* Stat 4: Cumulative GPA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Cumulative GPA</span>
          <span className="text-[11px] font-mono tabular-nums text-slate-400">Target {profile.targetGpa.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {profile.cumulativeGpa.toFixed(2)}
          </span>
          <span className="text-xs text-emerald-400 font-mono tabular-nums">
            +0.08 above honors cutoff
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          <span>{profile.major} · Senior</span>
        </div>
      </div>

      {/* Stat 5: Study Streak & Hours */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Sprint Momentum</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400/20" />
            <span className="font-mono tabular-nums text-xs font-semibold">{profile.currentStreakDays}d streak</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {profile.totalFocusHours.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            focus hours
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Last logged today · 1.5 hrs</span>
        </div>
      </div>
    </div>
  );
};
