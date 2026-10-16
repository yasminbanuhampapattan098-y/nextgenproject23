import React, { useState } from 'react';
import { Award, Calculator, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { DegreeCategory, StudentProfile } from '../../types/student';

interface DegreeAuditViewProps {
  categories: DegreeCategory[];
  profile: StudentProfile;
  onUpdateTargetGpa: (newTarget: number) => void;
}

const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0,
};

export const DegreeAuditView: React.FC<DegreeAuditViewProps> = ({
  categories,
  profile,
  onUpdateTargetGpa,
}) => {
  // Find all currently enrolled courses for real-time GPA simulation
  const enrolledCourses = categories.flatMap((c) =>
    c.courses.filter((course) => course.status === 'Enrolled')
  );

  // State for projected grades in currently enrolled courses
  const [projectedGrades, setProjectedGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    enrolledCourses.forEach((c) => {
      initial[c.code] = 'A';
    });
    return initial;
  });

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [targetInput, setTargetInput] = useState<string>(profile.targetGpa.toString());

  // Calculate simulated GPA
  const priorCompletedCredits = profile.completedCredits;
  const priorGradePointsTotal = profile.cumulativeGpa * priorCompletedCredits;

  let simulatedSemesterCredits = 0;
  let simulatedSemesterPoints = 0;

  enrolledCourses.forEach((course) => {
    const grade = projectedGrades[course.code] || 'A';
    const points = GRADE_POINTS[grade] ?? 4.0;
    simulatedSemesterCredits += course.credits;
    simulatedSemesterPoints += points * course.credits;
  });

  const simulatedTotalCredits = priorCompletedCredits + simulatedSemesterCredits;
  const simulatedCumulativeGpa =
    simulatedTotalCredits > 0
      ? (priorGradePointsTotal + simulatedSemesterPoints) / simulatedTotalCredits
      : profile.cumulativeGpa;

  const simulatedSemesterGpa =
    simulatedSemesterCredits > 0 ? simulatedSemesterPoints / simulatedSemesterCredits : 0;

  const handleGradeChange = (courseCode: string, newGrade: string) => {
    setProjectedGrades((prev) => ({
      ...prev,
      [courseCode]: newGrade,
    }));
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val >= 2.0 && val <= 4.0) {
      onUpdateTargetGpa(val);
    }
  };

  const filteredCategories =
    activeCategoryTab === 'all'
      ? categories
      : categories.filter((c) => c.id === activeCategoryTab);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">{profile.major}</span>
              <span aria-hidden="true">·</span>
              <span>Degree Track: {profile.specialization}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">ID: {profile.studentId}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Degree Audit & GPA Target Simulator
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time audit of required university credits, general education competencies, and predictive GPA outcomes for graduation honors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5">
              <span className="text-slate-400 block text-[11px]">Cumulative GPA</span>
              <span className="text-lg font-bold text-white">{profile.cumulativeGpa.toFixed(2)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5">
              <span className="text-slate-400 block text-[11px]">Target Honors</span>
              <span className="text-lg font-bold text-indigo-400">{profile.targetGpa.toFixed(2)}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5">
              <span className="text-slate-400 block text-[11px]">Degree Credits</span>
              <span className="text-lg font-bold text-emerald-400">
                {profile.completedCredits} / {profile.totalCreditsRequired}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive GPA Simulator Component */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Fall 2026 Term GPA Predictor
              </h3>
              <p className="text-xs text-slate-400">
                Adjust projected grades below to simulate cumulative graduation standing
              </p>
            </div>
          </div>

          {/* Target GPA Adjuster */}
          <form onSubmit={handleSaveTarget} className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Set Target GPA:</span>
            <input
              type="number"
              step="0.01"
              min="2.0"
              max="4.0"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              Update
            </button>
          </form>
        </div>

        {/* Course Grade Simulator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {enrolledCourses.map((course) => {
            const currentGrade = projectedGrades[course.code] || 'A';
            return (
              <div
                key={course.code}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {course.credits} Credits
                  </span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-1" title={course.name}>
                  {course.name}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400">Projected Grade:</span>
                  <select
                    value={currentGrade}
                    onChange={(e) => handleGradeChange(course.code, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white font-mono text-xs rounded px-2 py-0.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prediction Results Banner */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-mono tabular-nums">
            <div>
              <span className="text-slate-400 block text-[11px]">Term Semester GPA</span>
              <span className="text-base font-bold text-white">{simulatedSemesterGpa.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Projected Cumulative GPA</span>
              <span className={`text-base font-bold ${simulatedCumulativeGpa >= profile.targetGpa ? 'text-emerald-400' : 'text-amber-400'}`}>
                {simulatedCumulativeGpa.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cumulative Delta</span>
              <span className="text-base font-bold text-slate-200">
                {(simulatedCumulativeGpa - profile.cumulativeGpa >= 0 ? '+' : '')}
                {(simulatedCumulativeGpa - profile.cumulativeGpa).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-xs text-right sm:border-l sm:border-slate-800 sm:pl-4">
            {simulatedCumulativeGpa >= profile.targetGpa ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 justify-end">
                <CheckCircle2 className="w-4 h-4" />
                Target Honors Standing Achieved (≥ {profile.targetGpa.toFixed(2)})
              </span>
            ) : (
              <span className="text-amber-400 font-medium">
                Target ({profile.targetGpa.toFixed(2)}) is {(profile.targetGpa - simulatedCumulativeGpa).toFixed(2)} points away
              </span>
            )}
            <p className="text-[11px] text-slate-400 mt-0.5">
              Reflected on official transcripts upon Registrar semester close
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Requirements Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">
            Curriculum Audit Categories
          </h3>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeCategoryTab === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Requirements
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategoryTab(c.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeCategoryTab === c.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Category Detailed Tables */}
        {filteredCategories.map((category) => {
          const percent = Math.min(
            100,
            Math.round((category.completedCredits / category.requiredCredits) * 100)
          );

          return (
            <div
              key={category.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-4 sm:px-6 bg-slate-900/70 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">{category.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                    <span>{category.completedCredits} / {category.requiredCredits} credits completed</span>
                    <span aria-hidden="true">·</span>
                    <span className={percent === 100 ? 'text-emerald-400' : 'text-slate-300'}>
                      {percent}% satisfied
                    </span>
                  </div>
                </div>

                <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden shrink-0">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Course rows table (High density, clean typographic alignments) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                      <th className="py-2.5 px-4 sm:px-6">Course Code</th>
                      <th className="py-2.5 px-4">Title</th>
                      <th className="py-2.5 px-4 text-center">Semester</th>
                      <th className="py-2.5 px-4 text-right">Credits</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                      <th className="py-2.5 px-4 sm:px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {category.courses.map((course) => {
                      return (
                        <tr
                          key={course.code}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-2.5 px-4 sm:px-6 font-semibold text-indigo-300">
                            {course.code}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-200">
                            {course.name}
                          </td>
                          <td className="py-2.5 px-4 text-center text-slate-400">
                            {course.semester}
                          </td>
                          <td className="py-2.5 px-4 text-right tabular-nums text-slate-300">
                            {course.credits}
                          </td>
                          <td className="py-2.5 px-4 text-center font-bold">
                            {course.grade ? (
                              <span className="text-emerald-400">{course.grade}</span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 sm:px-6 text-right font-sans">
                            {course.status === 'Completed' && (
                              <span className="text-emerald-400 font-medium">Completed</span>
                            )}
                            {course.status === 'Enrolled' && (
                              <span className="text-sky-400 font-medium">Enrolled (Fall 26)</span>
                            )}
                            {course.status === 'Planned' && (
                              <span className="text-slate-500 font-medium">Planned</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
