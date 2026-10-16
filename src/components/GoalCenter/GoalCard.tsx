import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Tag,
  AlertTriangle
} from 'lucide-react';
import { StudentGoal, Milestone } from '../../types/student';
import { checkDeadline48h } from '../../utils/deadlines';

interface GoalCardProps {
  goal: StudentGoal;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, milestoneTitle: string, dueDate: string) => void;
  onToggleGoalStatus: (goalId: string) => void;
  onEditGoal: (goal: StudentGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onLaunchTimer: (goal: StudentGoal) => void;
  onSelectTag?: (tag: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggleMilestone,
  onAddMilestone,
  onToggleGoalStatus,
  onEditGoal,
  onDeleteGoal,
  onLaunchTimer,
  onSelectTag,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isAddingMilestone, setIsAddingMilestone] = useState<boolean>(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [newMilestoneDate, setNewMilestoneDate] = useState<string>(goal.targetDate);

  const completedCount = goal.milestones.filter((m) => m.completed).length;
  const totalCount = goal.milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = goal.status === 'Completed';

  // Compute 48-hour deadline warning status
  const deadline = checkDeadline48h(goal.targetDate, isCompleted);

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    onAddMilestone(goal.id, newMilestoneTitle.trim(), newMilestoneDate || goal.targetDate);
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  return (
    <div
      className={`border rounded-xl transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-900/90 border-slate-800/60 opacity-80'
          : deadline.isUrgent48h
          ? 'bg-gradient-to-b from-red-950/20 via-slate-900/95 to-slate-900/95 border-red-500/80 shadow-lg shadow-red-950/30 ring-1 ring-red-500/40'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Top Header / Metadata Zone (Zero-Pill Discipline) */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Unboxed metadata line with typographic bullet separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-indigo-400">{goal.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={`flex items-center gap-1 font-mono tabular-nums ${
                deadline.isUrgent48h ? 'text-red-400 font-bold' : ''
              }`}>
                {deadline.isUrgent48h ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                )}
                Target {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                {deadline.isUrgent48h && ' (Urgent)'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums">
                Priority: <strong className={deadline.isUrgent48h ? 'text-red-400 font-bold' : goal.priority === 'High' ? 'text-amber-400' : 'text-slate-300'}>{goal.priority}</strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums text-slate-400">
                {goal.loggedStudyHours.toFixed(1)} hrs logged
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-semibold tracking-tight ${
              isCompleted 
                ? 'line-through text-slate-400' 
                : deadline.isUrgent48h 
                ? 'text-white font-bold' 
                : 'text-white'
            }`}>
              {goal.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {goal.description}
            </p>

            {/* 48-Hour Deadline Warning Banner */}
            {deadline.isUrgent48h && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/70 border border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold text-white">
                      {deadline.isOverdue ? 'Overdue Deadline Alert: ' : '48-Hour Deadline Warning: '}
                    </span>
                    <span className="text-red-200">{deadline.label}</span>
                  </div>
                </div>
                <button
                  onClick={() => onLaunchTimer(goal)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded text-[11px] shrink-0 flex items-center justify-center gap-1 transition-colors whitespace-nowrap shadow-sm shadow-red-950/50"
                  title="Launch emergency Pomodoro study sprint for this goal"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Emergency Sprint</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Menu dropdown */}
          <div className="relative shrink-0 flex items-center gap-1">
            <button
              onClick={() => onLaunchTimer(goal)}
              title="Launch Study Sprint for this goal"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Goal options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-20 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onToggleGoalStatus(goal.id);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditGoal(goal);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Edit Goal Details</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsAddingMilestone(true);
                    setIsExpanded(true);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Add Sub-Milestone</span>
                </button>
                <div className="h-px bg-slate-700 my-1" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (window.confirm(`Delete goal "${goal.title}"?`)) {
                      onDeleteGoal(goal.id);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Goal</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono tabular-nums">
            <span className="text-slate-400">
              {completedCount} of {totalCount} milestones completed
            </span>
            <span className={`font-semibold ${progressPercent === 100 ? 'text-emerald-400' : 'text-slate-200'}`}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progressPercent === 100
                  ? 'bg-emerald-500'
                  : progressPercent > 50
                  ? 'bg-indigo-500'
                  : 'bg-indigo-600/70'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tags line */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-0.5" />
            {goal.tags.map((t) => (
              <button
                key={t}
                onClick={() => onSelectTag?.(t)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/80 hover:bg-indigo-900/40 hover:text-indigo-300 text-slate-300 border border-slate-700/60 transition-colors"
                title={`Filter goals by tag "${t}"`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Milestones Accordion Header */}
      <div className="px-5 py-2.5 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-medium text-slate-300 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Milestones & Action Steps ({totalCount})</span>
        </button>

        <button
          onClick={() => {
            setIsAddingMilestone(true);
            setIsExpanded(true);
          }}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add Checkpoint</span>
        </button>
      </div>

      {/* Milestones Content List */}
      {isExpanded && (
        <div className="p-5 pt-2 space-y-2 border-t border-slate-800/40">
          {goal.milestones.map((m: Milestone) => (
            <div
              key={m.id}
              className={`flex items-start justify-between gap-3 p-2.5 rounded-lg border transition-colors ${
                m.completed
                  ? 'bg-slate-900/40 border-slate-800/40 text-slate-400'
                  : 'bg-slate-800/40 border-slate-800/80 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleMilestone(goal.id, m.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0 focus:outline-none"
                  aria-label={m.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className={`text-sm ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {m.title}
                  </p>
                  {m.notes && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {m.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                Due {new Date(m.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Quick inline Milestone adder */}
          {isAddingMilestone && (
            <form onSubmit={handleCreateMilestone} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg space-y-2 mt-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="e.g., Complete Chapter 4 Practice Exam or Submit Draft"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Due:</span>
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                  >
                    Save Step
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
