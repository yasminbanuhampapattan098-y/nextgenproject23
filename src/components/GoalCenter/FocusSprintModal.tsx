import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Sparkles, Target, BookOpen } from 'lucide-react';
import { StudentGoal } from '../../types/student';

interface FocusSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: StudentGoal[];
  activeGoal: StudentGoal | null;
  onLogStudyTime: (goalId: string, hoursAdded: number, sessionNote: string) => void;
}

export const FocusSprintModal: React.FC<FocusSprintModalProps> = ({
  isOpen,
  onClose,
  goals,
  activeGoal,
  onLogStudyTime,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [sessionNote, setSessionNote] = useState<string>('');

  useEffect(() => {
    if (activeGoal) {
      setSelectedGoalId(activeGoal.id);
    } else if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [activeGoal, goals]);

  // Set duration
  const handleSelectDuration = (mins: number) => {
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsActive(false);
    setSessionCompleted(false);
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      setSessionCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  const handleFinishAndLog = () => {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    const hours = elapsedMinutes / 60;
    if (selectedGoalId) {
      onLogStudyTime(selectedGoalId, hours, sessionNote.trim() || `Completed ${elapsedMinutes}m study sprint`);
    }
    setIsActive(false);
    onClose();
  };

  const currentGoal = goals.find((g) => g.id === selectedGoalId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Goal Focus Sprint
              </h3>
              <p className="text-xs text-slate-400">
                Next-Gen Deep Study & Milestone Momentum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Target Goal Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Link Focus Sprint to Active Goal</span>
            </label>
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  [{g.category}] {g.title}
                </option>
              ))}
            </select>
            {currentGoal && (
              <p className="text-[11px] text-slate-400 mt-1">
                Currently logged: {currentGoal.loggedStudyHours.toFixed(1)} hrs · {currentGoal.milestones.filter(m => m.completed).length}/{currentGoal.milestones.length} milestones
              </p>
            )}
          </div>

          {/* Duration Presets */}
          <div className="flex items-center justify-center gap-2">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectDuration(mins)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  durationMinutes === mins
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50'
                }`}
              >
                {mins}m Sprint
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/60 shadow-inner">
              <div
                className="absolute inset-0 rounded-full border-4 border-indigo-500 transition-all duration-1000"
                style={{
                  clipPath: `inset(0 0 ${100 - progressPercent}% 0)`,
                }}
              />
              <span className="text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                {timeFormatted}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                {isActive ? 'In Focus Flow' : sessionCompleted ? 'Completed!' : 'Ready to Start'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSecondsRemaining(durationMinutes * 60);
                setIsActive(false);
                setSessionCompleted(false);
              }}
              className="p-3 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-colors"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start Sprint'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleFinishAndLog}
              className="p-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors"
              title="Save & log progress"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>

          {/* Session Note */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Sprint Reflection / Accomplishment Note</span>
            </label>
            <input
              type="text"
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="e.g. Read 2 chapters of Operating Systems or drafted lab code..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Elapsed time is automatically recorded in student goal audit</span>
          <button
            onClick={handleFinishAndLog}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            Log & Finish Session →
          </button>
        </div>
      </div>
    </div>
  );
};
