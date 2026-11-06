import React, { useState } from 'react';
import {
  Plus,
  Check,
  AlertCircle,
  Clock,
  SlidersHorizontal,
  Download,
  X,
} from 'lucide-react';
import {
  Assignment,
  AssignmentCategory,
  CourseSection,
  Student,
  SubmissionStatus,
} from '../types/classroom';
import { calculateStudentCourseGrade } from '../data/classroomData';
import { PupilAvatar } from './PupilAvatar';

interface GradebookViewProps {
  course: CourseSection;
  students: Student[];
  assignments: Assignment[];
  onUpdateGrade: (
    studentId: string,
    assignmentId: string,
    score: number | null,
    status: SubmissionStatus,
    feedback?: string
  ) => void;
  onAddAssignment: (newAsg: Omit<Assignment, 'id'>) => void;
  onSelectStudent: (studentId: string) => void;
  onExportCSV: () => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  course,
  students,
  assignments,
  onUpdateGrade,
  onAddAssignment,
  onSelectStudent,
  onExportCSV,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | AssignmentCategory>('All');
  const [activeCell, setActiveCell] = useState<{
    studentId: string;
    assignmentId: string;
  } | null>(null);
  const [editScoreStr, setEditScoreStr] = useState<string>('');
  const [editStatus, setEditStatus] = useState<SubmissionStatus>('submitted');
  const [editFeedback, setEditFeedback] = useState<string>('');

  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('PS-08');
  const [newCategory, setNewCategory] = useState<AssignmentCategory>('Problem Sets');
  const [newMaxPoints, setNewMaxPoints] = useState('50');
  const [newDueDate, setNewDueDate] = useState('2026-11-13');
  const [newDescription, setNewDescription] = useState('');

  const visibleAssignments = assignments.filter(
    (a) => categoryFilter === 'All' || a.category === categoryFilter
  );

  const openCellEditor = (student: Student, asg: Assignment) => {
    const entry = student.grades[asg.id];
    setActiveCell({ studentId: student.id, assignmentId: asg.id });
    setEditScoreStr(entry?.score !== null && entry?.score !== undefined ? String(entry.score) : '');
    setEditStatus(entry?.status || 'submitted');
    setEditFeedback(entry?.feedback || '');
  };

