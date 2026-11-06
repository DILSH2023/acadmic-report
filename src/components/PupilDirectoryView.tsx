import React, { useState } from 'react';
import {
  Plus,
  Search,
  Mail,
  Phone,
  ArrowUpRight,
  X,
} from 'lucide-react';
import {
  Assignment,
  CourseSection,
  Student,
} from '../types/classroom';
import {
  calculateAttendanceMetrics,
  calculateStudentCourseGrade,
} from '../data/classroomData';
import { MomentumRing } from './MomentumRing';
import { PupilAvatar } from './PupilAvatar';

interface PupilDirectoryViewProps {
  course: CourseSection;
  students: Student[];
  assignments: Assignment[];
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (newPupil: {
    firstName: string;
    lastName: string;
    email: string;
    seat: string;
    currentMilestone: string;
    guardianName: string;
    guardianRelation: string;
    guardianEmail: string;
    guardianPhone: string;
  }) => void;
}

export const PupilDirectoryView: React.FC<PupilDirectoryViewProps> = ({
  course,
  students,
  assignments,
  onSelectStudent,
  onAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [seat, setSeat] = useState('Row E · Desk 01');
  const [milestone, setMilestone] = useState('Series Convergence Diagnostic');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Mother');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('(415) 555-0192');

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.studentCode.toLowerCase().includes(q) ||
      s.guardianName.toLowerCase().includes(q) ||
      s.seat.toLowerCase().includes(q)
    );
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onAddStudent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email:
        email.trim() ||
        `${firstName.trim().toLowerCase()[0]}.${lastName.trim().toLowerCase()}@northfield.edu`,
      seat: seat.trim() || 'Row E · Desk 01',
      currentMilestone: milestone.trim() || 'Initial Diagnostic Milestone',
      guardianName: guardianName.trim() || `Guardian of ${firstName.trim()}`,
      guardianRelation,
      guardianEmail: guardianEmail.trim() || 'guardian@northfield-family.org',
      guardianPhone: guardianPhone.trim() || '(415) 555-0192',
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setGuardianName('');
    setGuardianEmail('');
    setShowEnrollModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            Enrolled Pupils & Guardian Directory
          </h2>
          <p className="text-xs text-[#64748B]">
            {course.name} · {course.period} · {students.length} enrolled pupils · Click any card for 360° diagnostic profile
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pupil, seat, guardian..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-transform active:scale-98 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll Pupil
          </button>
        </div>
      </div>

      {/* Responsive Pupil Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((student) => {
          const gradeInfo = calculateStudentCourseGrade(
            student,
            assignments,
            course.categoryWeights
          );
          const attInfo = calculateAttendanceMetrics(student);

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient hover:shadow-ambient-hover transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <PupilAvatar
                    seed={student.avatarSeed}
                    firstName={student.firstName}
                    lastName={student.lastName}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#0F172A] truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="text-xs text-[#64748B] truncate">
                      {student.seat} · {student.studentCode}
                    </div>
                    <div className="text-xs text-[#4F46E5] font-medium mt-0.5 truncate">
                      {student.email}
                    </div>
                  </div>
                </div>

                <MomentumRing
                  value={gradeInfo.percentage}
                  variant={
                    gradeInfo.percentage >= 90
                      ? 'emerald'
                      : gradeInfo.percentage >= 80
                      ? 'indigo'
                      : 'amber'
                  }
                  size={64}
                  strokeWidth={6}
                  centerLabel={gradeInfo.letter}
                  subLabel={`${Math.round(gradeInfo.percentage)}%`}
                />
              </div>

              {/* Active Milestone Progress */}
              <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F172A] truncate">
                    Milestone: {student.currentMilestone}
                  </span>
                  <span className="font-mono text-[#64748B] tabular-nums shrink-0">
                    {student.milestoneProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${student.milestoneProgress}%`,
                      backgroundColor:
                        student.milestoneProgress >= 80 ? '#10B981' : '#4F46E5',
                    }}
                  />
                </div>
              </div>

              {/* Metrics & Guardian Row */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                <div className="font-mono tabular-nums text-[#0F172A]">
                  <span>Att: {attInfo.attendanceRate.toFixed(0)}%</span>
                  <span className="mx-1.5 text-[#CBD5E1]">·</span>
                  <span>Streak: {student.streakDays}d</span>
                  <span className="mx-1.5 text-[#CBD5E1]">·</span>
                  <span>Momentum: {student.momentumScore}</span>
                </div>
                <div className="flex items-center gap-1 text-[#4F46E5] font-semibold">
                  <span>Guardian: {student.guardianName}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enroll New Pupil Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-modal max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Enroll Pupil in {course.name}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {course.period} · {course.room}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g., Elena"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g., Rostova"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    School Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.rostova@northfield.edu"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Assigned Seat / Bench
                  </label>
                  <input
                    type="text"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Initial Academic Milestone Target
                </label>
                <input
                  type="text"
                  value={milestone}
                  onChange={(e) => setMilestone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Primary Guardian Name
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Dr. Viktor Rostov"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                >
                  Enroll Pupil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
