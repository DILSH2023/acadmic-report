export interface StudentRecord {
  id: number;
  rollNo: string;
  fullName: string;
  email: string;
  passwordHash: string;
  department: string;
  semester: number;
  phone: string;
  createdAt: string;
}

export interface SubjectRecord {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semester: number;
  instructor: string;
}

export interface AttendanceEntry {
  id: number;
  studentId: number;
  subjectId: number;
  classesAttended: number;
  classesConducted: number;
  lastUpdated: string;
}

export interface ExamEntry {
  id: number;
  studentId: number;
  subjectId: number;
  examType: string;
  marksObtained: number;
  maxMarks: number;
  examDate: string;
  remarks: string;
}

export interface AssignmentRecord {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
}

export interface AssignmentSubmissionRecord {
  id: number;
  assignmentId: number;
  studentId: number;
  status: 'Pending' | 'Completed';
  submittedDate?: string;
  marksAwarded?: number;
  submissionNote?: string;
}

export interface StudyGoalRecord {
  id: number;
  studentId: number;
  title: string;
  goalType: 'Daily' | 'Weekly';
  targetHours: number;
  completedHours: number;
  targetDate: string;
  isCompleted: boolean;
}

export const INITIAL_SUBJECTS: SubjectRecord[] = [
  {
    id: 1,
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    credits: 4,
    semester: 5,
    instructor: 'Prof. R. K. Sharma',
  },
  {
    id: 2,
    subjectCode: 'CS502',
    subjectName: 'Operating Systems & Kernel Design',
    credits: 4,
    semester: 5,
    instructor: 'Dr. Alan Turing',
  },
  {
    id: 3,
    subjectCode: 'CS503',
    subjectName: 'Design & Analysis of Algorithms',
    credits: 4,
    semester: 5,
    instructor: 'Prof. Maya Lin',
  },
  {
    id: 4,
    subjectCode: 'CS504',
    subjectName: 'Computer Networks & Security',
    credits: 3,
    semester: 5,
    instructor: 'Dr. Vikram Patel',
  },
  {
    id: 5,
    subjectCode: 'CS505',
    subjectName: 'Full-Stack Web Engineering',
    credits: 3,
    semester: 5,
    instructor: 'Prof. Elena Rostova',
  },
];

export const INITIAL_STUDENTS_DB: StudentRecord[] = [
  {
    id: 1,
    rollNo: 'CS2026-001',
    fullName: 'Aarav Sharma',
    email: 'aarav@college.edu',
    passwordHash: 'student123',
    department: 'Computer Science & Engineering',
    semester: 5,
    phone: '+91 98765 43210',
    createdAt: '2026-08-01',
  },
  {
    id: 2,
    rollNo: 'CS2026-002',
    fullName: 'Maya Lin-kovsky',
    email: 'maya@college.edu',
    passwordHash: 'student123',
    department: 'Computer Science & Engineering',
    semester: 5,
    phone: '+1 (415) 891-4402',
    createdAt: '2026-08-01',
  },
  {
    id: 3,
    rollNo: 'CS2026-003',
    fullName: 'Marcus Vance',
    email: 'marcus@college.edu',
    passwordHash: 'student123',
    department: 'Computer Science & Engineering',
    semester: 5,
    phone: '+1 (415) 309-8821',
    createdAt: '2026-08-02',
  },
];

export const INITIAL_ATTENDANCE_DB: AttendanceEntry[] = [
  // Student 1 (Aarav)
  { id: 1, studentId: 1, subjectId: 1, classesAttended: 38, classesConducted: 42, lastUpdated: '2026-11-06' },
  { id: 2, studentId: 1, subjectId: 2, classesAttended: 35, classesConducted: 40, lastUpdated: '2026-11-06' },
  { id: 3, studentId: 1, subjectId: 3, classesAttended: 40, classesConducted: 44, lastUpdated: '2026-11-06' },
  { id: 4, studentId: 1, subjectId: 4, classesAttended: 30, classesConducted: 36, lastUpdated: '2026-11-06' },
  { id: 5, studentId: 1, subjectId: 5, classesAttended: 36, classesConducted: 38, lastUpdated: '2026-11-06' },
  // Student 2 (Maya)
  { id: 6, studentId: 2, subjectId: 1, classesAttended: 41, classesConducted: 42, lastUpdated: '2026-11-06' },
  { id: 7, studentId: 2, subjectId: 2, classesAttended: 39, classesConducted: 40, lastUpdated: '2026-11-06' },
  { id: 8, studentId: 2, subjectId: 3, classesAttended: 43, classesConducted: 44, lastUpdated: '2026-11-06' },
  { id: 9, studentId: 2, subjectId: 4, classesAttended: 35, classesConducted: 36, lastUpdated: '2026-11-06' },
  { id: 10, studentId: 2, subjectId: 5, classesAttended: 37, classesConducted: 38, lastUpdated: '2026-11-06' },
  // Student 3 (Marcus)
  { id: 11, studentId: 3, subjectId: 1, classesAttended: 29, classesConducted: 42, lastUpdated: '2026-11-06' },
  { id: 12, studentId: 3, subjectId: 2, classesAttended: 28, classesConducted: 40, lastUpdated: '2026-11-06' },
  { id: 13, studentId: 3, subjectId: 3, classesAttended: 33, classesConducted: 44, lastUpdated: '2026-11-06' },
  { id: 14, studentId: 3, subjectId: 4, classesAttended: 25, classesConducted: 36, lastUpdated: '2026-11-06' },
  { id: 15, studentId: 3, subjectId: 5, classesAttended: 31, classesConducted: 38, lastUpdated: '2026-11-06' },
];

