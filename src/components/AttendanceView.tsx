import React, { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  FileText,
} from 'lucide-react';
import {
  AttendanceStatus,
  CourseSection,
  Student,
} from '../types/classroom';
import {
  calculateAttendanceMetrics,
  SCHOOL_DATES,
} from '../data/classroomData';
import { PupilAvatar } from './PupilAvatar';

interface AttendanceViewProps {
  course: CourseSection;
  students: Student[];
  onUpdateAttendance: (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    arrivalTime?: string,
    note?: string
  ) => void;
  onMarkAllPresent: (date: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  course,
  students,
  onUpdateAttendance,
  onMarkAllPresent,
  onSelectStudent,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const selectedDateObj =
    SCHOOL_DATES.find((d) => d.date === selectedDate) || SCHOOL_DATES[SCHOOL_DATES.length - 1];

  // Counts for selected date
  let presentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;
  let absentCount = 0;

  for (const s of students) {
    const rec = s.attendance.find((a) => a.date === selectedDate);
    const st = rec?.status || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'late') lateCount++;
    else if (st === 'excused') excusedCount++;
    else if (st === 'absent') absentCount++;
  }

  const filteredStudents = students.filter((s) => {
    if (statusFilter === 'all') return true;
    const rec = s.attendance.find((a) => a.date === selectedDate);
    return (rec?.status || 'present') === statusFilter;
  });

