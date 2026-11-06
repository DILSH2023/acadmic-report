import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Check,
  Plus,
  Calendar,
  BookOpen,
} from 'lucide-react';
import {
  Assignment,
  AssignmentCategory,
  AttendanceStatus,
  BehaviorCategory,
  BehavioralInsight,
  BehaviorTone,
  CourseSection,
  Student,
  SubmissionStatus,
} from '../types/classroom';
import {
  calculateAttendanceMetrics,
  calculateStudentCourseGrade,
} from '../data/classroomData';
import { MomentumRing } from './MomentumRing';
import { PupilAvatar } from './PupilAvatar';

interface PupilInspectorModalProps {
  student: Student;
  course: CourseSection;
  assignments: Assignment[];
  insights: BehavioralInsight[];
  onClose: () => void;
  onUpdateMilestone: (studentId: string, milestone: string, progress: number) => void;
  onUpdateGrade: (
    studentId: string,
    assignmentId: string,
    score: number | null,
    status: SubmissionStatus,
    feedback?: string
  ) => void;
  onUpdateAttendance: (
    studentId: string,
    date: string,
    status: AttendanceStatus
  ) => void;
  onAddInsight: (newInsight: {
    studentId: string;
    category: BehaviorCategory;
    tone: BehaviorTone;
    momentumDelta: number;
    observation: string;
    actionItem?: string;
    guardianNotified: boolean;
  }) => void;
}