export const INITIAL_EXAMS_DB: ExamEntry[] = [
  // Student 1
  { id: 1, studentId: 1, subjectId: 1, examType: 'Midterm Exam', marksObtained: 88, maxMarks: 100, examDate: '2026-10-15', remarks: 'Strong BCNF normalization schema' },
  { id: 2, studentId: 1, subjectId: 2, examType: 'Midterm Exam', marksObtained: 82, maxMarks: 100, examDate: '2026-10-17', remarks: 'Good deadlock prevention analysis' },
  { id: 3, studentId: 1, subjectId: 3, examType: 'Midterm Exam', marksObtained: 91, maxMarks: 100, examDate: '2026-10-19', remarks: 'Optimal dynamic programming derivation' },
  { id: 4, studentId: 1, subjectId: 4, examType: 'Midterm Exam', marksObtained: 79, maxMarks: 100, examDate: '2026-10-21', remarks: 'Review CIDR subnetting masks' },
  { id: 5, studentId: 1, subjectId: 5, examType: 'Midterm Exam', marksObtained: 94, maxMarks: 100, examDate: '2026-10-23', remarks: 'Outstanding Flask + SQLite architecture' },
  // Student 2
  { id: 6, studentId: 2, subjectId: 1, examType: 'Midterm Exam', marksObtained: 96, maxMarks: 100, examDate: '2026-10-15', remarks: 'Top score in B+ tree indexing' },
  { id: 7, studentId: 2, subjectId: 2, examType: 'Midterm Exam', marksObtained: 92, maxMarks: 100, examDate: '2026-10-17', remarks: 'Excellent page replacement simulation' },
  { id: 8, studentId: 2, subjectId: 3, examType: 'Midterm Exam', marksObtained: 95, maxMarks: 100, examDate: '2026-10-19', remarks: 'Flawless shortest-path proofs' },
  { id: 9, studentId: 2, subjectId: 4, examType: 'Midterm Exam', marksObtained: 89, maxMarks: 100, examDate: '2026-10-21', remarks: 'Great TLS handshake analysis' },
  { id: 10, studentId: 2, subjectId: 5, examType: 'Midterm Exam', marksObtained: 97, maxMarks: 100, examDate: '2026-10-23', remarks: 'Exemplary responsive UI' },
  // Student 3
  { id: 11, studentId: 3, subjectId: 1, examType: 'Midterm Exam', marksObtained: 74, maxMarks: 100, examDate: '2026-10-15', remarks: 'Practice complex SQL joins' },
  { id: 12, studentId: 3, subjectId: 2, examType: 'Midterm Exam', marksObtained: 71, maxMarks: 100, examDate: '2026-10-17', remarks: 'Revise CPU scheduling queues' },
  { id: 13, studentId: 3, subjectId: 3, examType: 'Midterm Exam', marksObtained: 78, maxMarks: 100, examDate: '2026-10-19', remarks: 'Solid greedy algorithm trace' },
  { id: 14, studentId: 3, subjectId: 4, examType: 'Midterm Exam', marksObtained: 68, maxMarks: 100, examDate: '2026-10-21', remarks: 'Needs transport layer review' },
  { id: 15, studentId: 3, subjectId: 5, examType: 'Midterm Exam', marksObtained: 83, maxMarks: 100, examDate: '2026-10-23', remarks: 'Clean frontend form validation' },
];

