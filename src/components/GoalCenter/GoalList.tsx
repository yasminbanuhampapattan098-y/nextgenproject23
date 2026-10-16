import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, AlertTriangle, Tag, X } from 'lucide-react';
import { StudentGoal, StudentProfile, GoalCategory } from '../../types/student';
import { GoalCard } from './GoalCard';
import { GoalTrendChart } from './GoalTrendChart';
import { WeeklyProgressSummary } from './WeeklyProgressSummary';
import { checkDeadline48h } from '../../utils/deadlines';

interface GoalListProps {
  goals: StudentGoal[];
  profile: StudentProfile;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, milestoneTitle: string, dueDate: string) => void;
  onToggleGoalStatus: (goalId: string) => void;
  onEditGoal: (goal: StudentGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onLaunchTimer: (goal: StudentGoal) => void;
  onOpenNewGoalModal: () => void;
}

const CATEGORIES: Array<'All' | GoalCategory> = [
  'All',
  'Academic',
  'Career & Internship',
  'Certification',
  'Research & Thesis',
  'Campus Leadership',
];

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  profile,
  onToggleMilestone,
  onAddMilestone,
  onToggleGoalStatus,
  onEditGoal,
  onDeleteGoal,
  onLaunchTimer,
  onOpenNewGoalModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | GoalCategory>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'completed' | 'urgent-48h'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'progress'>('dueDate');

  // Extract all unique custom tags across student goals
  const allUniqueTags = Array.from(
    new Set(goals.flatMap((g) => g.tags || []).filter(Boolean))
  );

  // Calculate goals with critical deadlines within 48 hours or overdue
  const urgentGoals = goals.filter((g) => {
    const dl = checkDeadline48h(g.targetDate, g.status === 'Completed');
    return dl.isUrgent48h;
  });

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    if (selectedTag && !(g.tags || []).includes(selectedTag)) return false;
    if (statusFilter === 'in-progress' && g.status !== 'In Progress') return false;
    if (statusFilter === 'completed' && g.status !== 'Completed') return false;
    if (statusFilter === 'urgent-48h') {
      const dl = checkDeadline48h(g.targetDate, g.status === 'Completed');
      if (!dl.isUrgent48h) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      const matchMilestone = g.milestones.some((m) => m.title.toLowerCase().includes(q));
      const matchTag = (g.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchMilestone && !matchTag) return false;
    }
    return true;
  });

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    }
    if (sortBy === 'priority') {
      const map: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return (map[b.priority] || 0) - (map[a.priority] || 0);
    }
    if (sortBy === 'progress') {
      const pA = a.milestones.length ? a.milestones.filter((m) => m.completed).length / a.milestones.length : 0;
      const pB = b.milestones.length ? b.milestones.filter((m) => m.completed).length / b.milestones.length : 0;
      return pB - pA;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* 7-Day Visual Trend Chart using recharts */}
      <GoalTrendChart goals={goals} />

      {/* Gemini AI Weekly Progress & Schedule Advisor */}
      <WeeklyProgressSummary 
        goals={goals} 
        profile={profile} 
        onLaunchTimer={onLaunchTimer} 
      />

      {/* 48-Hour Deadline Warning Notification Banner */}
      {urgentGoals.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 via-red-950/50 to-slate-900 border border-red-500/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-red-950/30">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/30 border border-red-500/50 text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">
                  Upcoming Target Deadline Warning
                </h4>
                <span className="px-2 py-0.5 rounded text-[11px] bg-red-600 text-white font-mono font-bold tracking-wide">
                  {urgentGoals.length} {urgentGoals.length === 1 ? 'Goal' : 'Goals'} Within 48h
                </span>
              </div>
              <p className="text-red-200/90 text-xs mt-0.5 leading-relaxed">
                Critical deadlines approaching: {urgentGoals.map((g) => `"${g.title}"`).join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter(statusFilter === 'urgent-48h' ? 'all' : 'urgent-48h')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${
                statusFilter === 'urgent-48h'
                  ? 'bg-red-700 text-white shadow-inner'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {statusFilter === 'urgent-48h' ? 'Show All Goals' : 'Filter 48h Deadlines'}
            </button>
          </div>
        </div>
      )}

      {/* Search & Interactive Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student goals, milestones, or key topics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right side controls: Status segmented filter + Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented status filter (functional buttons with click handlers) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Goals
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'in-progress'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('urgent-48h')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'urgent-48h'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : urgentGoals.length > 0
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Due &lt;48h</span>
              {urgentGoals.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {urgentGoals.length}
                </span>
              )}
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="dueDate" className="bg-slate-900 text-slate-200">Sort by Target Date</option>
              <option value="priority" className="bg-slate-900 text-slate-200">Sort by Priority</option>
              <option value="progress" className="bg-slate-900 text-slate-200">Sort by Completion %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips / Tabs (interactive buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' 
            ? goals.length 
            : goals.filter((g) => g.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{cat}</span>
              <span className="font-mono tabular-nums text-[11px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Custom Tag Filter Chips Bar */}
      {allUniqueTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            Tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
              selectedTag === null
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tags
          </button>
          {allUniqueTags.map((tag) => {
            const isSelected = selectedTag === tag;
            const count = goals.filter((g) => (g.tags || []).includes(tag)).length;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>#{tag}</span>
                <span className="font-mono text-[10px] opacity-75">({count})</span>
                {isSelected && <X className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline ml-1 shrink-0"
            >
              Reset Tag
            </button>
          )}
        </div>
      )}

      {/* Goal Cards Grid or Empty State */}
      {sortedGoals.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">No goals matching criteria</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchQuery || selectedTag
                ? `No goals found matching your filters. Try resetting tags or search terms.`
                : 'Get started by creating your next academic, career, or certification milestone.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Clear Tag Filter
              </button>
            )}
            <button
              onClick={onOpenNewGoalModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Student Goal</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={onToggleMilestone}
              onAddMilestone={onAddMilestone}
              onToggleGoalStatus={onToggleGoalStatus}
              onEditGoal={onEditGoal}
              onDeleteGoal={onDeleteGoal}
              onLaunchTimer={onLaunchTimer}
              onSelectTag={(tag) => setSelectedTag(selectedTag === tag ? null : tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
