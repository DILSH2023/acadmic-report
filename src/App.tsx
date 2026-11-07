/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Printer,
  Download,
  LogOut,
  UserCheck,
  ShieldCheck,
  BookOpen,
  Calendar,
  Award,
  Target,
  FileText,
  Code2,
  RotateCcw,
  Check,
  LayoutDashboard,
  GraduationCap,
  Edit3,
  X,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import {
  AssignmentRecord,
  AssignmentSubmissionRecord,
  AttendanceEntry,
  ExamEntry,
  INITIAL_ASSIGNMENTS_DB,
  INITIAL_ATTENDANCE_DB,
  INITIAL_EXAMS_DB,
  INITIAL_GOALS_DB,
  INITIAL_STUDENTS_DB,
  INITIAL_SUBJECTS,
  INITIAL_SUBMISSIONS_DB,
  StudentRecord,
  StudyGoalRecord,
  SubjectRecord,
  computeStudentAnalytics,
} from './data/trackerStore';
import { MomentumRing } from './components/MomentumRing';
import { PupilAvatar } from './components/PupilAvatar';
import { FlaskSourceExplorer } from './components/FlaskSourceExplorer';

type NavView =
  | 'home'
  | 'auth'
  | 'dashboard'
  | 'attendance'
  | 'performance'
  | 'assignments'
  | 'goals'
  | 'reports'
  | 'admin'
  | 'flask-source';

const DB_STORAGE_KEY = 'student_progress_tracker_db_v1';