export const INITIAL_ASSIGNMENTS_DB: AssignmentRecord[] = [
  {
    id: 1,
    subjectId: 1,
    title: 'ER Modeling & BCNF Normalization Schema',
    description: 'Design a 3NF/BCNF relational database schema for a university hospital with SQL DDL scripts.',
    dueDate: '2026-11-10',
    maxMarks: 25,
  },
  {
    id: 2,
    subjectId: 2,
    title: 'POSIX Threads & Mutex Producer-Consumer Lab',
    description: 'Implement bounded-buffer thread synchronization in C without race conditions.',
    dueDate: '2026-11-12',
    maxMarks: 25,
  },
  {
    id: 3,
    subjectId: 3,
    title: 'Dijkstra & Bellman-Ford Empirical Benchmark',
    description: 'Compare asymptotic vs empirical runtime on sparse and dense weighted graphs.',
    dueDate: '2026-11-15',
    maxMarks: 25,
  },
  {
    id: 4,
    subjectId: 4,
    title: 'Wireshark TCP Congestion Control Packet Trace',
    description: 'Capture and annotate TCP slow start, congestion avoidance, and fast retransmit.',
    dueDate: '2026-11-18',
    maxMarks: 25,
  },
  {
    id: 5,
    subjectId: 5,
    title: 'Student Progress Tracker Full-Stack Architecture',
    description: 'Develop a complete responsive web app using HTML5, Bootstrap 5, Chart.js, Flask, and SQLite.',
    dueDate: '2026-11-22',
    maxMarks: 25,
  },
];

export const INITIAL_SUBMISSIONS_DB: AssignmentSubmissionRecord[] = [
  // Student 1 (4 completed, 1 pending)
  { id: 1, assignmentId: 1, studentId: 1, status: 'Completed', submittedDate: '2026-11-04', marksAwarded: 24, submissionNote: 'Uploaded ER diagram + SQLite schema.' },
  { id: 2, assignmentId: 2, studentId: 1, status: 'Completed', submittedDate: '2026-11-05', marksAwarded: 22, submissionNote: 'Passed all pthread stress tests.' },
  { id: 3, assignmentId: 3, studentId: 1, status: 'Completed', submittedDate: '2026-11-06', marksAwarded: 24, submissionNote: 'Included Python matplotlib plots.' },
  { id: 4, assignmentId: 4, studentId: 1, status: 'Completed', submittedDate: '2026-11-06', marksAwarded: 21, submissionNote: 'Annotated pcap file attached.' },
  { id: 5, assignmentId: 5, studentId: 1, status: 'Pending' },
  // Student 2 (5 completed)
  { id: 6, assignmentId: 1, studentId: 2, status: 'Completed', submittedDate: '2026-11-03', marksAwarded: 25, submissionNote: 'Complete BCNF proof included.' },
  { id: 7, assignmentId: 2, studentId: 2, status: 'Completed', submittedDate: '2026-11-04', marksAwarded: 25, submissionNote: 'Zero valgrind leaks.' },
  { id: 8, assignmentId: 3, studentId: 2, status: 'Completed', submittedDate: '2026-11-05', marksAwarded: 24, submissionNote: 'Fibonacci heap priority queue.' },
  { id: 9, assignmentId: 4, studentId: 2, status: 'Completed', submittedDate: '2026-11-05', marksAwarded: 24, submissionNote: 'Reno vs Cubic comparison.' },
  { id: 10, assignmentId: 5, studentId: 2, status: 'Completed', submittedDate: '2026-11-06', marksAwarded: 25, submissionNote: 'Deployed full Flask app.' },
  // Student 3 (2 completed, 3 pending)
  { id: 11, assignmentId: 1, studentId: 3, status: 'Completed', submittedDate: '2026-11-05', marksAwarded: 20, submissionNote: 'Submitted schema script.' },
  { id: 12, assignmentId: 2, studentId: 3, status: 'Completed', submittedDate: '2026-11-06', marksAwarded: 19, submissionNote: 'Working mutex lock.' },
  { id: 13, assignmentId: 3, studentId: 3, status: 'Pending' },
  { id: 14, assignmentId: 4, studentId: 3, status: 'Pending' },
  { id: 15, assignmentId: 5, studentId: 3, status: 'Pending' },
];

export const INITIAL_GOALS_DB: StudyGoalRecord[] = [
  { id: 1, studentId: 1, title: 'Complete B+ Tree & Indexing Problem Set', goalType: 'Weekly', targetHours: 6, completedHours: 6, targetDate: '2026-11-08', isCompleted: true },
  { id: 2, studentId: 1, title: 'Revise Linux Virtual Memory Paging & TLB', goalType: 'Daily', targetHours: 3, completedHours: 2, targetDate: '2026-11-09', isCompleted: false },
  { id: 3, studentId: 1, title: 'Practice 15 Dynamic Programming Problems', goalType: 'Weekly', targetHours: 8, completedHours: 5.5, targetDate: '2026-11-14', isCompleted: false },
  { id: 4, studentId: 1, title: 'Finish Wireshark TCP Packet Trace Lab', goalType: 'Daily', targetHours: 2.5, completedHours: 2.5, targetDate: '2026-11-07', isCompleted: true },
  { id: 5, studentId: 2, title: 'Master Red-Black Tree Insertion Rotations', goalType: 'Weekly', targetHours: 5, completedHours: 5, targetDate: '2026-11-08', isCompleted: true },
  { id: 6, studentId: 3, title: 'Catch up on SQL Joins & Correlated Subqueries', goalType: 'Weekly', targetHours: 6, completedHours: 3, targetDate: '2026-11-10', isCompleted: false },
];

