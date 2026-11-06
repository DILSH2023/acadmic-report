import React, { useState } from 'react';
import {
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Sparkles,
  BookOpen,
  UserCheck,
  XCircle,
} from 'lucide-react';
import {
  Assignment,
  AssignmentCategory,
  AttendanceStatus,
  BehavioralInsight,
  CourseSection,
  Student,
} from '../types/classroom';
import {
  calculateAttendanceMetrics,
  calculateStudentCourseGrade,
} from '../data/classroomData';
import { MomentumRing } from './MomentumRing';
import { PupilAvatar } from './PupilAvatar';

interface OverviewViewProps {
  course: CourseSection;
  students: Student[];
  assignments: Assignment[];
  insights: BehavioralInsight[];
  onSelectStudent: (studentId: string) => void;
  onQuickToggleTodayAttendance: (studentId: string, nextStatus: AttendanceStatus) => void;
  onNavigateTab: (tab: 'overview' | 'attendance' | 'gradebook' | 'behavior' | 'students') => void;
  onOpenNewInsightModal: (defaultStudentId?: string) => void;
  onToggleInsightAction: (insightId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  course,
  students,
  assignments,
  insights,
  onSelectStudent,
  onQuickToggleTodayAttendance,
  onNavigateTab,
  onOpenNewInsightModal,
  onToggleInsightAction,
}) => {
  const [rosterFilter, setRosterFilter] = useState<'all' | 'thriving' | 'attention' | 'missing'>('all');
  const [sortBy, setSortBy] = useState<'grade' | 'momentum' | 'attendance' | 'name'>('momentum');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrich students with computed grade & attendance metrics
  const enrichedStudents = students.map((student) => {
    const gradeInfo = calculateStudentCourseGrade(student, assignments, course.categoryWeights);
    const attInfo = calculateAttendanceMetrics(student);
    return {
      student,
      gradeInfo,
      attInfo,
    };
  });

  // Class-level aggregates
  const classAvgGrade =
    enrichedStudents.length > 0
      ? Math.round(
          (enrichedStudents.reduce((acc, s) => acc + s.gradeInfo.percentage, 0) /
            enrichedStudents.length) *
            10
        ) / 10
      : 0;

  const classAttendanceRate =
    enrichedStudents.length > 0
      ? Math.round(
          (enrichedStudents.reduce((acc, s) => acc + s.attInfo.attendanceRate, 0) /
            enrichedStudents.length) *
            10
        ) / 10
      : 0;

  const totalAssignmentsCount = assignments.length * Math.max(1, students.length);
  const totalSubmittedCount = enrichedStudents.reduce(
    (acc, s) => acc + s.gradeInfo.completedCount,
    0
  );
  const completionRate =
    totalAssignmentsCount > 0
      ? Math.round((totalSubmittedCount / totalAssignmentsCount) * 100)
      : 100;

  const todayPresentCount = enrichedStudents.filter(
    (s) => s.attInfo.todayStatus === 'present'
  ).length;
  const todayLateCount = enrichedStudents.filter(
    (s) => s.attInfo.todayStatus === 'late'
  ).length;
  const studentsNeedingCheckIn = enrichedStudents.filter(
    (s) => s.student.momentumScore < 75 || s.gradeInfo.missingCount > 0
  ).length;

  // Filter & sort students
  const filteredStudents = enrichedStudents
    .filter(({ student, gradeInfo, attInfo }) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        fullName.includes(searchQuery.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.currentMilestone.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (rosterFilter === 'thriving') return student.momentumScore >= 88 && gradeInfo.missingCount === 0;
      if (rosterFilter === 'attention') return student.momentumScore < 78 || attInfo.attendanceRate < 90;
      if (rosterFilter === 'missing') return gradeInfo.missingCount > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'grade') return b.gradeInfo.percentage - a.gradeInfo.percentage;
      if (sortBy === 'momentum') return b.student.momentumScore - a.student.momentumScore;
      if (sortBy === 'attendance') return b.attInfo.attendanceRate - a.attInfo.attendanceRate;
      return a.student.lastName.localeCompare(b.student.lastName);
    });

  const cycleAttendanceStatus = (current: string): AttendanceStatus => {
    const order: AttendanceStatus[] = ['present', 'late', 'excused', 'absent'];
    const idx = order.indexOf(current as AttendanceStatus);
    return order[(idx + 1) % order.length];
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Performance Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Class Weighted Average */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="text-xs font-semibold text-[#64748B]">
              Class Weighted Mean
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0F172A] tabular-nums">
                {classAvgGrade.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-[#047857] tabular-nums">
                +2.4% vs Unit 4
              </span>
            </div>
            <p className="text-xs text-[#64748B] truncate">
              {(Object.entries(course.categoryWeights) as [AssignmentCategory, number][])
                .map(([cat, w]) => `${cat.split(' ')[0]} ${w}%`)
                .join(' · ')}
            </p>
            <button
              onClick={() => onNavigateTab('gradebook')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#3525CD] transition-colors pt-1"
            >
              Open Weighted Gradebook
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MomentumRing
            value={classAvgGrade}
            variant="indigo"
            size={80}
            strokeWidth={6}
            centerLabel={`${Math.round(classAvgGrade)}%`}
            subLabel="GPA 3.7"
          />
        </div>

        {/* Card 2: Attendance & Punctuality */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="text-xs font-semibold text-[#64748B]">
              10-Day Attendance Momentum
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0F172A] tabular-nums">
                {classAttendanceRate.toFixed(1)}%
              </span>
              <span className="text-xs text-[#64748B] tabular-nums">
                Today: {todayPresentCount}/{students.length} on time
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {todayLateCount > 0
                ? `${todayLateCount} late arrival logged today · Nov 06`
                : 'Zero tardies recorded today · Nov 06'}
            </p>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#006C49] hover:text-[#047857] transition-colors pt-1"
            >
              Update Roll Call Log
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MomentumRing
            value={classAttendanceRate}
            variant="emerald"
            size={80}
            strokeWidth={6}
            centerLabel={`${Math.round(classAttendanceRate)}%`}
            subLabel="On-Time"
          />
        </div>

        {/* Card 3: Coursework & Milestone Velocity */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="text-xs font-semibold text-[#64748B]">
              Coursework & Interventions
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#0F172A] tabular-nums">
                {totalSubmittedCount}/{totalAssignmentsCount}
              </span>
              <span className="text-xs text-[#B45309] font-semibold tabular-nums">
                {studentsNeedingCheckIn} check-ins due
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {assignments.filter((a) => a.urgency === 'due-soon').length} deadline within 48h · Term {course.termProgress}% elapsed
            </p>
            <button
              onClick={() => onOpenNewInsightModal()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] hover:text-[#92400E] transition-colors pt-1"
            >
              Record Pupil Check-in
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MomentumRing
            value={completionRate}
            variant={studentsNeedingCheckIn > 1 ? 'amber' : 'emerald'}
            size={80}
            strokeWidth={6}
            centerLabel={`${completionRate}%`}
            subLabel="Submitted"
          />
        </div>
      </div>

      {/* Main Split Grid: 8 Cols Pupil Matrix | 4 Cols Coursework & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Pupil Performance & Momentum Matrix */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Pupil Performance & Momentum Roster
                </h2>
                <p className="text-xs text-[#64748B]">
                  Click any pupil to inspect 360° academic progress, or click today’s attendance status to update live.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="overview-sort" className="text-xs font-medium text-[#64748B] whitespace-nowrap">
                  Sort:
                </label>
                <select
                  id="overview-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4F46E5]"
                >
                  <option value="momentum">Momentum Score</option>
                  <option value="grade">Weighted Grade</option>
                  <option value="attendance">Attendance Rate</option>
                  <option value="name">Last Name (A–Z)</option>
                </select>
              </div>
            </div>

            {/* Filter controls & search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setRosterFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    rosterFilter === 'all'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  All Pupils ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRosterFilter('thriving')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    rosterFilter === 'thriving'
                      ? 'bg-white text-[#047857] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Steady Momentum
                </button>
                <button
                  type="button"
                  onClick={() => setRosterFilter('attention')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    rosterFilter === 'attention'
                      ? 'bg-white text-[#B45309] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Needs Check-in ({studentsNeedingCheckIn})
                </button>
                <button
                  type="button"
                  onClick={() => setRosterFilter('missing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    rosterFilter === 'missing'
                      ? 'bg-white text-[#BA1A1A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Missing Work
                </button>
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by pupil or milestone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                />
              </div>
            </div>
          </div>

          {/* High-Density Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-3 pl-5 pr-3">Pupil & Seat</th>
                  <th className="py-3 px-3">Active Learning Milestone</th>
                  <th className="py-3 px-3">Nov 06 Roll</th>
                  <th className="py-3 px-3 text-right">Course Avg</th>
                  <th className="py-3 px-3 text-right">Momentum</th>
                  <th className="py-3 pl-3 pr-5 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-[#64748B]">
                      No pupils match the current filter.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setRosterFilter('all');
                          setSearchQuery('');
                        }}
                        className="font-semibold text-[#4F46E5] underline ml-1"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(({ student, gradeInfo, attInfo }) => {
                    const todayStatus = attInfo.todayStatus as AttendanceStatus;
                    return (
                      <tr
                        key={student.id}
                        onClick={() => onSelectStudent(student.id)}
                        className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                      >
                        {/* Pupil Name + Metadata */}
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex items-center gap-3">
                            <PupilAvatar
                              seed={student.avatarSeed}
                              firstName={student.firstName}
                              lastName={student.lastName}
                              size="md"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors truncate">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-[#64748B] flex items-center gap-1.5 truncate">
                                <span>{student.seat}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono text-[11px] tabular-nums">
                                  {student.streakDays}d streak
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Active Milestone + Progress Track */}
                        <td className="py-3.5 px-3 max-w-[220px]">
                          <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <span className="text-[#0F172A] font-medium truncate">
                              {student.currentMilestone}
                            </span>
                            <span className="text-[#64748B] font-mono text-[11px] tabular-nums shrink-0">
                              {student.milestoneProgress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${student.milestoneProgress}%`,
                                backgroundColor:
                                  student.milestoneProgress >= 80
                                    ? '#10B981'
                                    : student.milestoneProgress >= 60
                                    ? '#4F46E5'
                                    : '#F59E0B',
                              }}
                            />
                          </div>
                        </td>

                        {/* Interactive Today Attendance Toggle */}
                        <td
                          className="py-3.5 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickToggleTodayAttendance(
                              student.id,
                              cycleAttendanceStatus(todayStatus)
                            );
                          }}
                        >
                          <button
                            type="button"
                            title="Click to cycle today's attendance status"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-transform active:scale-95 whitespace-nowrap shrink-0 ${
                              todayStatus === 'present'
                                ? 'bg-[#ECFDF5] text-[#047857]'
                                : todayStatus === 'late'
                                ? 'bg-[#FFFBEB] text-[#B45309]'
                                : todayStatus === 'excused'
                                ? 'bg-[#EEF2FF] text-[#4338CA]'
                                : 'bg-[#FFDAD6] text-[#93000A]'
                            }`}
                          >
                            {todayStatus === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {todayStatus === 'late' && <Clock className="w-3.5 h-3.5" />}
                            {todayStatus === 'excused' && <Calendar className="w-3.5 h-3.5" />}
                            {todayStatus === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                            <span className="capitalize">{todayStatus}</span>
                          </button>
                        </td>

                        {/* Weighted Grade */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                            {gradeInfo.percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-[#64748B] tabular-nums">
                            Grade {gradeInfo.letter}
                            {gradeInfo.missingCount > 0 && (
                              <span className="text-[#BA1A1A] font-semibold">
                                {' '}
                                · {gradeInfo.missingCount} missing
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Momentum Index */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span
                              className={`font-mono text-sm font-bold tabular-nums ${
                                student.momentumScore >= 85
                                  ? 'text-[#047857]'
                                  : student.momentumScore >= 75
                                  ? 'text-[#4F46E5]'
                                  : 'text-[#B45309]'
                              }`}
                            >
                              {student.momentumScore}
                            </span>
                            <span
                              className={`text-[11px] font-mono tabular-nums ${
                                student.momentumDeltaWeek >= 0
                                  ? 'text-[#047857]'
                                  : 'text-[#BA1A1A]'
                              }`}
                            >
                              {student.momentumDeltaWeek >= 0
                                ? `+${student.momentumDeltaWeek} wk`
                                : `${student.momentumDeltaWeek} wk`}
                            </span>
                          </div>
                        </td>

                        {/* Inspect Action */}
                        <td className="py-3.5 pl-3 pr-5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(student.id);
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
                          >
                            360° View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Columns: Active Coursework & Real-Time Behavioral Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Coursework & Deadlines Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Coursework & Deadlines
                </h3>
                <p className="text-xs text-[#64748B]">
                  Submission velocity across {students.length} enrolled pupils
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('gradebook')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline whitespace-nowrap shrink-0"
              >
                Grade All
              </button>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {assignments.slice(0, 4).map((asg) => {
                const submittedCount = students.filter(
                  (s) =>
                    s.grades[asg.id]?.status === 'submitted' ||
                    s.grades[asg.id]?.status === 'late'
                ).length;
                const pct =
                  students.length > 0
                    ? Math.round((submittedCount / students.length) * 100)
                    : 0;

                return (
                  <div key={asg.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-[#4F46E5]">
                            {asg.shortCode}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{asg.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">Due {asg.dueDate.slice(5)}</span>
                        </div>
                        <div className="text-sm font-semibold text-[#0F172A] truncate mt-0.5">
                          {asg.title}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                          asg.urgency === 'completed'
                            ? 'text-[#047857]'
                            : asg.urgency === 'due-soon'
                            ? 'text-[#B45309]'
                            : 'text-[#4338CA]'
                        }`}
                      >
                        {asg.urgency === 'completed'
                          ? 'Graded'
                          : asg.urgency === 'due-soon'
                          ? 'Due < 48h'
                          : 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              asg.urgency === 'due-soon' && pct < 90
                                ? '#F59E0B'
                                : '#10B981',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#64748B] tabular-nums shrink-0">
                        {submittedCount}/{students.length} ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Behavioral Insights Stream */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Behavioral Momentum Log
                </h3>
                <p className="text-xs text-[#64748B]">
                  Real-time classroom observations & follow-ups
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenNewInsightModal()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-transform active:scale-98 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Note
              </button>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {insights.slice(0, 4).map((item) => {
                const pupil = students.find((s) => s.id === item.studentId);
                return (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => pupil && onSelectStudent(pupil.id)}
                        className="text-xs font-bold text-[#0F172A] hover:text-[#4F46E5] transition-colors flex items-center gap-1.5 truncate"
                      >
                        <span>
                          {pupil ? `${pupil.firstName} ${pupil.lastName}` : 'Pupil'}
                        </span>
                        <span className="text-[#64748B] font-normal">·</span>
                        <span
                          className={`font-semibold ${
                            item.tone === 'warning'
                              ? 'text-[#B45309]'
                              : item.tone === 'milestone'
                              ? 'text-[#4F46E5]'
                              : 'text-[#047857]'
                          }`}
                        >
                          {item.category}
                        </span>
                      </button>
                      <span
                        className={`font-mono text-xs font-bold tabular-nums shrink-0 ${
                          item.momentumDelta >= 0 ? 'text-[#047857]' : 'text-[#B45309]'
                        }`}
                      >
                        {item.momentumDelta >= 0
                          ? `+${item.momentumDelta} pts`
                          : `${item.momentumDelta} pts`}
                      </span>
                    </div>

                    <p className="text-xs text-[#464555] leading-relaxed">
                      {item.observation}
                    </p>

                    {item.actionItem && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onToggleInsightAction(item.id)}
                          className="flex items-start gap-2 text-left group w-full"
                        >
                          <span
                            className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                              item.actionCompleted
                                ? 'bg-[#10B981] border-[#10B981] text-white'
                                : 'border-[#94A3B8] bg-white group-hover:border-[#4F46E5]'
                            }`}
                          >
                            {item.actionCompleted && <Check className="w-3 h-3" />}
                          </span>
                          <span
                            className={`text-xs ${
                              item.actionCompleted
                                ? 'line-through text-[#64748B]'
                                : 'text-[#0F172A] font-medium'
                            }`}
                          >
                            {item.actionItem}
                          </span>
                        </button>
                      </div>
                    )}

                    <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                      <span>{item.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.guardianNotified ? 'Guardian copied' : 'Internal log'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('behavior')}
              className="w-full py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
            >
              View All Behavioral Insights ({insights.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