export const PupilInspectorModal: React.FC<PupilInspectorModalProps> = ({
  student,
  course,
  assignments,
  insights,
  onClose,
  onUpdateMilestone,
  onUpdateGrade,
  onUpdateAttendance,
  onAddInsight,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grades' | 'attendance' | 'behavior'>('grades');
  const [milestoneText, setMilestoneText] = useState(student.currentMilestone);
  const [milestonePct, setMilestonePct] = useState(student.milestoneProgress);
  const [digestCopied, setDigestCopied] = useState(false);

  // Quick note state inside drawer
  const [quickCategory, setQuickCategory] = useState<BehaviorCategory>('Conceptual Breakthrough');
  const [quickDelta, setQuickDelta] = useState<number>(6);
  const [quickObs, setQuickObs] = useState('');
  const [quickAction, setQuickAction] = useState('');

  const gradeInfo = calculateStudentCourseGrade(
    student,
    assignments,
    course.categoryWeights
  );
  const attInfo = calculateAttendanceMetrics(student);
  const studentInsights = insights.filter((i) => i.studentId === student.id);

  const handleSaveMilestone = () => {
    onUpdateMilestone(student.id, milestoneText, milestonePct);
  };

  const handleCopyGuardianDigest = () => {
    const summaryText = `Academic Momentum Progress Update for ${student.firstName} ${student.lastName} (${course.name}): Weighted Average ${gradeInfo.percentage.toFixed(1)}% (${gradeInfo.letter}), Attendance ${attInfo.attendanceRate.toFixed(1)}%, Current Milestone: ${student.currentMilestone} (${student.milestoneProgress}%).`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).catch(() => {});
    }
    setDigestCopied(true);
    setTimeout(() => setDigestCopied(false), 2500);
  };

  const handleQuickAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickObs.trim()) return;
    onAddInsight({
      studentId: student.id,
      category: quickCategory,
      tone: quickDelta >= 0 ? 'positive' : 'warning',
      momentumDelta: quickDelta,
      observation: quickObs.trim(),
      actionItem: quickAction.trim() || undefined,
      guardianNotified: true,
    });
    setQuickObs('');
    setQuickAction('');
  };

  const cycleStatus = (current: AttendanceStatus): AttendanceStatus => {
    const order: AttendanceStatus[] = ['present', 'late', 'excused', 'absent'];
    return order[(order.indexOf(current) + 1) % order.length];
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-modal border-l border-[#E2E8F0] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          {/* Top Pupil Identity Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
            <div className="flex items-center gap-4">
              <PupilAvatar
                seed={student.avatarSeed}
                firstName={student.firstName}
                lastName={student.lastName}
                size="lg"
              />
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {student.firstName} {student.lastName}
                </h2>
                <div className="text-xs text-[#64748B] mt-0.5">
                  {course.name} · {student.seat} · {student.studentCode}
                </div>
                <div className="text-xs text-[#464555] mt-1 flex flex-wrap items-center gap-2">
                  <span>
                    Guardian: <strong>{student.guardianName}</strong> ({student.guardianRelation})
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{student.guardianPhone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyGuardianDigest}
                className="px-3 py-1.5 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {digestCopied ? 'Digest Copied' : 'Copy Guardian Digest'}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close pupil profile"
                className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Circular Progress Rings */}
          <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <MomentumRing
                value={gradeInfo.percentage}
                variant="indigo"
                size={64}
                strokeWidth={6}
                centerLabel={gradeInfo.letter}
              />
              <div>
                <div className="text-[11px] font-semibold text-[#64748B]">
                  Course Avg
                </div>
                <div className="text-base font-bold font-mono text-[#0F172A] tabular-nums">
                  {gradeInfo.percentage.toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#64748B] tabular-nums">
                  {gradeInfo.completedCount}/{assignments.length} graded
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MomentumRing
                value={attInfo.attendanceRate}
                variant="emerald"
                size={64}
                strokeWidth={6}
                centerLabel={`${Math.round(attInfo.attendanceRate)}%`}
              />
              <div>
                <div className="text-[11px] font-semibold text-[#64748B]">
                  Attendance
                </div>
                <div className="text-base font-bold font-mono text-[#0F172A] tabular-nums">
                  {student.streakDays}d streak
                </div>
                <div className="text-[11px] text-[#64748B] tabular-nums">
                  {attInfo.presentCount}P · {attInfo.lateCount}L · {attInfo.absentCount}A
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MomentumRing
                value={student.momentumScore}
                variant={student.momentumScore >= 80 ? 'emerald' : 'amber'}
                size={64}
                strokeWidth={6}
                centerLabel={String(student.momentumScore)}
              />
              <div>
                <div className="text-[11px] font-semibold text-[#64748B]">
                  Momentum
                </div>
                <div
                  className={`text-base font-bold font-mono tabular-nums ${
                    student.momentumDeltaWeek >= 0 ? 'text-[#047857]' : 'text-[#B45309]'
                  }`}
                >
                  {student.momentumDeltaWeek >= 0
                    ? `+${student.momentumDeltaWeek} wk`
                    : `${student.momentumDeltaWeek} wk`}
                </div>
                <div className="text-[11px] text-[#64748B] tabular-nums">
                  {studentInsights.length} logged notes
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Learning Milestone Editor */}
          <div className="p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">
                Active Coursework Milestone Target
              </span>
              <span className="font-mono text-xs font-bold text-[#4F46E5] tabular-nums">
                {milestonePct}% Complete
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={milestoneText}
                onChange={(e) => setMilestoneText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={milestonePct}
                  onChange={(e) => setMilestonePct(Number(e.target.value))}
                  aria-label="Milestone completion percentage"
                  className="w-28 accent-[#10B981]"
                />
                <button
                  type="button"
                  onClick={handleSaveMilestone}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg whitespace-nowrap shrink-0"
                >
                  Update Goal
                </button>
              </div>
            </div>
          </div>

          {/* Sub-navigation Tabs inside Inspector */}
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSubTab('grades')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'grades'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Coursework & Grades ({assignments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('attendance')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'attendance'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              10-Day Attendance Log
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('behavior')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'behavior'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Behavioral Insights ({studentInsights.length})
            </button>
          </div>

          {/* Sub-Tab 1: Coursework & Grades */}
          {activeSubTab === 'grades' && (
            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
              {assignments.map((asg) => {
                const entry = student.grades[asg.id] || {
                  score: null,
                  status: 'submitted' as SubmissionStatus,
                };
                return (
                  <div
                    key={asg.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#F8FAFC]"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#4F46E5]">
                          {asg.shortCode}
                        </span>
                        <span>·</span>
                        <span>{asg.category}</span>
                        <span>·</span>
                        <span className="tabular-nums">Due {asg.dueDate}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#0F172A] truncate">
                        {asg.title}
                      </div>
                      {entry.feedback && (
                        <div className="text-xs text-[#047857] mt-0.5">
                          Note: {entry.feedback}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={asg.maxPoints + 10}
                        value={entry.score ?? ''}
                        placeholder="—"
                        onChange={(e) => {
                          const val =
                            e.target.value === '' ? null : Number(e.target.value);
                          onUpdateGrade(
                            student.id,
                            asg.id,
                            val,
                            val !== null ? 'submitted' : 'missing',
                            entry.feedback
                          );
                        }}
                        aria-label={`Score for ${asg.title}`}
                        className="w-16 px-2.5 py-1 text-xs font-mono font-bold text-right bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] tabular-nums focus:outline-none focus:border-[#4F46E5]"
                      />
                      <span className="text-xs font-mono text-[#64748B] tabular-nums w-12">
                        /{asg.maxPoints}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub-Tab 2: 10-Day Attendance Log */}
          {activeSubTab === 'attendance' && (
            <div className="space-y-3">
              <p className="text-xs text-[#64748B]">
                Click any date row below to cycle attendance status between Present, Late, Excused, and Absent.
              </p>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                {student.attendance
                  .slice()
                  .reverse()
                  .map((rec) => (
                    <div
                      key={rec.date}
                      onClick={() =>
                        onUpdateAttendance(
                          student.id,
                          rec.date,
                          cycleStatus(rec.status)
                        )
                      }
                      className="p-3.5 flex items-center justify-between bg-white hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] tabular-nums">
                          {rec.label} ({rec.date})
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {rec.arrivalTime
                            ? `Arrived at ${rec.arrivalTime}`
                            : 'No arrival timestamp'}
                          {rec.note ? ` · ${rec.note}` : ''}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          rec.status === 'present'
                            ? 'bg-[#ECFDF5] text-[#047857]'
                            : rec.status === 'late'
                            ? 'bg-[#FFFBEB] text-[#B45309]'
                            : rec.status === 'excused'
                            ? 'bg-[#EEF2FF] text-[#4338CA]'
                            : 'bg-[#FFDAD6] text-[#93000A]'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Behavioral Insights & Quick Logger */}
          {activeSubTab === 'behavior' && (
            <div className="space-y-4">
              <form
                onSubmit={handleQuickAddInsight}
                className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3"
              >
                <div className="text-xs font-bold text-[#0F172A]">
                  Log New Observation for {student.firstName}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={quickCategory}
                    onChange={(e) =>
                      setQuickCategory(e.target.value as BehaviorCategory)
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  >
                    <option value="Conceptual Breakthrough">Conceptual Breakthrough</option>
                    <option value="Collaborative Leadership">Collaborative Leadership</option>
                    <option value="Peer Mentorship">Peer Mentorship</option>
                    <option value="Deep Focus">Deep Focus</option>
                    <option value="Deadline Check-in">Deadline Check-in</option>
                    <option value="Attention & Pacing">Attention & Pacing</option>
                  </select>
                  <select
                    value={quickDelta}
                    onChange={(e) => setQuickDelta(Number(e.target.value))}
                    className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  >
                    <option value={8}>+8 pts (Breakthrough)</option>
                    <option value={5}>+5 pts (Steady Habit)</option>
                    <option value={3}>+3 pts (Encouragement)</option>
                    <option value={-4}>-4 pts (Needs Check-in)</option>
                    <option value={-6}>-6 pts (Urgent Support)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  value={quickObs}
                  onChange={(e) => setQuickObs(e.target.value)}
                  placeholder={`Record specific observation for ${student.firstName}...`}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quickAction}
                    onChange={(e) => setQuickAction(e.target.value)}
                    placeholder="Optional follow-up action item..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg whitespace-nowrap shrink-0"
                  >
                    Add Note
                  </button>
                </div>
              </form>

              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden">
                {studentInsights.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    No behavioral notes logged for {student.firstName} yet.
                  </div>
                ) : (
                  studentInsights.map((ins) => (
                    <div key={ins.id} className="p-3.5 bg-white space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#4F46E5]">
                          {ins.category}
                        </span>
                        <span className="font-mono font-bold text-[#047857] tabular-nums">
                          {ins.momentumDelta >= 0
                            ? `+${ins.momentumDelta} pts`
                            : `${ins.momentumDelta} pts`}
                        </span>
                      </div>
                      <p className="text-xs text-[#0F172A] leading-relaxed">
                        {ins.observation}
                      </p>
                      <div className="text-[11px] text-[#64748B]">
                        {ins.timestamp}
                        {ins.actionItem ? ` · Follow-up: ${ins.actionItem}` : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
