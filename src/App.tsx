/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  Assignment,
  AttendanceStatus,
  BehaviorCategory,
  BehavioralInsight,
  BehaviorTone,
  Student,
  SubmissionStatus,
} from './types/classroom';
import {
  COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_INSIGHTS,
  INITIAL_STUDENTS,
  SCHOOL_DATES,
  calculateStudentCourseGrade,
  calculateAttendanceMetrics,
} from './data/classroomData';
import { OverviewView } from './components/OverviewView';
import { AttendanceView } from './components/AttendanceView';
import { GradebookView } from './components/GradebookView';
import { BehaviorInsightsView } from './components/BehaviorInsightsView';
import { PupilDirectoryView } from './components/PupilDirectoryView';
import { PupilInspectorModal } from './components/PupilInspectorModal';

type ActiveTab = 'overview' | 'attendance' | 'gradebook' | 'behavior' | 'students';

const STORAGE_KEYS = {
  STUDENTS: 'academic_momentum_students_v1',
  ASSIGNMENTS: 'academic_momentum_assignments_v1',
  INSIGHTS: 'academic_momentum_insights_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeCourseId, setActiveCourseId] = useState<string>('calc-bc-p2');

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [insights, setInsights] = useState<BehavioralInsight[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
    } catch {
      return INITIAL_INSIGHTS;
    }
  });

  const [inspectedStudentId, setInspectedStudentId] = useState<string | null>(null);
  const [quickInsightModalOpen, setQuickInsightModalOpen] = useState(false);
  const [quickInsightStudentId, setQuickInsightStudentId] = useState<string>('');
  const [quickInsightCategory, setQuickInsightCategory] =
    useState<BehaviorCategory>('Conceptual Breakthrough');
  const [quickInsightDelta, setQuickInsightDelta] = useState<number>(6);
  const [quickInsightObs, setQuickInsightObs] = useState<string>('');
  const [quickInsightAction, setQuickInsightAction] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {
      // ignore storage errors
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch {
      // ignore storage errors
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
    } catch {
      // ignore storage errors
    }
  }, [insights]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const currentCourse =
    COURSES.find((c) => c.id === activeCourseId) || COURSES[0];
  const courseStudents = students.filter((s) => s.courseId === activeCourseId);
  const courseAssignments = assignments.filter(
    (a) => a.courseId === activeCourseId
  );
  const courseInsights = insights.filter((i) => i.courseId === activeCourseId);

  const inspectedStudent =
    students.find((s) => s.id === inspectedStudentId) || null;

  // Attendance handlers
  const handleUpdateAttendance = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    arrivalTime?: string,
    note?: string
  ) => {
    const dateMeta =
      SCHOOL_DATES.find((d) => d.date === date) ||
      SCHOOL_DATES[SCHOOL_DATES.length - 1];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const exists = s.attendance.some((a) => a.date === date);
        const updatedAttendance = exists
          ? s.attendance.map((a) =>
              a.date === date
                ? {
                    ...a,
                    status,
                    arrivalTime:
                      arrivalTime !== undefined ? arrivalTime : a.arrivalTime,
                    note: note !== undefined ? note : a.note,
                  }
                : a
            )
          : [
              ...s.attendance,
              {
                date,
                label: dateMeta.label,
                status,
                arrivalTime: arrivalTime || '08:42',
                note,
              },
            ];

        return {
          ...s,
          attendance: updatedAttendance,
        };
      })
    );
  };

  const handleMarkAllPresent = (date: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.courseId !== activeCourseId) return s;
        return {
          ...s,
          attendance: s.attendance.map((a) =>
            a.date === date
              ? { ...a, status: 'present', arrivalTime: a.arrivalTime || '08:41' }
              : a
          ),
        };
      })
    );
  };

  // Gradebook handlers
  const handleUpdateGrade = (
    studentId: string,
    assignmentId: string,
    score: number | null,
    status: SubmissionStatus,
    feedback?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          grades: {
            ...s.grades,
            [assignmentId]: {
              ...s.grades[assignmentId],
              score,
              status,
              submittedAt: 'Nov 06 · Updated',
              feedback:
                feedback !== undefined
                  ? feedback
                  : s.grades[assignmentId]?.feedback,
            },
          },
        };
      })
    );
    showToast('Rubric grade and weighted course average updated.');
  };

  const handleAddAssignment = (newAsg: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    const created: Assignment = { ...newAsg, id };
    setAssignments((prev) => [...prev, created]);
    setStudents((prev) =>
      prev.map((s) =>
        s.courseId === newAsg.courseId
          ? {
              ...s,
              grades: {
                ...s.grades,
                [id]: { score: null, status: 'submitted' },
              },
            }
          : s
      )
    );
    showToast(`Added "${created.title}" (${created.shortCode}) to Gradebook.`);
  };

  // Behavioral Insight handlers
  const handleAddInsight = (newInsight: {
    studentId: string;
    category: BehaviorCategory;
    tone: BehaviorTone;
    momentumDelta: number;
    observation: string;
    actionItem?: string;
    guardianNotified: boolean;
  }) => {
    const targetStudent = students.find((s) => s.id === newInsight.studentId);
    const entry: BehavioralInsight = {
      id: `ins-${Date.now()}`,
      studentId: newInsight.studentId,
      courseId: targetStudent?.courseId || activeCourseId,
      timestamp: 'Just now · Nov 06',
      dateISO: '2026-11-06',
      category: newInsight.category,
      tone: newInsight.tone,
      momentumDelta: newInsight.momentumDelta,
      observation: newInsight.observation,
      actionItem: newInsight.actionItem,
      actionCompleted: false,
      guardianNotified: newInsight.guardianNotified,
    };

    setInsights((prev) => [entry, ...prev]);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== newInsight.studentId) return s;
        const nextMomentum = Math.max(
          10,
          Math.min(100, s.momentumScore + newInsight.momentumDelta)
        );
        return {
          ...s,
          momentumScore: nextMomentum,
          momentumDeltaWeek: s.momentumDeltaWeek + newInsight.momentumDelta,
        };
      })
    );

    showToast(
      `Logged ${newInsight.category} for ${targetStudent?.firstName || 'pupil'} (${
        newInsight.momentumDelta >= 0
          ? `+${newInsight.momentumDelta}`
          : newInsight.momentumDelta
      } momentum).`
    );
  };

  const handleToggleInsightAction = (insightId: string) => {
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === insightId
          ? { ...ins, actionCompleted: !ins.actionCompleted }
          : ins
      )
    );
  };

  const handleToggleGuardianNotified = (insightId: string) => {
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === insightId
          ? { ...ins, guardianNotified: !ins.guardianNotified }
          : ins
      )
    );
  };

  const handleUpdateMilestone = (
    studentId: string,
    milestone: string,
    progress: number
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, currentMilestone: milestone, milestoneProgress: progress }
          : s
      )
    );
    showToast('Updated pupil coursework milestone target.');
  };

  const handleAddStudent = (newPupil: {
    firstName: string;
    lastName: string;
    email: string;
    seat: string;
    currentMilestone: string;
    guardianName: string;
    guardianRelation: string;
    guardianEmail: string;
    guardianPhone: string;
  }) => {
    const newId = `stu-${Date.now()}`;
    const initialGrades: Record<string, { score: number | null; status: SubmissionStatus }> = {};
    for (const asg of courseAssignments) {
      initialGrades[asg.id] = {
        score: Math.round(asg.maxPoints * 0.9),
        status: 'submitted',
      };
    }

    const created: Student = {
      id: newId,
      courseId: activeCourseId,
      studentCode: `AM-2026-${Math.floor(300 + Math.random() * 600)}`,
      firstName: newPupil.firstName,
      lastName: newPupil.lastName,
      email: newPupil.email,
      seat: newPupil.seat,
      avatarSeed: students.length + 1,
      streakDays: 5,
      momentumScore: 88,
      momentumDeltaWeek: 4,
      currentMilestone: newPupil.currentMilestone,
      milestoneProgress: 75,
      guardianName: newPupil.guardianName,
      guardianRelation: newPupil.guardianRelation,
      guardianEmail: newPupil.guardianEmail,
      guardianPhone: newPupil.guardianPhone,
      attendance: SCHOOL_DATES.map((d) => ({
        date: d.date,
        label: d.label,
        status: 'present',
        arrivalTime: '08:41',
      })),
      grades: initialGrades,
    };

    setStudents((prev) => [...prev, created]);
    showToast(`Enrolled ${created.firstName} ${created.lastName} in ${currentCourse.name}.`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Student Code',
      'First Name',
      'Last Name',
      'Seat',
      'Weighted Grade %',
      'Letter Grade',
      'Attendance Rate %',
      'Streak Days',
      'Momentum Score',
      ...courseAssignments.map((a) => `${a.shortCode} (/${a.maxPoints})`),
    ];

    const rows = courseStudents.map((s) => {
      const g = calculateStudentCourseGrade(
        s,
        courseAssignments,
        currentCourse.categoryWeights
      );
      const att = calculateAttendanceMetrics(s);
      return [
        s.studentCode,
        s.firstName,
        s.lastName,
        `"${s.seat}"`,
        g.percentage.toFixed(1),
        g.letter,
        att.attendanceRate.toFixed(1),
        String(s.streakDays),
        String(s.momentumScore),
        ...courseAssignments.map((a) =>
          s.grades[a.id]?.score !== null && s.grades[a.id]?.score !== undefined
            ? String(s.grades[a.id].score)
            : s.grades[a.id]?.status || ''
        ),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentCourse.code}_Academic_Momentum_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${currentCourse.name} report CSV.`);
  };

  const handleResetDemo = () => {
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setInsights(INITIAL_INSIGHTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.INSIGHTS);
    showToast('Restored default classroom dataset.');
  };

  const openQuickInsightModal = (defaultStudentId?: string) => {
    setQuickInsightStudentId(
      defaultStudentId || courseStudents[0]?.id || ''
    );
    setQuickInsightModalOpen(true);
  };

  const handleQuickInsightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInsightObs.trim() || !quickInsightStudentId) return;
    handleAddInsight({
      studentId: quickInsightStudentId,
      category: quickInsightCategory,
      tone: quickInsightDelta >= 0 ? 'positive' : 'warning',
      momentumDelta: quickInsightDelta,
      observation: quickInsightObs.trim(),
      actionItem: quickInsightAction.trim() || undefined,
      guardianNotified: true,
    });
    setQuickInsightObs('');
    setQuickInsightAction('');
    setQuickInsightModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Strictly Compliant 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
          >
            Academic Momentum
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="flex items-center gap-5 sm:gap-7 text-sm font-semibold text-[#64748B] overflow-x-auto">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'gradebook', label: 'Gradebook' },
                { id: 'behavior', label: 'Behavior' },
                { id: 'students', label: 'Students' },
              ] as const
            ).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-[#4F46E5] text-[#4F46E5]'
                      : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => openQuickInsightModal()}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-transform active:scale-98 whitespace-nowrap shrink-0 shadow-xs"
            >
              Log Observation
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Course Switcher & Context Bar */}
      <div className="bg-white/80 border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Course Section Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto">
              {COURSES.map((c) => {
                const active = c.id === activeCourseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCourseId(c.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-[#4F46E5] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {c.name} · {c.period}
                  </button>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center gap-2 text-xs text-[#64748B]">
              <span>{currentCourse.code}</span>
              <span aria-hidden="true">·</span>
              <span>{currentCourse.room}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{currentCourse.schedule}</span>
            </div>
          </div>

          {/* Utility Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {toastMessage && (
              <span className="text-xs font-semibold text-[#047857] bg-[#ECFDF5] px-3 py-1.5 rounded-lg">
                {toastMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              title="Reset classroom data to initial state"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            course={currentCourse}
            students={courseStudents}
            assignments={courseAssignments}
            insights={courseInsights}
            onSelectStudent={(id) => setInspectedStudentId(id)}
            onQuickToggleTodayAttendance={(studentId, nextStatus) =>
              handleUpdateAttendance(studentId, '2026-11-06', nextStatus)
            }
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewInsightModal={(studentId) => openQuickInsightModal(studentId)}
            onToggleInsightAction={handleToggleInsightAction}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            course={currentCourse}
            students={courseStudents}
            onUpdateAttendance={handleUpdateAttendance}
            onMarkAllPresent={handleMarkAllPresent}
            onSelectStudent={(id) => setInspectedStudentId(id)}
          />
        )}

        {activeTab === 'gradebook' && (
          <GradebookView
            course={currentCourse}
            students={courseStudents}
            assignments={courseAssignments}
            onUpdateGrade={handleUpdateGrade}
            onAddAssignment={handleAddAssignment}
            onSelectStudent={(id) => setInspectedStudentId(id)}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'behavior' && (
          <BehaviorInsightsView
            course={currentCourse}
            students={courseStudents}
            insights={courseInsights}
            onAddInsight={handleAddInsight}
            onToggleInsightAction={handleToggleInsightAction}
            onToggleGuardianNotified={handleToggleGuardianNotified}
            onSelectStudent={(id) => setInspectedStudentId(id)}
          />
        )}

        {activeTab === 'students' && (
          <PupilDirectoryView
            course={currentCourse}
            students={courseStudents}
            assignments={courseAssignments}
            onSelectStudent={(id) => setInspectedStudentId(id)}
            onAddStudent={handleAddStudent}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <div>
            Academic Momentum · Faculty Classroom & Pupil Progress Workspace · Fall Semester 2026
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="hover:text-[#0F172A]"
            >
              Roster Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gradebook')}
              className="hover:text-[#0F172A]"
            >
              Rubric Weights
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="hover:text-[#0F172A]"
            >
              Download Term CSV
            </button>
          </div>
        </div>
      </footer>

      {/* 360° Pupil Profile Inspector Slide-Over Drawer */}
      {inspectedStudent && (
        <PupilInspectorModal
          student={inspectedStudent}
          course={
            COURSES.find((c) => c.id === inspectedStudent.courseId) ||
            currentCourse
          }
          assignments={assignments.filter(
            (a) => a.courseId === inspectedStudent.courseId
          )}
          insights={insights}
          onClose={() => setInspectedStudentId(null)}
          onUpdateMilestone={handleUpdateMilestone}
          onUpdateGrade={handleUpdateGrade}
          onUpdateAttendance={(studentId, date, status) =>
            handleUpdateAttendance(studentId, date, status)
          }
          onAddInsight={handleAddInsight}
        />
      )}

      {/* Quick Observation Modal (from Top Bar CTA) */}
      {quickInsightModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickInsightModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-modal max-w-lg w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Log Real-Time Behavioral Observation
                </h3>
                <p className="text-xs text-[#64748B]">
                  {currentCourse.name} · {currentCourse.period}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickInsightModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickInsightSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Pupil
                </label>
                <select
                  value={quickInsightStudentId}
                  onChange={(e) => setQuickInsightStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                >
                  {courseStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.seat} · Momentum {s.momentumScore})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Behavioral Dimension
                  </label>
                  <select
                    value={quickInsightCategory}
                    onChange={(e) =>
                      setQuickInsightCategory(e.target.value as BehaviorCategory)
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="Conceptual Breakthrough">Conceptual Breakthrough</option>
                    <option value="Collaborative Leadership">Collaborative Leadership</option>
                    <option value="Peer Mentorship">Peer Mentorship</option>
                    <option value="Deep Focus">Deep Focus</option>
                    <option value="Deadline Check-in">Deadline Check-in</option>
                    <option value="Attention & Pacing">Attention & Pacing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Momentum Impact
                  </label>
                  <select
                    value={quickInsightDelta}
                    onChange={(e) => setQuickInsightDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value={8}>+8 pts (Breakthrough)</option>
                    <option value={6}>+6 pts (Leadership)</option>
                    <option value={4}>+4 pts (Consistent Focus)</option>
                    <option value={-4}>-4 pts (Deadline Check-in)</option>
                    <option value={-6}>-6 pts (Pacing Support)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Observation Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={quickInsightObs}
                  onChange={(e) => setQuickInsightObs(e.target.value)}
                  placeholder="Describe the conceptual breakthrough, peer collaboration, or check-in context..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Follow-up Action Item (Optional)
                </label>
                <input
                  type="text"
                  value={quickInsightAction}
                  onChange={(e) => setQuickInsightAction(e.target.value)}
                  placeholder="e.g., Share proof exemplar or schedule 10m office hours review"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickInsightModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
