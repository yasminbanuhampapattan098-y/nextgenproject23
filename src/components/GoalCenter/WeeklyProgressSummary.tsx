import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  CalendarCheck, 
  Target,
  Play,
  Lightbulb
} from 'lucide-react';
import { StudentGoal, StudentProfile } from '../../types/student';

interface LaggingGoal {
  goalId: string;
  goalTitle: string;
  lagReason: string;
  urgency: 'High' | 'Medium' | 'Low' | string;
  targetDate?: string;
  actionItem: string;
}

interface ScheduleAdjustment {
  daySlot: string;
  focusArea: string;
  suggestedHours: number;
  rationale: string;
}

interface WeeklySummaryData {
  period: string;
  overallStatus: 'On Track' | 'Needs Attention' | 'At Risk' | string;
  velocityScore: string;
  keyTakeaway: string;
  laggingGoals: LaggingGoal[];
  scheduleAdjustments: ScheduleAdjustment[];
  strategicRecommendation: string;
}

interface WeeklyProgressSummaryProps {
  goals: StudentGoal[];
  profile: StudentProfile;
  onLaunchTimer: (goal: StudentGoal) => void;
}

export const WeeklyProgressSummary: React.FC<WeeklyProgressSummaryProps> = ({
  goals,
  profile,
  onLaunchTimer,
}) => {
  const [summaryData, setSummaryData] = useState<WeeklySummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedSlots, setAppliedSlots] = useState<Record<string, boolean>>({});

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/weekly-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          goals,
          recentStudyHours: profile.totalFocusHours,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate summary');
      const data = await res.json();
      if (data.summary) {
        setSummaryData(data.summary);
      }
    } catch (err) {
      console.error('Error fetching weekly summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleApplySlot = (idx: number) => {
    setAppliedSlots((prev) => ({ ...prev, [idx]: true }));
  };

  if (isLoading && !summaryData) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-slate-400">
          Gemini AI is analyzing milestone schedules and study velocity...
        </p>
      </div>
    );
  }

  if (!summaryData) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Weekly Progress & Schedule Advisor
              </h3>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs text-indigo-400 font-mono">Powered by Gemini AI</span>
            </div>
            <p className="text-xs text-slate-400">
              Audit for {summaryData.period} · Target Velocity {summaryData.velocityScore}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
            <span className="text-slate-400 text-[11px]">Health:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              summaryData.overallStatus === 'On Track'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {summaryData.overallStatus}
            </span>
          </div>

          <button
            onClick={fetchSummary}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Refresh AI Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Executive Takeaway */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-200">
                Weekly Strategic Diagnostic
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {summaryData.keyTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Lagging Goals on Left, Suggested Schedule Adjustments on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Column 1: Lagging Goals Identifier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Lagging Goals Requiring Attention ({summaryData.laggingGoals.length})</span>
              </span>
              <span className="text-slate-400 text-[11px]">Milestone Risk</span>
            </div>

            <div className="space-y-2.5">
              {summaryData.laggingGoals.map((lg) => {
                const matchedGoal = goals.find((g) => g.id === lg.goalId || g.title.includes(lg.goalTitle.slice(0, 15)));
                return (
                  <div
                    key={lg.goalId}
                    className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-amber-400 font-semibold block">
                          Urgency: {lg.urgency}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate" title={lg.goalTitle}>
                          {lg.goalTitle}
                        </h4>
                      </div>
                      {matchedGoal && (
                        <button
                          onClick={() => onLaunchTimer(matchedGoal)}
                          className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shrink-0"
                          title="Launch Pomodoro Focus sprint for this goal"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Sprint</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lg.lagReason}
                    </p>

                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{lg.actionItem}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Suggested Schedule Adjustments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recommended Study Schedule Adjustments</span>
              </span>
              <span className="text-slate-400 text-[11px]">Time Rebalancing</span>
            </div>

            <div className="space-y-2.5">
              {summaryData.scheduleAdjustments.map((adj, idx) => {
                const isApplied = appliedSlots[idx];
                return (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-indigo-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{adj.daySlot}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold tabular-nums shrink-0">
                        +{adj.suggestedHours} hrs
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        {adj.focusArea}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {adj.rationale}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        {isApplied ? 'Added to weekly study queue' : 'Recommended calendar block'}
                      </span>
                      <button
                        onClick={() => handleApplySlot(idx)}
                        disabled={isApplied}
                        className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1 font-medium ${
                          isApplied
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Scheduled</span>
                          </>
                        ) : (
                          <span>Adopt Slot</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strategic Recommendation Callout */}
        <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-lg flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300">
              <strong className="text-white">Strategic Tip: </strong>
              {summaryData.strategicRecommendation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