export function computeStudentAnalytics(
  student: StudentRecord,
  subjects: SubjectRecord[],
  attendance: AttendanceEntry[],
  exams: ExamEntry[],
  assignments: AssignmentRecord[],
  submissions: AssignmentSubmissionRecord[],
  goals: StudyGoalRecord[]
) {
  const subjectAttendance = subjects.map((sub) => {
    const rec = attendance.find(
      (a) => a.studentId === student.id && a.subjectId === sub.id
    );
    const attended = rec ? rec.classesAttended : 0;
    const conducted = rec ? rec.classesConducted : 0;
    const pct = conducted > 0 ? Math.round((attended / conducted) * 1000) / 10 : 0;
    const classesNeededFor75 =
      pct < 75 && conducted > 0
        ? Math.max(0, Math.ceil((0.75 * conducted - attended) / 0.25))
        : 0;
    return {
      subject: sub,
      attended,
      conducted,
      pct,
      classesNeededFor75,
      lastUpdated: rec?.lastUpdated || '2026-11-06',
    };
  });

  const totalAttended = subjectAttendance.reduce((acc, r) => acc + r.attended, 0);
  const totalConducted = subjectAttendance.reduce((acc, r) => acc + r.conducted, 0);
  const overallAttendancePct =
    totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 1000) / 10 : 0;

  const studentExams = exams
    .filter((e) => e.studentId === student.id)
    .map((e) => {
      const sub = subjects.find((s) => s.id === e.subjectId);
      const pct = e.maxMarks > 0 ? Math.round((e.marksObtained / e.maxMarks) * 1000) / 10 : 0;
      return {
        ...e,
        subjectCode: sub?.subjectCode || 'SUB',
        subjectName: sub?.subjectName || 'Subject',
        pct,
      };
    });

  const totalMarksObtained = studentExams.reduce((acc, e) => acc + e.marksObtained, 0);
  const totalMaxMarks = studentExams.reduce((acc, e) => acc + e.maxMarks, 0);
  const avgExamPct =
    totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 1000) / 10 : 0;

  const studentAssignments = assignments.map((asg) => {
    const sub = subjects.find((s) => s.id === asg.subjectId);
    const submission = submissions.find(
      (s) => s.assignmentId === asg.id && s.studentId === student.id
    );
    return {
      ...asg,
      subjectCode: sub?.subjectCode || 'CS',
      subjectName: sub?.subjectName || 'Subject',
      status: submission?.status || ('Pending' as const),
      submittedDate: submission?.submittedDate,
      marksAwarded: submission?.marksAwarded,
      submissionNote: submission?.submissionNote,
    };
  });

  const completedAssignments = studentAssignments.filter(
    (a) => a.status === 'Completed'
  ).length;
  const pendingAssignments = studentAssignments.length - completedAssignments;
  const assignmentCompletionPct =
    studentAssignments.length > 0
      ? Math.round((completedAssignments / studentAssignments.length) * 1000) / 10
      : 0;

  const studentGoals = goals.filter((g) => g.studentId === student.id);
  const completedGoals = studentGoals.filter((g) => g.isCompleted).length;
  const goalCompletionPct =
    studentGoals.length > 0
      ? Math.round((completedGoals / studentGoals.length) * 1000) / 10
      : 0;

  const overallPerformance =
    Math.round(
      (avgExamPct * 0.5 +
        overallAttendancePct * 0.25 +
        assignmentCompletionPct * 0.25) *
        10
    ) / 10;

  let gradeLetter = 'C';
  if (overallPerformance >= 90) gradeLetter = 'A+';
  else if (overallPerformance >= 80) gradeLetter = 'A';
  else if (overallPerformance >= 70) gradeLetter = 'B+';
  else if (overallPerformance >= 60) gradeLetter = 'B';

  return {
    student,
    totalSubjects: subjects.length,
    subjectAttendance,
    totalAttended,
    totalConducted,
    overallAttendancePct,
    studentExams,
    totalMarksObtained,
    totalMaxMarks,
    avgExamPct,
    studentAssignments,
    completedAssignments,
    pendingAssignments,
    assignmentCompletionPct,
    studentGoals,
    completedGoals,
    goalCompletionPct,
    overallPerformance,
    gradeLetter,
  };
}