  const handleBulkPresent = () => {
    onMarkAllPresent(selectedDate);
    setSavedBanner(`All ${students.length} pupils marked Present for ${selectedDateObj.label}.`);
    setTimeout(() => setSavedBanner(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Attendance Roll Call & Longitudinal Logs
            </h2>
            <p className="text-xs text-[#64748B]">
              {course.name} · {course.period} · {course.schedule} · Select any session date below to audit or edit roll call.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {savedBanner && (
              <span className="text-xs font-semibold text-[#047857] bg-[#ECFDF5] px-3 py-1.5 rounded-lg">
                {savedBanner}
              </span>
            )}
            <button
              type="button"
              onClick={handleBulkPresent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Mark All Present ({selectedDateObj.label})
            </button>
          </div>
        </div>

        {/* 10-Day Session Selector Strip */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
          {SCHOOL_DATES.map((d) => {
            const isSelected = d.date === selectedDate;
            const dayAlerts = students.filter((s) => {
              const st = s.attendance.find((a) => a.date === d.date)?.status;
              return st === 'absent' || st === 'late';
            }).length;

            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
              >
                <div
                  className={`text-[10px] font-bold ${
                    isSelected ? 'text-[#E0E7FF]' : 'text-[#64748B]'
                  }`}
                >
                  {d.dayShort}
                </div>
                <div className="text-xs font-bold tabular-nums mt-0.5">{d.label}</div>
                <div
                  className={`text-[10px] mt-1 font-mono tabular-nums ${
                    isSelected
                      ? 'text-white'
                      : dayAlerts > 0
                      ? 'text-[#B45309] font-semibold'
                      : 'text-[#047857]'
                  }`}
                >
                  {dayAlerts > 0 ? `${dayAlerts} flag` : '100%'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Summary & Filter Controls for Selected Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('present')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'present'
                  ? 'bg-white text-[#047857] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('late')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'late'
                  ? 'bg-white text-[#B45309] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Late / Tardy ({lateCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('excused')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'excused'
                  ? 'bg-white text-[#4338CA] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Excused ({excusedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('absent')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'absent'
                  ? 'bg-white text-[#BA1A1A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Absent ({absentCount})
            </button>
          </div>

          <div className="text-xs text-[#64748B] flex items-center gap-3">
            <span>
              Viewing Session: <strong className="text-[#0F172A]">{selectedDateObj.dayShort}, {selectedDateObj.label}, 2026</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Roll Call & 10-Day Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                <th className="py-3 pl-5 pr-3">Pupil & Seat</th>
                <th className="py-3 px-3">Status on {selectedDateObj.label}</th>
                <th className="py-3 px-3">Arrival Time</th>
                <th className="py-3 px-3">Session Note / Excuse</th>
                <th className="py-3 px-3">10-Day History Strip</th>
                <th className="py-3 pl-3 pr-5 text-right">Rate & Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {filteredStudents.map((student) => {
                const rec = student.attendance.find((a) => a.date === selectedDate) || {
                  date: selectedDate,
                  label: selectedDateObj.label,
                  status: 'present' as AttendanceStatus,
                  arrivalTime: '08:42',
                  note: '',
                };
                const metrics = calculateAttendanceMetrics(student);

                return (
                  <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Student Info */}
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <PupilAvatar
                          seed={student.avatarSeed}
                          firstName={student.firstName}
                          lastName={student.lastName}
                          size="md"
                        />
                        <div>
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student.id)}
                            className="font-semibold text-[#0F172A] hover:text-[#4F46E5] transition-colors text-left"
                          >
                            {student.firstName} {student.lastName}
                          </button>
                          <div className="text-xs text-[#64748B]">
                            {student.seat} · {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 4-Button Segmented Status Selector */}
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                        {(
                          [
                            { id: 'present', label: 'Present', activeClass: 'bg-[#10B981] text-white' },
                            { id: 'late', label: 'Late', activeClass: 'bg-[#F59E0B] text-white' },
                            { id: 'excused', label: 'Excused', activeClass: 'bg-[#4F46E5] text-white' },
                            { id: 'absent', label: 'Absent', activeClass: 'bg-[#BA1A1A] text-white' },
                          ] as const
                        ).map((opt) => {
                          const active = rec.status === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                onUpdateAttendance(
                                  student.id,
                                  selectedDate,
                                  opt.id,
                                  opt.id === 'present'
                                    ? rec.arrivalTime || '08:42'
                                    : opt.id === 'late'
                                    ? rec.arrivalTime || '08:53'
                                    : undefined,
                                  rec.note
                                )
                              }
                              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                                active
                                  ? `${opt.activeClass} shadow-xs`
                                  : 'text-[#64748B] hover:text-[#0F172A]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Arrival Time Input */}
                    <td className="py-3.5 px-3">
                      {rec.status === 'present' || rec.status === 'late' ? (
                        <input
                          type="text"
                          value={rec.arrivalTime || '08:42'}
                          onChange={(e) =>
                            onUpdateAttendance(
                              student.id,
                              selectedDate,
                              rec.status,
                              e.target.value,
                              rec.note
                            )
                          }
                          aria-label={`Arrival time for ${student.firstName}`}
                          className="w-20 px-2.5 py-1 text-xs font-mono tabular-nums bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                        />
                      ) : (
                        <span className="text-xs text-[#64748B] font-mono">—</span>
                      )}
                    </td>

                    {/* Note / Excuse Input */}
                    <td className="py-3.5 px-3 min-w-[200px]">
                      <input
                        type="text"
                        value={rec.note || ''}
                        onChange={(e) =>
                          onUpdateAttendance(
                            student.id,
                            selectedDate,
                            rec.status,
                            rec.arrivalTime,
                            e.target.value
                          )
                        }
                        placeholder="Add tardy or absence note..."
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
                      />
                    </td>

                    {/* 10-Day Interactive History Strip */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        {SCHOOL_DATES.map((d) => {
                          const dayRec = student.attendance.find((a) => a.date === d.date);
                          const st = dayRec?.status || 'present';
                          const glyph =
                            st === 'present'
                              ? 'P'
                              : st === 'late'
                              ? 'L'
                              : st === 'excused'
                              ? 'E'
                              : 'A';
                          const cellStyle =
                            st === 'present'
                              ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                              : st === 'late'
                              ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                              : st === 'excused'
                              ? 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]'
                              : 'bg-[#FFDAD6] text-[#93000A] border-[#FECACA]';

                          return (
                            <button
                              key={d.date}
                              type="button"
                              onClick={() => setSelectedDate(d.date)}
                              title={`${d.label}: ${st.toUpperCase()}${dayRec?.note ? ` (${dayRec.note})` : ''}`}
                              className={`w-6 h-6 rounded text-[10px] font-mono font-bold border flex items-center justify-center transition-transform hover:scale-105 ${cellStyle} ${
                                d.date === selectedDate ? 'ring-2 ring-[#4F46E5]' : ''
                              }`}
                            >
                              {glyph}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Attendance Rate & Streak */}
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                        {metrics.attendanceRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-[#64748B] font-mono tabular-nums">
                        {student.streakDays}d streak · {metrics.lateCount}L / {metrics.absentCount}A
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
