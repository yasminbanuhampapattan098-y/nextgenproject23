import React from 'react';
import { Target, Plus, User } from 'lucide-react';
import { StudentProfile } from '../types/student';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewGoalModal: () => void;
  onOpenProfileModal: () => void;
  onOpenFocusSprint: () => void;
  profile: StudentProfile;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewGoalModal,
  onOpenProfileModal,
  onOpenFocusSprint,
  profile,
}) => {
  const navItems = [
    { id: 'goals', label: 'Goal Radar' },
    { id: 'degree', label: 'Degree Audit & GPA' },
    { id: 'services', label: 'Services & Petitions' },
    { id: 'advising', label: 'Advising Hub' },
    { id: 'vault', label: 'Document Vault' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('goals')}
              className="text-left group flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                NextGen Student Cloud
              </span>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
                    isActive
                      ? 'text-white border-indigo-500 font-semibold'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + compact profile trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenFocusSprint}
              title="Launch Goal Study Timer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Study Sprint</span>
            </button>

            <button
              onClick={onOpenNewGoalModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Goal</span>
            </button>

            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 pl-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span className="hidden xl:inline text-slate-200">{profile.name}</span>
              <div className="w-6 h-6 rounded-md bg-indigo-700/80 text-white flex items-center justify-center font-bold text-[11px]">
                {profile.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-4 border-t border-slate-800/60 text-xs no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 px-2 py-1 rounded ${
                activeTab === item.id ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