export default function App() {
  // Persistent SQLite-equivalent relational state in browser
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_students`);
      return raw ? JSON.parse(raw) : INITIAL_STUDENTS_DB;
    } catch {
      return INITIAL_STUDENTS_DB;
    }
  });

  const [subjects, setSubjects] = useState<SubjectRecord[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_subjects`);
      return raw ? JSON.parse(raw) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceEntry[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_attendance`);
      return raw ? JSON.parse(raw) : INITIAL_ATTENDANCE_DB;
    } catch {
      return INITIAL_ATTENDANCE_DB;
    }
  });

  const [exams, setExams] = useState<ExamEntry[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_exams`);
      return raw ? JSON.parse(raw) : INITIAL_EXAMS_DB;
    } catch {
      return INITIAL_EXAMS_DB;
    }
  });

  const [assignments, setAssignments] = useState<AssignmentRecord[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_assignments`);
      return raw ? JSON.parse(raw) : INITIAL_ASSIGNMENTS_DB;
    } catch {
      return INITIAL_ASSIGNMENTS_DB;
    }
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmissionRecord[]>(
    () => {
      try {
        const raw = localStorage.getItem(`${DB_STORAGE_KEY}_submissions`);
        return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS_DB;
      } catch {
        return INITIAL_SUBMISSIONS_DB;
      }
    }
  );

  const [goals, setGoals] = useState<StudyGoalRecord[]>(() => {
    try {
      const raw = localStorage.getItem(`${DB_STORAGE_KEY}_goals`);
      return raw ? JSON.parse(raw) : INITIAL_GOALS_DB;
    } catch {
      return INITIAL_GOALS_DB;
    }
  });

  // Strict Session & Navigation State (Never logged in without explicit Sign In)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<'student' | 'admin'>('student');
  const [currentStudentId, setCurrentStudentId] = useState<number>(1);
  const [activeView, setActiveView] = useState<NavView>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${DB_STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${DB_STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${DB_STORAGE_KEY}_exams`, JSON.stringify(exams));
      localStorage.setItem(`${DB_STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${DB_STORAGE_KEY}_submissions`, JSON.stringify(submissions));
      localStorage.setItem(`${DB_STORAGE_KEY}_goals`, JSON.stringify(goals));
    } catch {
      // ignore storage errors
    }
  }, [students, subjects, attendance, exams, assignments, submissions, goals]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const activeStudent =
    students.find((s) => s.id === currentStudentId) || students[0];

  const analytics = computeStudentAnalytics(
    activeStudent,
    subjects,
    attendance,
    exams,
    assignments,
    submissions,
    goals
  );

  // --- Form States ---
  // 1. Auth Login & Register
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [regRollNo, setRegRollNo] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regSem, setRegSem] = useState(5);
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // 2. Academic Performance (Add Exam)
  const [examSubjectId, setExamSubjectId] = useState<number>(1);
  const [examType, setExamType] = useState('Midterm Exam');
  const [examMarks, setExamMarks] = useState('88');
  const [examMaxMarks, setExamMaxMarks] = useState('100');
  const [examRemarks, setExamRemarks] = useState('');

  // 3. Assignment Filter
  const [asgFilter, setAsgFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  // 4. Study Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<'Daily' | 'Weekly'>('Weekly');
  const [goalHours, setGoalHours] = useState('5');
  const [goalDate, setGoalDate] = useState('2026-11-16');

  // 5. Admin Panel Forms (Add / Edit Student, Subject, Attendance, Exam, Assignment)
  const [adminStuRoll, setAdminStuRoll] = useState('');
  const [adminStuName, setAdminStuName] = useState('');
  const [adminStuEmail, setAdminStuEmail] = useState('');
  const [adminStuPhone, setAdminStuPhone] = useState('');
  const [adminStuDept, setAdminStuDept] = useState('Computer Science & Engineering');
  const [adminStuSem, setAdminStuSem] = useState(5);

  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);

  const [adminSubCode, setAdminSubCode] = useState('');
  const [adminSubName, setAdminSubName] = useState('');
  const [adminSubCredits, setAdminSubCredits] = useState('4');
  const [adminSubInstructor, setAdminSubInstructor] = useState('');

  const [adminAttStudentId, setAdminAttStudentId] = useState<number>(1);
  const [adminAttSubjectId, setAdminAttSubjectId] = useState<number>(1);
  const [adminAttAttended, setAdminAttAttended] = useState('39');
  const [adminAttConducted, setAdminAttConducted] = useState('42');

  const [adminExamStudentId, setAdminExamStudentId] = useState<number>(1);
  const [adminExamSubjectId, setAdminExamSubjectId] = useState<number>(1);
  const [adminExamType, setAdminExamType] = useState('End Semester Exam');
  const [adminExamMarks, setAdminExamMarks] = useState('92');
  const [adminExamMax, setAdminExamMax] = useState('100');
  const [adminExamRemarks, setAdminExamRemarks] = useState('');

  const [adminAsgSubjectId, setAdminAsgSubjectId] = useState<number>(1);
  const [adminAsgTitle, setAdminAsgTitle] = useState('');
  const [adminAsgDesc, setAdminAsgDesc] = useState('');
  const [adminAsgDue, setAdminAsgDue] = useState('2026-11-25');

  // --- Handlers ---
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginPassword('');
    setActiveView('auth');
    setAuthMode('login');
    setAuthError(null);
    setAuthSuccess('You have been logged out safely. Please sign in to continue.');
  };

  const handleProtectedNavigation = (targetView: NavView) => {
    if (targetView === 'flask-source' || targetView === 'home') {
      setActiveView(targetView);
      return;
    }
    if (!isAuthenticated) {
      setActiveView('auth');
      setAuthMode('login');
      setAuthError('Access denied: Please sign in first to view the dashboard.');
      return;
    }
    if (targetView === 'admin' && currentUserRole !== 'admin') {
      notify('Administrator privileges required.');
      return;
    }
    setActiveView(targetView);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!loginIdentifier.trim() || !loginPassword) {
      setAuthError('Please enter both your Roll No / Username and Password.');
      return;
    }

    if (loginRole === 'admin') {
      if (
        (loginIdentifier.trim().toLowerCase() === 'admin' ||
          loginIdentifier.trim().toLowerCase() === 'admin@college.edu') &&
        loginPassword === 'admin123'
      ) {
        setIsAuthenticated(true);
        setCurrentUserRole('admin');
        setActiveView('admin');
        notify('Welcome back, Dr. Eleanor Vance (Administrator)!');
      } else {
        setAuthError('Invalid Admin credentials. Use username "admin" and password "admin123".');
      }
      return;
    }

    const found = students.find(
      (s) =>
        s.rollNo.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
        s.email.toLowerCase() === loginIdentifier.trim().toLowerCase()
    );
    if (found && found.passwordHash === loginPassword) {
      setIsAuthenticated(true);
      setCurrentUserRole('student');
      setCurrentStudentId(found.id);
      setActiveView('dashboard');
      notify(`Welcome back, ${found.fullName}!`);
    } else {
      setAuthError(
        'Invalid Student Roll Number/Email or Password. Please verify your credentials.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!regRollNo.trim() || !regFullName.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('All required fields must be filled.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (
      students.some(
        (s) =>
          s.rollNo.toLowerCase() === regRollNo.trim().toLowerCase() ||
          s.email.toLowerCase() === regEmail.trim().toLowerCase()
      )
    ) {
      setAuthError('A student with this Roll No or Email already exists.');
      return;
    }

    const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
    const newStu: StudentRecord = {
      id: newId,
      rollNo: regRollNo.trim().toUpperCase(),
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      passwordHash: regPassword,
      department: regDept,
      semester: regSem,
      phone: regPhone.trim() || '+91 98765 00000',
      createdAt: '2026-11-07',
    };

    setStudents((prev) => [...prev, newStu]);
    setAttendance((prev) => [
      ...prev,
      ...subjects.map((sub, idx) => ({
        id: prev.length + idx + 1,
        studentId: newId,
        subjectId: sub.id,
        classesAttended: 32,
        classesConducted: 38,
        lastUpdated: '2026-11-07',
      })),
    ]);
    setSubmissions((prev) => [
      ...prev,
      ...assignments.map((asg, idx) => ({
        id: prev.length + idx + 1,
        assignmentId: asg.id,
        studentId: newId,
        status: 'Pending' as const,
      })),
    ]);

    setRegRollNo('');
    setRegFullName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setAuthMode('login');
    setLoginRole('student');
    setLoginIdentifier(newStu.rollNo);
    setLoginPassword('');
    setAuthSuccess(
      `Registration successful for ${newStu.fullName} (${newStu.rollNo})! Please enter your password to Sign In.`
    );
  };

  const handleAdjustAttendance = (
    studentId: number,
    subjectId: number,
    deltaAttended: number,
    deltaConducted: number
  ) => {
    setAttendance((prev) => {
      const exists = prev.find(
        (a) => a.studentId === studentId && a.subjectId === subjectId
      );
      if (exists) {
        return prev.map((a) => {
          if (a.studentId !== studentId || a.subjectId !== subjectId) return a;
          const nextConducted = Math.max(0, a.classesConducted + deltaConducted);
          const nextAttended = Math.max(
            0,
            Math.min(nextConducted, a.classesAttended + deltaAttended)
          );
          return {
            ...a,
            classesAttended: nextAttended,
            classesConducted: nextConducted,
            lastUpdated: '2026-11-07',
          };
        });
      }
      return [
        ...prev,
        {
          id: Date.now(),
          studentId,
          subjectId,
          classesAttended: Math.max(0, deltaAttended),
          classesConducted: Math.max(1, deltaConducted),
          lastUpdated: '2026-11-07',
        },
      ];
    });
    notify('Subject attendance updated and percentage recalculated.');
  };

  const handleAddStudentExam = (e: React.FormEvent) => {
    e.preventDefault();
    const obtained = Number(examMarks);
    const max = Number(examMaxMarks) || 100;
    if (Number.isNaN(obtained) || obtained < 0 || obtained > max) return;

    const newEntry: ExamEntry = {
      id: Date.now(),
      studentId: activeStudent.id,
      subjectId: Number(examSubjectId),
      examType,
      marksObtained: obtained,
      maxMarks: max,
      examDate: '2026-11-07',
      remarks: examRemarks.trim() || 'Recorded via Academic Performance module',
    };
    setExams((prev) => [newEntry, ...prev]);
    setExamRemarks('');
    notify('Examination marks recorded and charts updated.');
  };

  const handleToggleAssignmentStatus = (assignmentId: number) => {
    setSubmissions((prev) => {
      const existing = prev.find(
        (s) => s.assignmentId === assignmentId && s.studentId === activeStudent.id
      );
      if (existing) {
        const nextStatus =
          existing.status === 'Completed' ? 'Pending' : 'Completed';
        return prev.map((s) =>
          s.id === existing.id
            ? {
                ...s,
                status: nextStatus,
                submittedDate: nextStatus === 'Completed' ? '2026-11-07' : undefined,
                marksAwarded: nextStatus === 'Completed' ? s.marksAwarded ?? 23 : undefined,
                submissionNote:
                  nextStatus === 'Completed'
                    ? 'Submitted via Student Portal'
                    : undefined,
              }
            : s
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          assignmentId,
          studentId: activeStudent.id,
          status: 'Completed',
          submittedDate: '2026-11-07',
          marksAwarded: 23,
          submissionNote: 'Submitted via Student Portal',
        },
      ];
    });
    notify('Assignment submission status updated.');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    const hrs = Math.max(0.5, Number(goalHours) || 4);
    const created: StudyGoalRecord = {
      id: Date.now(),
      studentId: activeStudent.id,
      title: goalTitle.trim(),
      goalType,
      targetHours: hrs,
      completedHours: 0,
      targetDate: goalDate,
      isCompleted: false,
    };
    setGoals((prev) => [created, ...prev]);
    setGoalTitle('');
    notify('Study goal created.');
  };

  const handleToggleGoal = (goalId: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              isCompleted: !g.isCompleted,
              completedHours: !g.isCompleted ? g.targetHours : 0,
            }
          : g
      )
    );
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    notify('Study goal removed.');
  };

  // Admin Handlers
  const handleAdminAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminStuRoll.trim() || !adminStuName.trim() || !adminStuEmail.trim()) return;
    const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
    const created: StudentRecord = {
      id: newId,
      rollNo: adminStuRoll.trim().toUpperCase(),
      fullName: adminStuName.trim(),
      email: adminStuEmail.trim().toLowerCase(),
      passwordHash: 'student123',
      department: adminStuDept,
      semester: adminStuSem,
      phone: adminStuPhone.trim() || '+91 98765 11111',
      createdAt: '2026-11-07',
    };
    setStudents((prev) => [...prev, created]);
    setAttendance((prev) => [
      ...prev,
      ...subjects.map((sub, idx) => ({
        id: Date.now() + idx,
        studentId: newId,
        subjectId: sub.id,
        classesAttended: 34,
        classesConducted: 40,
        lastUpdated: '2026-11-07',
      })),
    ]);
    setAdminStuRoll('');
    setAdminStuName('');
    setAdminStuEmail('');
    setAdminStuPhone('');
    notify(`Student ${created.fullName} added to database.`);
  };

  const handleAdminSaveEditedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
    );
    notify(`Updated student record for ${editingStudent.fullName}.`);
    setEditingStudent(null);
  };

  const handleAdminDeleteStudent = (studentId: number) => {
    if (students.length <= 1) {
      notify('Cannot delete the last remaining student.');
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentStudentId === studentId) {
      const remaining = students.find((s) => s.id !== studentId);
      if (remaining) setCurrentStudentId(remaining.id);
    }
    notify('Student record deleted.');
  };

  const handleAdminAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSubCode.trim() || !adminSubName.trim()) return;
    const newId = Math.max(0, ...subjects.map((s) => s.id)) + 1;
    const created: SubjectRecord = {
      id: newId,
      subjectCode: adminSubCode.trim().toUpperCase(),
      subjectName: adminSubName.trim(),
      credits: Number(adminSubCredits) || 4,
      semester: 5,
      instructor: adminSubInstructor.trim() || 'Prof. Faculty Member',
    };
    setSubjects((prev) => [...prev, created]);
    setAdminSubCode('');
    setAdminSubName('');
    setAdminSubInstructor('');
    notify(`Subject ${created.subjectCode} added.`);
  };

  const handleAdminDeleteSubject = (subjectId: number) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    notify('Subject removed from curriculum.');
  };

  const handleAdminUpdateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const att = Math.max(0, Number(adminAttAttended) || 0);
    const cond = Math.max(att, Number(adminAttConducted) || 0);
    setAttendance((prev) => {
      const exists = prev.some(
        (a) =>
          a.studentId === Number(adminAttStudentId) &&
          a.subjectId === Number(adminAttSubjectId)
      );
      if (exists) {
        return prev.map((a) =>
          a.studentId === Number(adminAttStudentId) &&
          a.subjectId === Number(adminAttSubjectId)
            ? {
                ...a,
                classesAttended: att,
                classesConducted: cond,
                lastUpdated: '2026-11-07',
              }
            : a
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          studentId: Number(adminAttStudentId),
          subjectId: Number(adminAttSubjectId),
          classesAttended: att,
          classesConducted: cond,
          lastUpdated: '2026-11-07',
        },
      ];
    });
    notify('Attendance record updated by Admin.');
  };

  const handleAdminAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const marks = Number(adminExamMarks) || 0;
    const max = Number(adminExamMax) || 100;
    setExams((prev) => [
      {
        id: Date.now(),
        studentId: Number(adminExamStudentId),
        subjectId: Number(adminExamSubjectId),
        examType: adminExamType,
        marksObtained: marks,
        maxMarks: max,
        examDate: '2026-11-07',
        remarks: adminExamRemarks.trim() || 'Entered via Faculty Admin Console',
      },
      ...prev,
    ]);
    setAdminExamRemarks('');
    notify('Examination marks recorded by Admin.');
  };

  const handleAdminPublishAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAsgTitle.trim()) return;
    const newId = Math.max(0, ...assignments.map((a) => a.id)) + 1;
    const created: AssignmentRecord = {
      id: newId,
      subjectId: Number(adminAsgSubjectId),
      title: adminAsgTitle.trim(),
      description:
        adminAsgDesc.trim() || 'Complete coursework according to syllabus rubric.',
      dueDate: adminAsgDue,
      maxMarks: 25,
    };
    setAssignments((prev) => [...prev, created]);
    setAdminAsgTitle('');
    setAdminAsgDesc('');
    notify(`Assignment "${created.title}" published to all students.`);
  };

  const handleResetDatabase = () => {
    setStudents(INITIAL_STUDENTS_DB);
    setSubjects(INITIAL_SUBJECTS);
    setAttendance(INITIAL_ATTENDANCE_DB);
    setExams(INITIAL_EXAMS_DB);
    setAssignments(INITIAL_ASSIGNMENTS_DB);
    setSubmissions(INITIAL_SUBMISSIONS_DB);
    setGoals(INITIAL_GOALS_DB);
    setCurrentStudentId(1);
    notify('Database reset to initial sample student records.');
  };

  const sidebarItems =
    currentUserRole === 'admin'
      ? ([
          { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
          { id: 'reports', label: 'Student Reports', icon: FileText },
          { id: 'attendance', label: 'Attendance Logs', icon: Calendar },
          { id: 'performance', label: 'Exam Performance', icon: Award },
        ] as const)
      : ([
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'performance', label: 'Exam Performance', icon: Award },
          { id: 'assignments', label: 'Assignments', icon: BookOpen },
          { id: 'goals', label: 'Study Goals', icon: Target },
          { id: 'reports', label: 'Progress Report PDF', icon: FileText },
        ] as const);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Strictly Compliant 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              if (isAuthenticated) {
                setActiveView(currentUserRole === 'admin' ? 'admin' : 'dashboard');
              } else {
                setActiveView('home');
              }
            }}
            className="text-lg font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
          >
            Student Progress Tracker
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          {isAuthenticated ? (
            <nav className="flex items-center gap-5 sm:gap-6 text-sm font-semibold text-[#64748B] overflow-x-auto">
              {sidebarItems.map((item) => {
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProtectedNavigation(item.id)}
                    className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-[#4F46E5] text-[#4F46E5]'
                        : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="flex items-center gap-6 text-sm font-semibold text-[#64748B]">
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'home'
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('auth');
                  setAuthMode('login');
                }}
                className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'auth' && authMode === 'login'
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView('auth');
                  setAuthMode('register');
                }}
                className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeView === 'auth' && authMode === 'register'
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Student Registration
              </button>
            </nav>
          )}

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#BA1A1A] hover:bg-[#93000A] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveView('auth');
                  setAuthMode('login');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Portal Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Wrapper: Sidebar Navigation (when Authenticated) + Main Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {isAuthenticated && (
          <aside className="w-full lg:w-64 bg-[#0F172A] text-white shrink-0 no-print lg:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="px-3 py-2.5 border-b border-white/10">
                <div className="text-[11px] font-semibold text-[#94A3B8]">
                  {currentUserRole === 'admin'
                    ? 'FACULTY ADMINISTRATOR'
                    : 'AUTHENTICATED STUDENT'}
                </div>
                <div className="text-sm font-bold text-white truncate mt-0.5">
                  {currentUserRole === 'admin'
                    ? 'Dr. Eleanor Vance'
                    : activeStudent.fullName}
                </div>
                <div className="text-xs font-mono text-[#C3C0FF] mt-0.5">
                  {currentUserRole === 'admin'
                    ? 'admin@college.edu'
                    : `${activeStudent.rollNo} · Sem ${activeStudent.semester}`}
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleProtectedNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-[#4F46E5] text-white shadow-xs'
                          : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {currentUserRole === 'admin' && (
                <div className="pt-3 border-t border-white/10 px-2 space-y-1.5">
                  <label className="block text-[11px] font-semibold text-[#94A3B8]">
                    Inspect Student Record:
                  </label>
                  <select
                    value={currentStudentId}
                    onChange={(e) => setCurrentStudentId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-[#1E293B] border border-white/15 rounded-lg text-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.rollNo} — {s.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 mt-6">
              <button
                type="button"
                onClick={handleResetDatabase}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample DB
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#FFDAD6] hover:bg-[#BA1A1A] hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </aside>
        )}

        {/* Main Viewport */}
        <main className="flex-1 px-4 sm:px-6 py-6 min-w-0">
          {toast && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-semibold text-[#047857] flex items-center justify-between no-print">
              <span>{toast}</span>
              <button type="button" onClick={() => setToast(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* LANDING PAGE (index.html equivalent when unauthenticated) */}
          {!isAuthenticated && activeView === 'home' && (
            <div className="py-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 shadow-ambient">
                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs font-bold text-[#4F46E5]">
                    ACADEMIC PERFORMANCE MANAGEMENT SYSTEM
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                    Track Student Attendance, Examination Marks, Assignments & Study Goals
                  </h1>
                  <p className="text-sm sm:text-base text-[#464555] leading-relaxed">
                    A comprehensive college major project built with HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js, Python Flask, and SQLite. Protected by role-based authentication for Students and Faculty Administrators.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('auth');
                        setAuthMode('login');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In to Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('auth');
                        setAuthMode('register');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl"
                    >
                      <UserPlus className="w-4 h-4" />
                      Student Registration
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
                  <h2 className="text-base font-bold text-[#0F172A]">
                    8 Core Project Modules
                  </h2>
                  <div className="space-y-3 text-xs text-[#464555]">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0F172A]">1. User Authentication:</strong> Student Registration, Student Login, Admin Login, password validation & Logout.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0F172A]">2. Student Dashboard:</strong> Profile summary, KPI cards, and interactive progress graphs.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0F172A]">3 & 4. Attendance & Exam Marks:</strong> Subject-wise attendance eligibility & examination analytics.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Target className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0F172A]">5, 6 & 7. Assignments, Goals & PDF Report:</strong> Deadline tracking, study goals, and printable PDF transcript.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0F172A]">8. Admin Dashboard:</strong> Add, edit, and delete students, manage subjects, attendance, and marks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 1: USER AUTHENTICATION (Strictly enforced whenever not signed in) */}
          {((!isAuthenticated &&
            activeView !== 'flask-source' &&
            activeView !== 'home') ||
            activeView === 'auth') && (
            <div className="max-w-lg mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-ambient space-y-6 my-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {authMode === 'login'
                      ? 'Sign In Required'
                      : 'Student Registration'}
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Authenticate to unlock the Student Progress Tracker
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                      authMode === 'login'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                      authMode === 'register'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-[#FFDAD6] text-[#93000A] text-xs font-semibold">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-lg bg-[#ECFDF5] text-[#047857] text-xs font-semibold">
                  {authSuccess}
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Select Account Role
                    </label>
                    <select
                      value={loginRole}
                      onChange={(e) => {
                        const nextRole = e.target.value as 'student' | 'admin';
                        setLoginRole(nextRole);
                        setLoginIdentifier('');
                        setLoginPassword('');
                        setAuthError(null);
                      }}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    >
                      <option value="student">Student Login</option>
                      <option value="admin">Admin Login</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      {loginRole === 'admin'
                        ? 'Admin Username or Email *'
                        : 'University Roll Number or Email *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        loginRole === 'admin'
                          ? 'Enter admin username (e.g. admin)'
                          : 'Enter Roll No (e.g. CS2026-001) or Email'
                      }
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-xs"
                  >
                    Sign In to {loginRole === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                  </button>

                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] space-y-2">
                    <div className="font-bold text-[#0F172A]">
                      Sample Database Credentials (Click to Fill Form):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole('student');
                          setLoginIdentifier('CS2026-001');
                          setLoginPassword('student123');
                          setAuthError(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#CBD5E1] hover:border-[#4F46E5] rounded-md text-xs font-mono text-[#0F172A]"
                      >
                        Student 1: CS2026-001 / student123
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole('student');
                          setLoginIdentifier('CS2026-002');
                          setLoginPassword('student123');
                          setAuthError(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#CBD5E1] hover:border-[#4F46E5] rounded-md text-xs font-mono text-[#0F172A]"
                      >
                        Student 2: CS2026-002 / student123
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole('admin');
                          setLoginIdentifier('admin');
                          setLoginPassword('admin123');
                          setAuthError(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#CBD5E1] hover:border-[#4F46E5] rounded-md text-xs font-mono text-[#4F46E5] font-semibold"
                      >
                        Admin: admin / admin123
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={regRollNo}
                        onChange={(e) => setRegRollNo(e.target.value)}
                        placeholder="CS2026-004"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Priya Sundaram"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      College Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="priya@college.edu"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Department
                      </label>
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      >
                        <option value="Computer Science & Engineering">
                          Computer Science & Engineering
                        </option>
                        <option value="Information Technology">
                          Information Technology
                        </option>
                        <option value="Data Science & AI">Data Science & AI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Semester
                      </label>
                      <select
                        value={regSem}
                        onChange={(e) => setRegSem(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Sem {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                  >
                    Complete Student Registration
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODULE 2: STUDENT DASHBOARD */}
          {isAuthenticated && activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Student Profile Banner */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <PupilAvatar
                    seed={activeStudent.id}
                    firstName={activeStudent.fullName.split(' ')[0]}
                    lastName={activeStudent.fullName.split(' ')[1] || ''}
                    size="lg"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-[#0F172A]">
                      {activeStudent.fullName}
                    </h1>
                    <div className="text-xs text-[#64748B] mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#4F46E5]">
                        {activeStudent.rollNo}
                      </span>
                      <span>·</span>
                      <span>{activeStudent.department}</span>
                      <span>·</span>
                      <span>Semester {activeStudent.semester}</span>
                      <span>·</span>
                      <span>{activeStudent.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveView('reports')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Generate PDF Progress Report
                  </button>
                </div>
              </div>

              {/* 5 Core KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-ambient">
                  <div className="text-xs font-semibold text-[#64748B]">
                    Total Subjects
                  </div>
                  <div className="text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                    {analytics.totalSubjects}
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">
                    Semester {activeStudent.semester} Core Courses
                  </div>
                </div>

                <div
                  onClick={() => setActiveView('attendance')}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-ambient cursor-pointer hover:border-[#4F46E5] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#64748B]">
                    Overall Attendance
                  </div>
                  <div className="text-2xl font-bold text-[#4F46E5] tabular-nums mt-1">
                    {analytics.overallAttendancePct}%
                  </div>
                  <div className="text-xs text-[#64748B] tabular-nums mt-1">
                    {analytics.totalAttended}/{analytics.totalConducted} Classes Attended
                  </div>
                </div>

                <div
                  onClick={() => setActiveView('performance')}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-ambient cursor-pointer hover:border-[#4F46E5] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#64748B]">
                    Average Exam Marks
                  </div>
                  <div className="text-2xl font-bold text-[#047857] tabular-nums mt-1">
                    {analytics.avgExamPct}%
                  </div>
                  <div className="text-xs text-[#64748B] tabular-nums mt-1">
                    {analytics.totalMarksObtained}/{analytics.totalMaxMarks} Total Score
                  </div>
                </div>

                <div
                  onClick={() => setActiveView('assignments')}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-ambient cursor-pointer hover:border-[#4F46E5] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#64748B]">
                    Assignments Done
                  </div>
                  <div className="text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                    {analytics.assignmentCompletionPct}%
                  </div>
                  <div className="text-xs text-[#64748B] tabular-nums mt-1">
                    {analytics.completedAssignments} Completed · {analytics.pendingAssignments} Pending
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-ambient">
                  <div className="text-xs font-semibold text-[#64748B]">
                    Overall Academic Index
                  </div>
                  <div className="text-2xl font-bold text-[#4F46E5] tabular-nums mt-1">
                    {analytics.overallPerformance}% ({analytics.gradeLetter})
                  </div>
                  <div className="text-xs text-[#047857] font-semibold tabular-nums mt-1">
                    Study Goals: {analytics.goalCompletionPct}% Done
                  </div>
                </div>
              </div>

              {/* Interactive Charts & Visual Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chart 1: Subject-Wise Attendance Bar Graph */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A]">
                        Subject-Wise Attendance Chart
                      </h2>
                      <p className="text-xs text-[#64748B]">
                        Minimum 75% required for university examination eligibility
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('attendance')}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      Details
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {analytics.subjectAttendance.map((row) => (
                      <div key={row.subject.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#0F172A] truncate">
                            {row.subject.subjectCode} · {row.subject.subjectName}
                          </span>
                          <span className="font-mono font-bold tabular-nums text-[#0F172A]">
                            {row.attended}/{row.conducted} ({row.pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, row.pct)}%`,
                              backgroundColor:
                                row.pct >= 85
                                  ? '#10B981'
                                  : row.pct >= 75
                                  ? '#4F46E5'
                                  : '#BA1A1A',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Subject-Wise Examination Marks Graph */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A]">
                        Examination Performance Graph
                      </h2>
                      <p className="text-xs text-[#64748B]">
                        Subject-wise percentage scores across assessments
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('performance')}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      Add Marks
                    </button>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#E2E8F0]">
                    {analytics.studentExams.slice(0, 5).map((ex) => (
                      <div
                        key={ex.id}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                      >
                        <span className="text-[11px] font-mono font-bold text-[#0F172A] tabular-nums">
                          {ex.pct}%
                        </span>
                        <div
                          className="w-full max-w-[38px] rounded-t-lg transition-all duration-300"
                          style={{
                            height: `${Math.max(12, ex.pct)}%`,
                            backgroundColor:
                              ex.pct >= 90
                                ? '#10B981'
                                : ex.pct >= 75
                                ? '#4F46E5'
                                : '#F59E0B',
                          }}
                          title={`${ex.subjectName}: ${ex.marksObtained}/${ex.maxMarks}`}
                        />
                        <span className="text-[11px] font-mono font-semibold text-[#64748B] pb-2">
                          {ex.subjectCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 3: Completion Rings (Assignments & Goals) */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Milestone Rings
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Assignments & Study Goal completion
                    </p>
                  </div>

                  <div className="flex items-center justify-around py-2">
                    <div className="flex flex-col items-center gap-2">
                      <MomentumRing
                        value={analytics.assignmentCompletionPct}
                        variant="emerald"
                        size={84}
                        strokeWidth={7}
                        centerLabel={`${Math.round(analytics.assignmentCompletionPct)}%`}
                      />
                      <span className="text-xs font-semibold text-[#0F172A]">
                        Assignments
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <MomentumRing
                        value={analytics.goalCompletionPct}
                        variant="indigo"
                        size={84}
                        strokeWidth={7}
                        centerLabel={`${Math.round(analytics.goalCompletionPct)}%`}
                      />
                      <span className="text-xs font-semibold text-[#0F172A]">
                        Study Goals
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveView('goals')}
                    className="w-full py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
                  >
                    Manage Study Goals
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: ATTENDANCE MANAGEMENT */}
          {isAuthenticated && activeView === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Subject-Wise Attendance Management
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Student: <strong>{activeStudent.fullName}</strong> ({activeStudent.rollNo}) · Automatic attendance percentage & 75% eligibility status
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-[#EEF2FF] rounded-xl text-xs font-bold text-[#4F46E5] tabular-nums">
                    Overall Attendance: {analytics.overallAttendancePct}% ({analytics.totalAttended}/{analytics.totalConducted})
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                        <th className="py-3.5 pl-5 pr-3">Code</th>
                        <th className="py-3.5 px-3">Subject Name & Instructor</th>
                        <th className="py-3.5 px-3 text-right">Attended</th>
                        <th className="py-3.5 px-3 text-right">Conducted</th>
                        <th className="py-3.5 px-3 text-right">Attendance %</th>
                        <th className="py-3.5 px-3">Eligibility Status</th>
                        <th className="py-3.5 pl-3 pr-5 text-right">Quick Log Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-sm">
                      {analytics.subjectAttendance.map((row) => (
                        <tr key={row.subject.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-[#4F46E5]">
                            {row.subject.subjectCode}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-[#0F172A]">
                              {row.subject.subjectName}
                            </div>
                            <div className="text-xs text-[#64748B]">
                              {row.subject.instructor} · {row.subject.credits} Credits
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                            {row.attended}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#64748B]">
                            {row.conducted}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                            {row.pct.toFixed(1)}%
                          </td>
                          <td className="py-3.5 px-3">
                            {row.pct >= 85 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                                <CheckCircle2 className="w-4 h-4" />
                                Excellent Standing
                              </span>
                            ) : row.pct >= 75 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5]">
                                <CheckCircle2 className="w-4 h-4" />
                                Eligible (≥75%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BA1A1A]">
                                <AlertTriangle className="w-4 h-4" />
                                Shortage — Attend next {row.classesNeededFor75} classes
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pl-3 pr-5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdjustAttendance(
                                    activeStudent.id,
                                    row.subject.id,
                                    1,
                                    1
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-semibold text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-lg"
                              >
                                +1 Present
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdjustAttendance(
                                    activeStudent.id,
                                    row.subject.id,
                                    0,
                                    1
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-semibold text-[#B45309] bg-[#FFFBEB] hover:bg-[#FEF3C7] rounded-lg"
                              >
                                +1 Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: ACADEMIC PERFORMANCE (EXAMINATION MARKS) */}
          {isAuthenticated && activeView === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Add Exam Score Form */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Add Examination Marks
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Record subject-wise marks for {activeStudent.fullName}
                  </p>
                </div>

                <form onSubmit={handleAddStudentExam} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Subject
                    </label>
                    <select
                      value={examSubjectId}
                      onChange={(e) => setExamSubjectId(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subjectCode} — {sub.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Examination Type
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    >
                      <option value="Midterm Exam">Midterm Exam</option>
                      <option value="Internal Assessment 1">Internal Assessment 1</option>
                      <option value="Internal Assessment 2">Internal Assessment 2</option>
                      <option value="End Semester Exam">End Semester Exam</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={200}
                        required
                        value={examMarks}
                        onChange={(e) => setExamMarks(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Maximum Marks
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={200}
                        required
                        value={examMaxMarks}
                        onChange={(e) => setExamMaxMarks(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Remarks / Topic Notes
                    </label>
                    <input
                      type="text"
                      value={examRemarks}
                      onChange={(e) => setExamRemarks(e.target.value)}
                      placeholder="e.g. Strong B+ tree indexing performance"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                  >
                    Save Examination Marks
                  </button>
                </form>
              </div>

              {/* Subject-Wise Marks Table & Totals */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      Subject-Wise Examination Ledger
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Total Marks: <strong>{analytics.totalMarksObtained} / {analytics.totalMaxMarks}</strong> · Average Percentage: <strong>{analytics.avgExamPct}%</strong>
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[#ECFDF5] text-[#047857] rounded-xl text-xs font-bold tabular-nums">
                    Average Score: {analytics.avgExamPct}%
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                        <th className="py-3 pl-5 pr-3">Subject</th>
                        <th className="py-3 px-3">Examination</th>
                        <th className="py-3 px-3 text-right">Marks</th>
                        <th className="py-3 px-3 text-right">Percentage</th>
                        <th className="py-3 pl-3 pr-5">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-sm">
                      {analytics.studentExams.map((ex) => (
                        <tr key={ex.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 pl-5 pr-3">
                            <span className="font-mono font-bold text-[#4F46E5]">
                              {ex.subjectCode}
                            </span>{' '}
                            · <span className="font-semibold">{ex.subjectName}</span>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#64748B]">
                            {ex.examType} · {ex.examDate}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                            {ex.marksObtained}/{ex.maxMarks}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#047857] tabular-nums">
                            {ex.pct}%
                          </td>
                          <td className="py-3.5 pl-3 pr-5 text-xs text-[#64748B]">
                            {ex.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: ASSIGNMENT TRACKER */}
          {isAuthenticated && activeView === 'assignments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Coursework & Assignment Tracker
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {analytics.completedAssignments} Completed · {analytics.pendingAssignments} Pending · {analytics.assignmentCompletionPct}% Completion Rate
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
                  {(['All', 'Pending', 'Completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setAsgFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        asgFilter === tab
                          ? 'bg-white text-[#0F172A] shadow-xs'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B]">
                      <th className="py-3.5 pl-5 pr-3">Subject</th>
                      <th className="py-3.5 px-3">Assignment Title & Instructions</th>
                      <th className="py-3.5 px-3">Deadline</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-3 text-right">Marks</th>
                      <th className="py-3.5 pl-3 pr-5 text-right">Submission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm">
                    {analytics.studentAssignments
                      .filter((a) => asgFilter === 'All' || a.status === asgFilter)
                      .map((asg) => (
                        <tr key={asg.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-[#4F46E5]">
                            {asg.subjectCode}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-[#0F172A]">
                              {asg.title}
                            </div>
                            <div className="text-xs text-[#64748B]">
                              {asg.description}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-xs tabular-nums">
                            {asg.dueDate}
                          </td>
                          <td className="py-3.5 px-3">
                            {asg.status === 'Completed' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309]">
                                <Clock className="w-3.5 h-3.5" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                            {asg.marksAwarded !== undefined
                              ? `${asg.marksAwarded}/${asg.maxMarks}`
                              : `—/${asg.maxMarks}`}
                          </td>
                          <td className="py-3.5 pl-3 pr-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAssignmentStatus(asg.id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                asg.status === 'Completed'
                                  ? 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                                  : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                              }`}
                            >
                              {asg.status === 'Completed'
                                ? 'Mark Pending'
                                : 'Submit Work'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 6: STUDY GOAL TRACKER */}
          {isAuthenticated && activeView === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Create Study Goal
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Set daily and weekly study targets for {activeStudent.fullName}
                  </p>
                </div>

                <form onSubmit={handleCreateGoal} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Study Goal Title
                    </label>
                    <input
                      type="text"
                      required
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="e.g. Solve 12 Graph Theory Proof Problems"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Target Cadence
                      </label>
                      <select
                        value={goalType}
                        onChange={(e) =>
                          setGoalType(e.target.value as 'Daily' | 'Weekly')
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg"
                      >
                        <option value="Daily">Daily Target</option>
                        <option value="Weekly">Weekly Target</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                        Target Hours
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        required
                        value={goalHours}
                        onChange={(e) => setGoalHours(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      required
                      value={goalDate}
                      onChange={(e) => setGoalDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                  >
                    Add Study Goal
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      Active & Completed Study Goals
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {analytics.completedGoals} of {analytics.studentGoals.length} goals completed ({analytics.goalCompletionPct}%)
                    </p>
                  </div>
                  <MomentumRing
                    value={analytics.goalCompletionPct}
                    variant="emerald"
                    size={60}
                    strokeWidth={6}
                  />
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {analytics.studentGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleGoal(goal.id)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                            goal.isCompleted
                              ? 'bg-[#10B981] border-[#10B981] text-white'
                              : 'border-[#94A3B8] bg-white hover:border-[#4F46E5]'
                          }`}
                        >
                          {goal.isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              goal.isCompleted
                                ? 'line-through text-[#64748B]'
                                : 'text-[#0F172A]'
                            }`}
                          >
                            {goal.title}
                          </div>
                          <div className="text-xs text-[#64748B] mt-0.5">
                            {goal.goalType} Target · {goal.targetHours} hrs · Due{' '}
                            {goal.targetDate}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-[#64748B] hover:text-[#BA1A1A] rounded-lg"
                        title="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: PROGRESS REPORT (WITH PDF DOWNLOAD / PRINT) */}
          {isAuthenticated && activeView === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Student Academic Progress Report
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Official transcript summary for {activeStudent.fullName} ({activeStudent.rollNo})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg"
                >
                  <Printer className="w-4 h-4" />
                  Download / Print PDF Report
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-ambient space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                  <div>
                    <div className="text-xs font-bold text-[#4F46E5]">
                      ACADEMIC PERFORMANCE MANAGEMENT SYSTEM
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F172A] mt-0.5">
                      STUDENT PROGRESS REPORT TRANSCRIPT
                    </h3>
                    <div className="text-xs text-[#64748B] mt-1">
                      {activeStudent.fullName} · Roll No: {activeStudent.rollNo} ·{' '}
                      {activeStudent.department} · Semester {activeStudent.semester}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-[#64748B]">Overall Standing</div>
                    <div className="text-2xl font-extrabold text-[#4F46E5] tabular-nums">
                      {analytics.overallPerformance}% (Grade {analytics.gradeLetter})
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Attendance Rate</div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">
                      {analytics.overallAttendancePct}% ({analytics.totalAttended}/{analytics.totalConducted})
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Exam Average</div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">
                      {analytics.avgExamPct}% ({analytics.totalMarksObtained}/{analytics.totalMaxMarks})
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Assignments</div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">
                      {analytics.completedAssignments}/{analytics.studentAssignments.length} ({analytics.assignmentCompletionPct}%)
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Study Goals</div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">
                      {analytics.completedGoals}/{analytics.studentGoals.length} ({analytics.goalCompletionPct}%)
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-2">
                    1. Subject-Wise Attendance Summary
                  </h4>
                  <table className="w-full text-left border border-[#E2E8F0] text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Subject Name</th>
                        <th className="p-2.5 text-right">Attended</th>
                        <th className="p-2.5 text-right">Conducted</th>
                        <th className="p-2.5 text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {analytics.subjectAttendance.map((r) => (
                        <tr key={r.subject.id}>
                          <td className="p-2.5 font-mono font-bold">{r.subject.subjectCode}</td>
                          <td className="p-2.5">{r.subject.subjectName}</td>
                          <td className="p-2.5 text-right font-mono">{r.attended}</td>
                          <td className="p-2.5 text-right font-mono">{r.conducted}</td>
                          <td className="p-2.5 text-right font-mono font-bold">{r.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-2">
                    2. Examination Performance Record
                  </h4>
                  <table className="w-full text-left border border-[#E2E8F0] text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Examination</th>
                        <th className="p-2.5 text-right">Score</th>
                        <th className="p-2.5 text-right">Percentage</th>
                        <th className="p-2.5">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {analytics.studentExams.map((ex) => (
                        <tr key={ex.id}>
                          <td className="p-2.5 font-semibold">
                            {ex.subjectCode} — {ex.subjectName}
                          </td>
                          <td className="p-2.5">{ex.examType}</td>
                          <td className="p-2.5 text-right font-mono font-bold">
                            {ex.marksObtained}/{ex.maxMarks}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold">
                            {ex.pct}%
                          </td>
                          <td className="p-2.5 text-[#64748B]">{ex.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: ADMIN DASHBOARD */}
          {isAuthenticated && currentUserRole === 'admin' && activeView === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Faculty Administrator Dashboard
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    View, add, edit, and delete student records, manage subjects, update attendance, add exam marks, and publish assignments
                  </p>
                </div>
                <div className="text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-2 rounded-xl">
                  {students.length} Students · {subjects.length} Subjects · {assignments.length} Assignments
                </div>
              </div>

              {/* Registered Students Overview Table with Edit & Delete */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Registered Students & Individual Performance Summary
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                        <th className="py-3 pl-5 pr-3">Roll No</th>
                        <th className="py-3 px-3">Student Name & Department</th>
                        <th className="py-3 px-3 text-right">Attendance</th>
                        <th className="py-3 px-3 text-right">Exam Avg</th>
                        <th className="py-3 px-3 text-right">Assignments</th>
                        <th className="py-3 px-3 text-right">Overall</th>
                        <th className="py-3 pl-3 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {students.map((stu) => {
                        const sum = computeStudentAnalytics(
                          stu,
                          subjects,
                          attendance,
                          exams,
                          assignments,
                          submissions,
                          goals
                        );
                        return (
                          <tr key={stu.id} className="hover:bg-[#F8FAFC]">
                            <td className="py-3 pl-5 pr-3 font-mono font-bold text-[#4F46E5]">
                              {stu.rollNo}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-[#0F172A]">
                                {stu.fullName}
                              </div>
                              <div className="text-xs text-[#64748B]">
                                {stu.email} · Sem {stu.semester}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums">
                              {sum.overallAttendancePct}%
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums">
                              {sum.avgExamPct}%
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums">
                              {sum.completedAssignments}/{sum.studentAssignments.length}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-[#047857] tabular-nums">
                              {sum.overallPerformance}% ({sum.gradeLetter})
                            </td>
                            <td className="py-3 pl-3 pr-5 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentStudentId(stu.id);
                                  setActiveView('reports');
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] rounded-lg"
                              >
                                Report
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingStudent({ ...stu })}
                                className="px-2.5 py-1 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg"
                              >
                                <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdminDeleteStudent(stu.id)}
                                className="p-1 text-[#64748B] hover:text-[#BA1A1A]"
                                title="Delete student"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Student Modal */}
              {editingStudent && (
                <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <form
                    onSubmit={handleAdminSaveEditedStudent}
                    className="bg-white rounded-2xl border border-[#E2E8F0] shadow-modal max-w-md w-full p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#0F172A]">
                        Edit Student Record
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="p-1 text-[#64748B] hover:text-[#0F172A]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Roll No</label>
                        <input
                          type="text"
                          required
                          value={editingStudent.rollNo}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, rollNo: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editingStudent.fullName}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={editingStudent.email}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, email: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Semester</label>
                          <input
                            type="number"
                            min={1}
                            max={8}
                            value={editingStudent.semester}
                            onChange={(e) =>
                              setEditingStudent({
                                ...editingStudent,
                                semester: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Phone</label>
                          <input
                            type="text"
                            value={editingStudent.phone}
                            onChange={(e) =>
                              setEditingStudent({ ...editingStudent, phone: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#64748B]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Admin Management Forms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Add Student */}
                <form
                  onSubmit={handleAdminAddStudent}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-3"
                >
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    1. Add New Student Record
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      value={adminStuRoll}
                      onChange={(e) => setAdminStuRoll(e.target.value)}
                      placeholder="Roll No (CS2026-005)"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      value={adminStuName}
                      onChange={(e) => setAdminStuName(e.target.value)}
                      placeholder="Student Full Name"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="email"
                      required
                      value={adminStuEmail}
                      onChange={(e) => setAdminStuEmail(e.target.value)}
                      placeholder="College Email"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      value={adminStuPhone}
                      onChange={(e) => setAdminStuPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                  >
                    Add Student
                  </button>
                </form>

                {/* 2. Manage Subjects */}
                <form
                  onSubmit={handleAdminAddSubject}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-3"
                >
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    2. Manage Curriculum Subjects
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      value={adminSubCode}
                      onChange={(e) => setAdminSubCode(e.target.value)}
                      placeholder="Subject Code (CS506)"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      value={adminSubName}
                      onChange={(e) => setAdminSubName(e.target.value)}
                      placeholder="Subject Title"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      value={adminSubInstructor}
                      onChange={(e) => setAdminSubInstructor(e.target.value)}
                      placeholder="Instructor Name"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={adminSubCredits}
                      onChange={(e) => setAdminSubCredits(e.target.value)}
                      placeholder="Credits (4)"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                  >
                    Add Subject
                  </button>
                </form>

                {/* 3. Update Attendance */}
                <form
                  onSubmit={handleAdminUpdateAttendance}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-3"
                >
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    3. Update Student Attendance
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <select
                      value={adminAttStudentId}
                      onChange={(e) => setAdminAttStudentId(Number(e.target.value))}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.rollNo} — {s.fullName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={adminAttSubjectId}
                      onChange={(e) => setAdminAttSubjectId(Number(e.target.value))}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subjectCode} — {sub.subjectName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      required
                      value={adminAttAttended}
                      onChange={(e) => setAdminAttAttended(e.target.value)}
                      placeholder="Classes Attended"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="number"
                      min={1}
                      required
                      value={adminAttConducted}
                      onChange={(e) => setAdminAttConducted(e.target.value)}
                      placeholder="Classes Conducted"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                  >
                    Save Attendance
                  </button>
                </form>

                {/* 4. Add Examination Marks */}
                <form
                  onSubmit={handleAdminAddExam}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-3"
                >
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    4. Add Student Examination Marks
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <select
                      value={adminExamStudentId}
                      onChange={(e) => setAdminExamStudentId(Number(e.target.value))}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.rollNo} — {s.fullName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={adminExamSubjectId}
                      onChange={(e) => setAdminExamSubjectId(Number(e.target.value))}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subjectCode} — {sub.subjectName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      required
                      value={adminExamMarks}
                      onChange={(e) => setAdminExamMarks(e.target.value)}
                      placeholder="Marks Obtained"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="number"
                      min={10}
                      required
                      value={adminExamMax}
                      onChange={(e) => setAdminExamMax(e.target.value)}
                      placeholder="Max Marks (100)"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                  >
                    Record Exam Marks
                  </button>
                </form>

                {/* 5. Publish Assignment */}
                <form
                  onSubmit={handleAdminPublishAssignment}
                  className="md:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-3"
                >
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    5. Manage & Publish Coursework Assignment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <select
                      value={adminAsgSubjectId}
                      onChange={(e) => setAdminAsgSubjectId(Number(e.target.value))}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subjectCode} — {sub.subjectName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={adminAsgTitle}
                      onChange={(e) => setAdminAsgTitle(e.target.value)}
                      placeholder="Assignment Title"
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="date"
                      required
                      value={adminAsgDue}
                      onChange={(e) => setAdminAsgDue(e.target.value)}
                      className="px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
                  >
                    Publish Assignment
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MODULE 9: PYTHON FLASK + SQLITE SOURCE CODE EXPLORER */}
          {activeView === 'flask-source' && <FlaskSourceExplorer />}
        </main>
      </div>
    </div>
  );
}
