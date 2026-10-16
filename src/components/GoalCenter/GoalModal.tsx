import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Target, Tag } from 'lucide-react';
import { StudentGoal, GoalCategory, GoalPriority, Milestone } from '../../types/student';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: StudentGoal) => void;
  initialGoal?: StudentGoal | null;
}

const CATEGORIES: GoalCategory[] = [
  'Academic',
  'Career & Internship',
  'Certification',
  'Research & Thesis',
  'Campus Leadership',
  'Personal Wellness',
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  initialGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Academic');
  const [priority, setPriority] = useState<GoalPriority>('High');
  const [targetDate, setTargetDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [milestones, setMilestones] = useState<Array<{ id: string; title: string; dueDate: string; completed: boolean }>>([
    { id: 'm-new-1', title: '', dueDate: '', completed: false }
  ]);

  const PRESET_TAGS = ['Academic', 'Career', 'Personal', 'Certification', 'Research', 'Leadership', 'Urgent'];

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setCategory(initialGoal.category);
      setPriority(initialGoal.priority);
      setTargetDate(initialGoal.targetDate);
      setTags(initialGoal.tags && initialGoal.tags.length > 0 ? initialGoal.tags : [initialGoal.category]);
      setCustomTagInput('');
      setMilestones(
        initialGoal.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          dueDate: m.dueDate,
          completed: m.completed,
        }))
      );
    } else {
      // Default to 60 days ahead
      const d = new Date();
      d.setDate(d.getDate() + 60);
      const defaultDate = d.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setCategory('Academic');
      setPriority('High');
      setTargetDate(defaultDate);
      setTags(['Academic']);
      setCustomTagInput('');
      setMilestones([
        { id: `m-${Date.now()}-1`, title: 'Define scope and register for requirements', dueDate: defaultDate, completed: false },
        { id: `m-${Date.now()}-2`, title: 'Complete first practice checkpoint or draft review', dueDate: defaultDate, completed: false },
        { id: `m-${Date.now()}-3`, title: 'Final submission or exam verification', dueDate: defaultDate, completed: false }
      ]);
    }
  }, [initialGoal, isOpen]);

  if (!isOpen) return null;

  const handleTogglePresetTag = (preset: string) => {
    if (tags.includes(preset)) {
      setTags(tags.filter((t) => t !== preset));
    } else {
      setTags([...tags, preset]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: `m-${Date.now()}-${milestones.length + 1}`, title: '', dueDate: targetDate, completed: false }
    ]);
  };

  const handleUpdateMilestone = (index: number, field: 'title' | 'dueDate', value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validMilestones: Milestone[] = milestones
      .filter((m) => m.title.trim().length > 0)
      .map((m) => ({
        id: m.id || `m-${Date.now()}-${Math.random()}`,
        title: m.title.trim(),
        dueDate: m.dueDate || targetDate,
        completed: m.completed || false,
      }));

    if (validMilestones.length === 0) {
      validMilestones.push({
        id: `m-${Date.now()}`,
        title: `Complete initial checkpoint for ${title}`,
        dueDate: targetDate,
        completed: false,
      });
    }

    // Include custom tag input if user typed one without pressing Add
    let finalTags = [...tags];
    if (customTagInput.trim() && !finalTags.includes(customTagInput.trim())) {
      finalTags.push(customTagInput.trim());
    }
    if (finalTags.length === 0) {
      finalTags = [category];
    }

    const goalToSave: StudentGoal = {
      id: initialGoal ? initialGoal.id : `goal-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: initialGoal ? initialGoal.status : 'In Progress',
      startDate: initialGoal ? initialGoal.startDate : new Date().toISOString().split('T')[0],
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      milestones: validMilestones,
      loggedStudyHours: initialGoal ? initialGoal.loggedStudyHours : 0,
      tags: finalTags,
    };

    onSaveGoal(goalToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {initialGoal ? 'Edit Student Goal' : 'Define New Student Goal'}
              </h3>
              <p className="text-xs text-slate-400">
                Next-Gen Cloud Goal Achievement Engine
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Goal Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Goal Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Achieve 3.85 GPA in Fall Term or Pass AWS Solutions Architect"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description & Success Metric
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your motivation, core strategy, and criteria for successful completion..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category, Priority, Target Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Custom Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Organization Tags
              </label>
              <span className="text-[11px] text-slate-400">
                {tags.length} {tags.length === 1 ? 'tag' : 'tags'} selected
              </span>
            </div>

            {/* Active Tags Chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950/70 text-indigo-300 border border-indigo-700/60"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-indigo-400 hover:text-white rounded-full p-0.5 hover:bg-indigo-800 transition-colors"
                      title={`Remove tag ${t}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Preset Tags */}
            <div>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Suggested Quick Tags (click to toggle):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((preset) => {
                  const isSelected = tags.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleTogglePresetTag(preset)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="Type custom tag (e.g. 'Capstone', 'AWS-Prep', 'Sprint-1') and press Add or Enter..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomTag}
                disabled={!customTagInput.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Action Checkpoints / Milestones Builder */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Milestones & Deliverables ({milestones.length})
              </label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone Step</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={m.id || idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500 w-5 text-center">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
                    placeholder="Milestone title or deliverable..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <input
                      type="date"
                      value={m.dueDate}
                      onChange={(e) => handleUpdateMilestone(idx, 'dueDate', e.target.value)}
                      className="bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none"
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
            >
              {initialGoal ? 'Update Goal' : 'Save & Track Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