  const handleSaveCell = (maxPoints: number) => {
    if (!activeCell) return;
    const parsed = editScoreStr.trim() === '' ? null : Number(editScoreStr);
    const validScore =
      parsed !== null && !Number.isNaN(parsed)
        ? Math.max(0, Math.min(maxPoints + 10, parsed))
        : null;
    const finalStatus: SubmissionStatus =
      validScore === null && editStatus === 'submitted' ? 'missing' : editStatus;

    onUpdateGrade(
      activeCell.studentId,
      activeCell.assignmentId,
      validScore,
      finalStatus,
      editFeedback.trim() || undefined
    );
    setActiveCell(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddAssignment({
      courseId: course.id,
      title: newTitle.trim(),
      shortCode: newCode.trim() || 'ASG-NEW',
      category: newCategory,
      maxPoints: Math.max(10, Number(newMaxPoints) || 50),
      dueDate: newDueDate,
      urgency: 'in-progress',
      description:
        newDescription.trim() || 'Coursework assessment graded against standard rubric.',
    });
    setNewTitle('');
    setNewDescription('');
    setShowNewAsgModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Gradebook Header & Category Weight Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Weighted Grade Book & Rubric Ledger
            </h2>
            <p className="text-xs text-[#64748B]">
              Click any score cell to enter grades, adjust submission status, or leave rubric feedback. Weighted averages recalculate instantaneously.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export Gradebook CSV
            </button>
            <button
              type="button"
              onClick={() => setShowNewAsgModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-transform active:scale-98 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Assignment
            </button>
          </div>
        </div>

        {/* Category Filter Tabs with Weight Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === 'All'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Categories ({assignments.length})
            </button>
            {(
              [
                'Problem Sets',
                'Lab & Inquiry',
                'Unit Assessments',
                'Seminar & Synthesis',
              ] as AssignmentCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-white text-[#4F46E5] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {cat} · {course.categoryWeights[cat]}%
              </button>
            ))}
          </div>

          <div className="text-xs text-[#64748B] flex items-center gap-4">
            <span>
              <strong className="text-[#047857]">Emerald:</strong> ≥90%
            </span>
            <span>
              <strong className="text-[#4F46E5]">Indigo:</strong> 80–89%
            </span>
            <span>
              <strong className="text-[#B45309]">Amber:</strong> Late / &lt;80%
            </span>
            <span>
              <strong className="text-[#BA1A1A]">Crimson:</strong> Missing
            </span>
          </div>
        </div>
      </div>

      {/* Spreadsheet Matrix */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                <th className="py-3.5 pl-5 pr-4 min-w-[210px] sticky left-0 bg-[#F8FAFC] z-10 border-r border-[#E2E8F0]">
                  Pupil
                </th>
                <th className="py-3.5 px-3 text-right min-w-[110px] bg-[#F8FAFC] border-r border-[#E2E8F0]">
                  Weighted Avg
                </th>
                {visibleAssignments.map((asg) => (
                  <th
                    key={asg.id}
                    className="py-3 px-3.5 min-w-[138px] border-r border-[#E2E8F0] last:border-r-0"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-[#4F46E5]">
                        {asg.shortCode}
                      </span>
                      <span className="font-mono text-[10px] text-[#64748B] tabular-nums">
                        /{asg.maxPoints} pts
                      </span>
                    </div>
                    <div
                      className="text-xs font-semibold text-[#0F172A] truncate mt-0.5"
                      title={asg.title}
                    >
                      {asg.title}
                    </div>
                    <div className="text-[10px] font-normal text-[#64748B] mt-0.5">
                      {asg.category.split(' ')[0]} · Due {asg.dueDate.slice(5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {students.map((student) => {
                const gradeInfo = calculateStudentCourseGrade(
                  student,
                  assignments,
                  course.categoryWeights
                );

                return (
                  <tr key={student.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    {/* Sticky Student Column */}
                    <td className="py-3 pl-5 pr-4 sticky left-0 bg-white z-10 border-r border-[#E2E8F0]">
                      <div className="flex items-center gap-2.5">
                        <PupilAvatar
                          seed={student.avatarSeed}
                          firstName={student.firstName}
                          lastName={student.lastName}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student.id)}
                            className="font-semibold text-[#0F172A] hover:text-[#4F46E5] transition-colors truncate block text-left"
                          >
                            {student.firstName} {student.lastName}
                          </button>
                          <div className="text-[11px] text-[#64748B] font-mono tabular-nums">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Weighted Course Average Column */}
                    <td className="py-3 px-3 text-right border-r border-[#E2E8F0] bg-[#F8FAFC]/40">
                      <div className="font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                        {gradeInfo.percentage.toFixed(1)}%
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          gradeInfo.percentage >= 90
                            ? 'text-[#047857]'
                            : gradeInfo.percentage >= 80
                            ? 'text-[#4F46E5]'
                            : 'text-[#B45309]'
                        }`}
                      >
                        Grade {gradeInfo.letter}
                      </div>
                    </td>

                    {/* Individual Assignment Cells */}
                    {visibleAssignments.map((asg) => {
                      const entry = student.grades[asg.id] || {
                        score: null,
                        status: 'submitted' as SubmissionStatus,
                      };
                      const isEditing =
                        activeCell?.studentId === student.id &&
                        activeCell?.assignmentId === asg.id;

                      const pct =
                        entry.score !== null ? (entry.score / asg.maxPoints) * 100 : null;

                      return (
                        <td
                          key={asg.id}
                          onClick={() => !isEditing && openCellEditor(student, asg)}
                          className={`py-2.5 px-3 border-r border-[#E2E8F0] last:border-r-0 cursor-pointer transition-colors relative ${
                            isEditing
                              ? 'bg-[#EEF2FF]/70 ring-2 ring-inset ring-[#4F46E5]'
                              : 'hover:bg-[#EEF2FF]/40'
                          }`}
                        >
                          {isEditing ? (
                            <div
                              className="space-y-2 p-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={asg.maxPoints + 10}
                                  value={editScoreStr}
                                  onChange={(e) => setEditScoreStr(e.target.value)}
                                  placeholder="—"
                                  autoFocus
                                  className="w-16 px-2 py-1 text-xs font-mono font-bold bg-white border border-[#4F46E5] rounded text-[#0F172A] focus:outline-none tabular-nums"
                                />
                                <span className="text-xs font-mono text-[#64748B]">
                                  /{asg.maxPoints}
                                </span>
                              </div>
                              <select
                                value={editStatus}
                                onChange={(e) =>
                                  setEditStatus(e.target.value as SubmissionStatus)
                                }
                                className="w-full text-[11px] font-semibold bg-white border border-[#CBD5E1] rounded px-1.5 py-1 text-[#0F172A]"
                              >
                                <option value="submitted">Submitted On-Time</option>
                                <option value="late">Submitted Late</option>
                                <option value="missing">Missing</option>
                                <option value="excused">Excused</option>
                              </select>
                              <input
                                type="text"
                                value={editFeedback}
                                onChange={(e) => setEditFeedback(e.target.value)}
                                placeholder="Rubric note..."
                                className="w-full text-[11px] bg-white border border-[#CBD5E1] rounded px-1.5 py-1 text-[#0F172A]"
                              />
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveCell(null)}
                                  className="px-2 py-0.5 text-[11px] font-medium text-[#64748B] hover:text-[#0F172A]"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveCell(asg.maxPoints)}
                                  className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#4F46E5] text-white rounded hover:bg-[#4338CA]"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end justify-center min-h-[38px]">
                              {entry.score !== null ? (
                                <>
                                  <div className="flex items-baseline gap-1 font-mono tabular-nums">
                                    <span
                                      className={`text-sm font-bold ${
                                        pct !== null && pct >= 90
                                          ? 'text-[#047857]'
                                          : pct !== null && pct >= 80
                                          ? 'text-[#0F172A]'
                                          : 'text-[#B45309]'
                                      }`}
                                    >
                                      {entry.score}
                                    </span>
                                    <span className="text-[11px] text-[#64748B]">
                                      /{asg.maxPoints}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#64748B] flex items-center gap-1 tabular-nums">
                                    <span>{pct !== null ? `${Math.round(pct)}%` : ''}</span>
                                    {entry.status === 'late' && (
                                      <span className="text-[#B45309] font-semibold">
                                        · Late
                                      </span>
                                    )}
                                  </div>
                                </>
                              ) : entry.status === 'missing' ? (
                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#BA1A1A]">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Missing</span>
                                </div>
                              ) : entry.status === 'excused' ? (
                                <span className="text-xs font-medium text-[#64748B]">
                                  Excused
                                </span>
                              ) : (
                                <span className="text-xs text-[#64748B] font-mono">
                                  Ungraded
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            {/* Assignment Class Mean Footer */}
            <tfoot>
              <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#0F172A]">
                <td className="py-3 pl-5 pr-4 sticky left-0 bg-[#F8FAFC] z-10 border-r border-[#E2E8F0]">
                  Assignment Mean & Submissions
                </td>
                <td className="py-3 px-3 text-right font-mono border-r border-[#E2E8F0] text-[#4F46E5] tabular-nums">
                  Class Curve
                </td>
                {visibleAssignments.map((asg) => {
                  const scoredEntries = students
                    .map((s) => s.grades[asg.id]?.score)
                    .filter((v): v is number => v !== null && v !== undefined);
                  const avgScore =
                    scoredEntries.length > 0
                      ? scoredEntries.reduce((a, b) => a + b, 0) / scoredEntries.length
                      : null;
                  const avgPct =
                    avgScore !== null
                      ? Math.round((avgScore / asg.maxPoints) * 100)
                      : null;

                  return (
                    <td
                      key={asg.id}
                      className="py-3 px-3.5 text-right border-r border-[#E2E8F0] last:border-r-0 font-mono tabular-nums"
                    >
                      {avgScore !== null ? (
                        <div>
                          <span className="font-bold text-[#0F172A]">
                            {avgScore.toFixed(1)}/{asg.maxPoints}
                          </span>{' '}
                          <span className="text-[#047857]">({avgPct}%)</span>
                        </div>
                      ) : (
                        <span className="text-[#64748B]">In Progress</span>
                      )}
                      <div className="text-[10px] font-sans text-[#64748B]">
                        {scoredEntries.length}/{students.length} graded
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showNewAsgModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-modal max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Create Coursework Assignment
                </h3>
                <p className="text-xs text-[#64748B]">
                  {course.name} · {course.period}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAsgModal(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Power Series Interval of Convergence Problem Set"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Rubric Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AssignmentCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="Problem Sets">Problem Sets</option>
                    <option value="Lab & Inquiry">Lab & Inquiry</option>
                    <option value="Unit Assessments">Unit Assessments</option>
                    <option value="Seminar & Synthesis">Seminar & Synthesis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    required
                    value={newMaxPoints}
                    onChange={(e) => setNewMaxPoints(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Syllabus Brief & Learning Objective
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the core mathematical or laboratory synthesis criteria..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAsgModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                >
                  Publish to Gradebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
