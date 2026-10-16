import React, { useState } from 'react';
import { X, User, Award, BookOpen, Download, RotateCcw, Check, Sparkles } from 'lucide-react';
import { StudentProfile, StudentGoal, DegreeCategory, Appointment } from '../types/student';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  goals: StudentGoal[];
  degreeCategories: DegreeCategory[];
  appointments: Appointment[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  goals,
  degreeCategories,
  appointments,
  onUpdateProfile,
  onResetData,
}) => {
  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [specialization, setSpecialization] = useState(profile.specialization);
  const [targetGpa, setTargetGpa] = useState(profile.targetGpa.toString());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      major,
      specialization,
      targetGpa: parseFloat(targetGpa) || profile.targetGpa,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportAuditReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      student: profile,
      goalsSummary: {
        totalGoals: goals.length,
        inProgress: goals.filter((g) => g.status === 'In Progress').length,
        completed: goals.filter((g) => g.status === 'Completed').length,
        goals: goals.map((g) => ({
          title: g.title,
          category: g.category,
          priority: g.priority,
          status: g.status,
          targetDate: g.targetDate,
          loggedHours: g.loggedStudyHours,
          milestones: g.milestones.map((m) => ({
            title: m.title,
            completed: m.completed,
            dueDate: m.dueDate,
          })),
        })),
      },
      degreeAudit: {
        completedCredits: profile.completedCredits,
        totalRequired: profile.totalCreditsRequired,
        categories: degreeCategories.map((c) => ({
          name: c.name,
          required: c.requiredCredits,
          completed: c.completedCredits,
        })),
      },
      appointments: appointments.map((a) => ({
        advisor: a.advisorName,
        topic: a.topic,
        date: a.date,
        time: a.timeSlot,
        format: a.format,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-goal-audit-${profile.studentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Student Profile & Account Settings
              </h3>
              <p className="text-xs text-slate-400">
                NextGen Cloud Student Credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Identity card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {profile.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{profile.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{profile.studentId} · {profile.academicYear}</p>
                <p className="text-[11px] text-slate-500 font-mono">{profile.email}</p>
              </div>
            </div>

            <div className="text-right font-mono tabular-nums text-xs">
              <span className="text-slate-400 block text-[11px]">Cumulative GPA</span>
              <span className="text-lg font-bold text-emerald-400">{profile.cumulativeGpa.toFixed(2)}</span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Degree Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Track Specialization
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400">
                {isSaved ? 'Changes saved successfully!' : ''}
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
              >
                Save Profile Updates
              </button>
            </div>
          </form>

          {/* Portal Operations & Data Management */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Student Records & Diagnostics
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportAuditReport}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Export Audit Report (JSON)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Comprehensive goals & degree status
                  </span>
                </div>
                <Download className="w-4 h-4 text-indigo-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all goals, appointments, and petitions to default demo data?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-amber-400 block">
                    Reset Demo State
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Restore clean initial dataset
                  </span>
                </div>
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
