import {
  Assignment,
  AssignmentCategory,
  BehavioralInsight,
  CourseSection,
  Student,
} from '../types/classroom';

export const COURSES: CourseSection[] = [
  {
    id: 'calc-bc-p2',
    code: 'MATH-402',
    name: 'AP Calculus BC',
    period: 'Period 2',
    room: 'Hall 3B · Room 304',
    schedule: 'Mon–Fri · 08:45 – 09:50',
    termProgress: 74,
    categoryWeights: {
      'Problem Sets': 25,
      'Lab & Inquiry': 20,
      'Unit Assessments': 40,
      'Seminar & Synthesis': 15,
    },
  },
  {
    id: 'phys-hon-p4',
    code: 'PHYS-310',
    name: 'Honors Mechanics & Waves',
    period: 'Period 4',
    room: 'Science Wing · Lab 201',
    schedule: 'Mon–Fri · 11:15 – 12:20',
    termProgress: 71,
    categoryWeights: {
      'Problem Sets': 20,
      'Lab & Inquiry': 35,
      'Unit Assessments': 35,
      'Seminar & Synthesis': 10,
    },
  },
  {
    id: 'stat-ap-p6',
    code: 'STAT-405',
    name: 'AP Statistical Inference',
    period: 'Period 6',
    room: 'Hall 3B · Room 308',
    schedule: 'Mon–Fri · 13:45 – 14:50',
    termProgress: 76,
    categoryWeights: {
      'Problem Sets': 25,
      'Lab & Inquiry': 25,
      'Unit Assessments': 35,
      'Seminar & Synthesis': 15,
    },
  },
];

export const SCHOOL_DATES = [
  { date: '2026-10-26', label: 'Oct 26', dayShort: 'Mon' },
  { date: '2026-10-27', label: 'Oct 27', dayShort: 'Tue' },
  { date: '2026-10-28', label: 'Oct 28', dayShort: 'Wed' },
  { date: '2026-10-29', label: 'Oct 29', dayShort: 'Thu' },
  { date: '2026-10-30', label: 'Oct 30', dayShort: 'Fri' },
  { date: '2026-11-02', label: 'Nov 02', dayShort: 'Mon' },
  { date: '2026-11-03', label: 'Nov 03', dayShort: 'Tue' },
  { date: '2026-11-04', label: 'Nov 04', dayShort: 'Wed' },
  { date: '2026-11-05', label: 'Nov 05', dayShort: 'Thu' },
  { date: '2026-11-06', label: 'Nov 06', dayShort: 'Fri' },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  // AP Calculus BC (calc-bc-p2)
  {
    id: 'asg-calc-1',
    courseId: 'calc-bc-p2',
    title: 'Improper Integrals & L’Hôpital Limit Proofs',
    shortCode: 'PS-06',
    category: 'Problem Sets',
    maxPoints: 50,
    dueDate: '2026-10-28',
    urgency: 'completed',
    description: 'Analytical convergence proofs for Type I and Type II improper integrals.',
  },
  {
    id: 'asg-calc-2',
    courseId: 'calc-bc-p2',
    title: 'Euler’s Method & Slope Field Numerical Lab',
    shortCode: 'LAB-04',
    category: 'Lab & Inquiry',
    maxPoints: 100,
    dueDate: '2026-11-01',
    urgency: 'completed',
    description: 'Computational modeling of differential equations with step-size error analysis.',
  },
  {
    id: 'asg-calc-3',
    courseId: 'calc-bc-p2',
    title: 'Unit 5 Exam: Integration by Parts & Partial Fractions',
    shortCode: 'EXAM-05',
    category: 'Unit Assessments',
    maxPoints: 100,
    dueDate: '2026-11-03',
    urgency: 'completed',
    description: 'Closed-note summative assessment covering advanced anti-differentiation techniques.',
  },
  {
    id: 'asg-calc-4',
    courseId: 'calc-bc-p2',
    title: 'Infinite Series & Ratio Test Colloquium',
    shortCode: 'SEM-03',
    category: 'Seminar & Synthesis',
    maxPoints: 40,
    dueDate: '2026-11-05',
    urgency: 'completed',
    description: 'Board presentation defending harmonic, alternating, and p-series convergence.',
  },
  {
    id: 'asg-calc-5',
    courseId: 'calc-bc-p2',
    title: 'Taylor & Maclaurin Polynomial Approximation Set',
    shortCode: 'PS-07',
    category: 'Problem Sets',
    maxPoints: 50,
    dueDate: '2026-11-07',
    urgency: 'due-soon',
    description: 'Deriving power series expansions and bounding Lagrange remainder terms.',
  },
  {
    id: 'asg-calc-6',
    courseId: 'calc-bc-p2',
    title: 'Parametric Arc Length & Polar Area Practicum',
    shortCode: 'LAB-05',
    category: 'Lab & Inquiry',
    maxPoints: 100,
    dueDate: '2026-11-12',
    urgency: 'in-progress',
    description: 'Vector trajectory curvature and polar integration design synthesis.',
  },

  // Honors Physics (phys-hon-p4)
  {
    id: 'asg-phys-1',
    courseId: 'phys-hon-p4',
    title: 'Work-Energy Theorem & Non-Conservative Force Set',
    shortCode: 'PS-05',
    category: 'Problem Sets',
    maxPoints: 50,
    dueDate: '2026-10-29',
    urgency: 'completed',
    description: 'Quantitative energy bar charts and variable friction path integrals.',
  },
  {
    id: 'asg-phys-2',
    courseId: 'phys-hon-p4',
    title: 'Ballistic Pendulum & Momentum Conservation Lab',
    shortCode: 'LAB-06',
    category: 'Lab & Inquiry',
    maxPoints: 100,
    dueDate: '2026-11-03',
    urgency: 'completed',
    description: 'Photogate velocity telemetry and inelastic collision uncertainty bounds.',
  },
  {
    id: 'asg-phys-3',
    courseId: 'phys-hon-p4',
    title: 'Midterm Practicum: Rotational Dynamics & Torque',
    shortCode: 'EXAM-04',
    category: 'Unit Assessments',
    maxPoints: 100,
    dueDate: '2026-11-06',
    urgency: 'due-soon',
    description: 'Moment of inertia derivations, angular momentum conservation, and rolling motion.',
  },
  {
    id: 'asg-phys-4',
    courseId: 'phys-hon-p4',
    title: 'Simple Harmonic Oscillator Phase Analysis',
    shortCode: 'SEM-02',
    category: 'Seminar & Synthesis',
    maxPoints: 40,
    dueDate: '2026-11-10',
    urgency: 'in-progress',
    description: 'Peer defense of damped spring-mass resonance graphs.',
  },

  // AP Statistical Inference (stat-ap-p6)
  {
    id: 'asg-stat-1',
    courseId: 'stat-ap-p6',
    title: 'Binomial & Geometric Random Variables Set',
    shortCode: 'PS-08',
    category: 'Problem Sets',
    maxPoints: 50,
    dueDate: '2026-10-30',
    urgency: 'completed',
    description: 'Discrete probability distributions, expected value, and variance transformations.',
  },
  {
    id: 'asg-stat-2',
    courseId: 'stat-ap-p6',
    title: 'Central Limit Theorem Monte Carlo Simulation',
    shortCode: 'LAB-05',
    category: 'Lab & Inquiry',
    maxPoints: 100,
    dueDate: '2026-11-04',
    urgency: 'completed',
    description: 'Sampling distribution normality verification across skewed parent populations.',
  },
  {
    id: 'asg-stat-3',
    courseId: 'stat-ap-p6',
    title: 'Unit 4 Assessment: Confidence Intervals for Proportions',
    shortCode: 'EXAM-04',
    category: 'Unit Assessments',
    maxPoints: 100,
    dueDate: '2026-11-07',
    urgency: 'due-soon',
    description: 'One- and two-sample z-intervals, margin of error sizing, and p-value interpretation.',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-01',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-014',
    firstName: 'Maya',
    lastName: 'Lin-kovsky',
    email: 'm.linkovsky@northfield.edu',
    seat: 'Row A · Desk 01',
    avatarSeed: 1,
    streakDays: 19,
    momentumScore: 96,
    momentumDeltaWeek: 5,
    currentMilestone: 'Lagrange Error Bound Mastery',
    milestoneProgress: 92,
    guardianName: 'Dr. David Lin-kovsky',
    guardianRelation: 'Father',
    guardianEmail: 'd.linkovsky@alumni.mit.edu',
    guardianPhone: '(415) 891-4402',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:41' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:42' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:39' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:43' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:38' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:39' },
    ],
    grades: {
      'asg-calc-1': { score: 49, status: 'submitted', submittedAt: 'Oct 28 · 08:15', feedback: 'Elegant squeeze theorem transition.' },
      'asg-calc-2': { score: 98, status: 'submitted', submittedAt: 'Oct 31 · 19:40', feedback: 'Clear Python slope field plots.' },
      'asg-calc-3': { score: 96, status: 'submitted', submittedAt: 'Nov 03 · 09:45', feedback: 'Flawless tabular integration.' },
      'asg-calc-4': { score: 40, status: 'submitted', submittedAt: 'Nov 05 · 09:10', feedback: 'Led peer Q&A on alternating series.' },
      'asg-calc-5': { score: 48, status: 'submitted', submittedAt: 'Nov 06 · 07:30', feedback: 'Submitted 24h ahead of deadline.' },
      'asg-calc-6': { score: 95, status: 'submitted', submittedAt: 'Nov 06 · 08:10' },
    },
  },
  {
    id: 'stu-02',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-028',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@northfield.edu',
    seat: 'Row A · Desk 03',
    avatarSeed: 2,
    streakDays: 12,
    momentumScore: 88,
    momentumDeltaWeek: 7,
    currentMilestone: 'Partial Fraction Decomposition Speed',
    milestoneProgress: 84,
    guardianName: 'Elena Vance',
    guardianRelation: 'Mother',
    guardianEmail: 'elena.vance@bayhealth.org',
    guardianPhone: '(415) 309-8821',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:44' },
      { date: '2026-10-27', label: 'Oct 27', status: 'late', arrivalTime: '08:52', note: 'Bus route 14 delay' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:42' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:41' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:43' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:44' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:40' },
    ],
    grades: {
      'asg-calc-1': { score: 45, status: 'submitted', submittedAt: 'Oct 28 · 08:40' },
      'asg-calc-2': { score: 91, status: 'submitted', submittedAt: 'Nov 01 · 16:12' },
      'asg-calc-3': { score: 89, status: 'submitted', submittedAt: 'Nov 03 · 09:48', feedback: 'Strong improvement from Unit 4 (+11 pts).' },
      'asg-calc-4': { score: 38, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: 46, status: 'submitted', submittedAt: 'Nov 06 · 08:05' },
      'asg-calc-6': { score: null, status: 'submitted' },
    },
  },
  {
    id: 'stu-03',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-041',
    firstName: 'Sora',
    lastName: 'Takahashi',
    email: 's.takahashi@northfield.edu',
    seat: 'Row B · Desk 02',
    avatarSeed: 3,
    streakDays: 24,
    momentumScore: 94,
    momentumDeltaWeek: 4,
    currentMilestone: 'Parametric Vector Synthesis',
    milestoneProgress: 90,
    guardianName: 'Kenji Takahashi',
    guardianRelation: 'Father',
    guardianEmail: 'ktakahashi@kento-arch.jp',
    guardianPhone: '(415) 744-1903',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:38' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:40' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:39' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:41' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:37' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:39' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:38' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:37' },
    ],
    grades: {
      'asg-calc-1': { score: 48, status: 'submitted', submittedAt: 'Oct 27 · 21:00' },
      'asg-calc-2': { score: 95, status: 'submitted', submittedAt: 'Oct 31 · 20:15' },
      'asg-calc-3': { score: 93, status: 'submitted', submittedAt: 'Nov 03 · 09:45' },
      'asg-calc-4': { score: 39, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: 47, status: 'submitted', submittedAt: 'Nov 06 · 07:55' },
      'asg-calc-6': { score: 92, status: 'submitted', submittedAt: 'Nov 06 · 08:00' },
    },
  },
  {
    id: 'stu-04',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-053',
    firstName: 'Julian',
    lastName: 'Okafor',
    email: 'j.okafor@northfield.edu',
    seat: 'Row B · Desk 04',
    avatarSeed: 4,
    streakDays: 3,
    momentumScore: 68,
    momentumDeltaWeek: -6,
    currentMilestone: 'Complete Euler Lab Revisions & Series Proofs',
    milestoneProgress: 52,
    guardianName: 'Chidinma Okafor',
    guardianRelation: 'Mother',
    guardianEmail: 'c.okafor@pacificlegal.com',
    guardianPhone: '(415) 612-3390',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:44' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:45' },
      { date: '2026-10-28', label: 'Oct 28', status: 'absent', note: 'Varsity debate travel' },
      { date: '2026-10-29', label: 'Oct 29', status: 'late', arrivalTime: '08:56', note: 'Morning traffic' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:44' },
      { date: '2026-11-02', label: 'Nov 02', status: 'late', arrivalTime: '08:54', note: 'Overslept after tournament' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:43' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:44' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-06', label: 'Nov 06', status: 'late', arrivalTime: '08:51', note: 'Arrived 6m after bell' },
    ],
    grades: {
      'asg-calc-1': { score: 39, status: 'late', submittedAt: 'Oct 30 · 14:20', feedback: 'Check improper bound limit notation.' },
      'asg-calc-2': { score: 76, status: 'late', submittedAt: 'Nov 03 · 22:10', feedback: 'Missing step-size h=0.05 table.' },
      'asg-calc-3': { score: 78, status: 'submitted', submittedAt: 'Nov 03 · 09:50', feedback: 'Sign error on trigonometric substitution.' },
      'asg-calc-4': { score: 35, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: null, status: 'missing', feedback: 'Due tomorrow — scheduled study hall check-in.' },
      'asg-calc-6': { score: null, status: 'submitted' },
    },
  },
  {
    id: 'stu-05',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-067',
    firstName: 'Amara',
    lastName: 'Chen-Patel',
    email: 'a.chenpatel@northfield.edu',
    seat: 'Row C · Desk 01',
    avatarSeed: 5,
    streakDays: 15,
    momentumScore: 91,
    momentumDeltaWeek: 8,
    currentMilestone: 'Alternating Series Estimation Theorem',
    milestoneProgress: 88,
    guardianName: 'Vikram Patel',
    guardianRelation: 'Father',
    guardianEmail: 'vpatel@solaris-ventures.io',
    guardianPhone: '(415) 522-9180',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:42' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:41' },
      { date: '2026-10-28', label: 'Oct 28', status: 'excused', note: 'Orthodontist appointment' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:40' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:39' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:40' },
    ],
    grades: {
      'asg-calc-1': { score: 46, status: 'submitted', submittedAt: 'Oct 28 · 08:30' },
      'asg-calc-2': { score: 94, status: 'submitted', submittedAt: 'Nov 01 · 11:05' },
      'asg-calc-3': { score: 91, status: 'submitted', submittedAt: 'Nov 03 · 09:45' },
      'asg-calc-4': { score: 39, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: 45, status: 'submitted', submittedAt: 'Nov 06 · 08:20' },
      'asg-calc-6': { score: 90, status: 'submitted', submittedAt: 'Nov 06 · 08:25' },
    },
  },
  {
    id: 'stu-06',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-079',
    firstName: 'Lucas',
    lastName: 'Bergström',
    email: 'l.bergstrom@northfield.edu',
    seat: 'Row C · Desk 03',
    avatarSeed: 6,
    streakDays: 6,
    momentumScore: 77,
    momentumDeltaWeek: 3,
    currentMilestone: 'Integration by Parts Sign Discipline',
    milestoneProgress: 70,
    guardianName: 'Ingrid Bergström',
    guardianRelation: 'Mother',
    guardianEmail: 'ingrid@nordicdesign.se',
    guardianPhone: '(415) 901-2745',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:44' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:43' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:44' },
      { date: '2026-10-29', label: 'Oct 29', status: 'absent', note: 'Seasonal flu — note on file' },
      { date: '2026-10-30', label: 'Oct 30', status: 'excused', note: 'Medical recovery' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:43' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:44' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:42' },
    ],
    grades: {
      'asg-calc-1': { score: 42, status: 'submitted', submittedAt: 'Oct 28 · 08:44' },
      'asg-calc-2': { score: 85, status: 'submitted', submittedAt: 'Nov 02 · 08:15' },
      'asg-calc-3': { score: 83, status: 'submitted', submittedAt: 'Nov 03 · 09:49' },
      'asg-calc-4': { score: 36, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: 41, status: 'submitted', submittedAt: 'Nov 06 · 08:30' },
      'asg-calc-6': { score: null, status: 'submitted' },
    },
  },
  {
    id: 'stu-07',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-084',
    firstName: 'Zoe',
    lastName: 'Alvarez',
    email: 'z.alvarez@northfield.edu',
    seat: 'Row D · Desk 01',
    avatarSeed: 7,
    streakDays: 1,
    momentumScore: 62,
    momentumDeltaWeek: -9,
    currentMilestone: 'Make-Up Unit 5 Retake & Taylor Series Prep',
    milestoneProgress: 45,
    guardianName: 'Mateo Alvarez',
    guardianRelation: 'Father',
    guardianEmail: 'malvarez@sfwater.gov',
    guardianPhone: '(415) 488-6019',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:45' },
      { date: '2026-10-27', label: 'Oct 27', status: 'late', arrivalTime: '08:55' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:44' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:45' },
      { date: '2026-10-30', label: 'Oct 30', status: 'absent', note: 'Unexcused absence' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:44' },
      { date: '2026-11-03', label: 'Nov 03', status: 'late', arrivalTime: '08:58', note: 'Arrived 13m late for Unit Exam' },
      { date: '2026-11-04', label: 'Nov 04', status: 'absent', note: 'Family errand — pending note' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:43' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:44' },
    ],
    grades: {
      'asg-calc-1': { score: 36, status: 'late', submittedAt: 'Oct 29 · 16:00' },
      'asg-calc-2': { score: 72, status: 'late', submittedAt: 'Nov 04 · 08:30', feedback: 'Incomplete slope field analysis on Q4.' },
      'asg-calc-3': { score: 69, status: 'submitted', submittedAt: 'Nov 03 · 09:50', feedback: 'Eligible for Friday afternoon exam correction.' },
      'asg-calc-4': { score: 33, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: null, status: 'missing', feedback: 'Not yet started in portal.' },
      'asg-calc-6': { score: null, status: 'missing' },
    },
  },
  {
    id: 'stu-08',
    courseId: 'calc-bc-p2',
    studentCode: 'AM-2026-092',
    firstName: 'Liam',
    lastName: 'Kowalski',
    email: 'l.kowalski@northfield.edu',
    seat: 'Row D · Desk 03',
    avatarSeed: 8,
    streakDays: 14,
    momentumScore: 86,
    momentumDeltaWeek: 4,
    currentMilestone: 'Radius & Interval of Convergence Proofs',
    milestoneProgress: 81,
    guardianName: 'Hannah Kowalski',
    guardianRelation: 'Mother',
    guardianEmail: 'hkowalski@ucsf.edu',
    guardianPhone: '(415) 377-5120',
    attendance: [
      { date: '2026-10-26', label: 'Oct 26', status: 'present', arrivalTime: '08:42' },
      { date: '2026-10-27', label: 'Oct 27', status: 'present', arrivalTime: '08:43' },
      { date: '2026-10-28', label: 'Oct 28', status: 'present', arrivalTime: '08:41' },
      { date: '2026-10-29', label: 'Oct 29', status: 'present', arrivalTime: '08:42' },
      { date: '2026-10-30', label: 'Oct 30', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-02', label: 'Nov 02', status: 'present', arrivalTime: '08:43' },
      { date: '2026-11-03', label: 'Nov 03', status: 'present', arrivalTime: '08:41' },
      { date: '2026-11-04', label: 'Nov 04', status: 'present', arrivalTime: '08:42' },
      { date: '2026-11-05', label: 'Nov 05', status: 'present', arrivalTime: '08:40' },
      { date: '2026-11-06', label: 'Nov 06', status: 'present', arrivalTime: '08:41' },
    ],
    grades: {
      'asg-calc-1': { score: 44, status: 'submitted', submittedAt: 'Oct 28 · 08:30' },
      'asg-calc-2': { score: 89, status: 'submitted', submittedAt: 'Nov 01 · 14:50' },
      'asg-calc-3': { score: 87, status: 'submitted', submittedAt: 'Nov 03 · 09:46' },
      'asg-calc-4': { score: 37, status: 'submitted', submittedAt: 'Nov 05 · 09:10' },
      'asg-calc-5': { score: 44, status: 'submitted', submittedAt: 'Nov 06 · 08:15' },
      'asg-calc-6': { score: 88, status: 'submitted', submittedAt: 'Nov 06 · 08:35' },
    },
  },

  // Honors Physics (phys-hon-p4)
  {
    id: 'stu-09',
    courseId: 'phys-hon-p4',
    studentCode: 'AM-2026-105',
    firstName: 'Nadia',
    lastName: 'El-Amin',
    email: 'n.elamin@northfield.edu',
    seat: 'Lab Bench 1A',
    avatarSeed: 9,
    streakDays: 21,
    momentumScore: 95,
    momentumDeltaWeek: 6,
    currentMilestone: 'Rotational Inertia Tensor Synthesis',
    milestoneProgress: 94,
    guardianName: 'Tariq El-Amin',
    guardianRelation: 'Father',
    guardianEmail: 'telamin@bayarea-aero.com',
    guardianPhone: '(415) 629-7741',
    attendance: SCHOOL_DATES.map((d) => ({
      date: d.date,
      label: d.label,
      status: 'present',
      arrivalTime: '11:11',
    })),
    grades: {
      'asg-phys-1': { score: 49, status: 'submitted', submittedAt: 'Oct 29 · 11:00' },
      'asg-phys-2': { score: 97, status: 'submitted', submittedAt: 'Nov 03 · 10:45' },
      'asg-phys-3': { score: 95, status: 'submitted', submittedAt: 'Nov 06 · 11:10' },
      'asg-phys-4': { score: 39, status: 'submitted', submittedAt: 'Nov 06 · 11:12' },
    },
  },
  {
    id: 'stu-10',
    courseId: 'phys-hon-p4',
    studentCode: 'AM-2026-112',
    firstName: 'Devon',
    lastName: 'Brooks',
    email: 'd.brooks@northfield.edu',
    seat: 'Lab Bench 2B',
    avatarSeed: 10,
    streakDays: 8,
    momentumScore: 81,
    momentumDeltaWeek: 5,
    currentMilestone: 'Angular Momentum Vector Cross Products',
    milestoneProgress: 76,
    guardianName: 'Monique Brooks',
    guardianRelation: 'Mother',
    guardianEmail: 'mbrooks@sfgeneral.org',
    guardianPhone: '(415) 812-3904',
    attendance: SCHOOL_DATES.map((d, idx) => ({
      date: d.date,
      label: d.label,
      status: idx === 1 ? 'late' : 'present',
      arrivalTime: idx === 1 ? '11:21' : '11:13',
    })),
    grades: {
      'asg-phys-1': { score: 43, status: 'submitted', submittedAt: 'Oct 29 · 11:10' },
      'asg-phys-2': { score: 88, status: 'submitted', submittedAt: 'Nov 03 · 11:14' },
      'asg-phys-3': { score: 84, status: 'submitted', submittedAt: 'Nov 06 · 11:15' },
      'asg-phys-4': { score: null, status: 'submitted' },
    },
  },
  {
    id: 'stu-11',
    courseId: 'phys-hon-p4',
    studentCode: 'AM-2026-119',
    firstName: 'Clara',
    lastName: 'Lindqvist',
    email: 'c.lindqvist@northfield.edu',
    seat: 'Lab Bench 3A',
    avatarSeed: 11,
    streakDays: 4,
    momentumScore: 73,
    momentumDeltaWeek: -3,
    currentMilestone: 'Ballistic Pendulum Error Propagation',
    milestoneProgress: 61,
    guardianName: 'Anders Lindqvist',
    guardianRelation: 'Father',
    guardianEmail: 'anders@lindqvist-studio.com',
    guardianPhone: '(415) 294-6612',
    attendance: SCHOOL_DATES.map((d, idx) => ({
      date: d.date,
      label: d.label,
      status: idx === 4 ? 'absent' : idx === 7 ? 'late' : 'present',
      arrivalTime: idx === 7 ? '11:24' : '11:14',
    })),
    grades: {
      'asg-phys-1': { score: 40, status: 'submitted', submittedAt: 'Oct 29 · 11:15' },
      'asg-phys-2': { score: 78, status: 'late', submittedAt: 'Nov 04 · 16:00' },
      'asg-phys-3': { score: null, status: 'missing' },
      'asg-phys-4': { score: null, status: 'submitted' },
    },
  },

  // AP Statistical Inference (stat-ap-p6)
  {
    id: 'stu-12',
    courseId: 'stat-ap-p6',
    studentCode: 'AM-2026-204',
    firstName: 'Ethan',
    lastName: 'Mercer',
    email: 'e.mercer@northfield.edu',
    seat: 'Pod 1 · Seat B',
    avatarSeed: 12,
    streakDays: 17,
    momentumScore: 92,
    momentumDeltaWeek: 5,
    currentMilestone: 'Two-Proportion Z-Interval Power Analysis',
    milestoneProgress: 89,
    guardianName: 'Claire Mercer',
    guardianRelation: 'Mother',
    guardianEmail: 'cmercer@mercerlaw.com',
    guardianPhone: '(415) 703-1189',
    attendance: SCHOOL_DATES.map((d) => ({
      date: d.date,
      label: d.label,
      status: 'present',
      arrivalTime: '13:41',
    })),
    grades: {
      'asg-stat-1': { score: 48, status: 'submitted', submittedAt: 'Oct 30 · 13:30' },
      'asg-stat-2': { score: 95, status: 'submitted', submittedAt: 'Nov 04 · 13:20' },
      'asg-stat-3': { score: 92, status: 'submitted', submittedAt: 'Nov 06 · 13:00' },
    },
  },
  {
    id: 'stu-13',
    courseId: 'stat-ap-p6',
    studentCode: 'AM-2026-219',
    firstName: 'Priya',
    lastName: 'Sundaram',
    email: 'p.sundaram@northfield.edu',
    seat: 'Pod 2 · Seat A',
    avatarSeed: 13,
    streakDays: 11,
    momentumScore: 87,
    momentumDeltaWeek: 4,
    currentMilestone: 'Monte Carlo R-Script Vectorization',
    milestoneProgress: 83,
    guardianName: 'Rajan Sundaram',
    guardianRelation: 'Father',
    guardianEmail: 'rajan@sundaram-analytics.com',
    guardianPhone: '(415) 589-4021',
    attendance: SCHOOL_DATES.map((d, idx) => ({
      date: d.date,
      label: d.label,
      status: idx === 3 ? 'excused' : 'present',
      arrivalTime: '13:42',
    })),
    grades: {
      'asg-stat-1': { score: 45, status: 'submitted', submittedAt: 'Oct 30 · 13:40' },
      'asg-stat-2': { score: 91, status: 'submitted', submittedAt: 'Nov 04 · 13:40' },
      'asg-stat-3': { score: 88, status: 'submitted', submittedAt: 'Nov 06 · 13:10' },
    },
  },
];

export const INITIAL_INSIGHTS: BehavioralInsight[] = [
  {
    id: 'ins-101',
    studentId: 'stu-01',
    courseId: 'calc-bc-p2',
    timestamp: 'Today · 09:18 AM',
    dateISO: '2026-11-06',
    category: 'Conceptual Breakthrough',
    tone: 'milestone',
    momentumDelta: 8,
    observation:
      'Derived the alternating series remainder bound independently during warm-up and walked two tablemates through bounding the 5th-degree Maclaurin error term.',
    actionItem: 'Invite Maya to present her geometric proof at Monday’s Math Circle.',
    actionCompleted: false,
    guardianNotified: true,
  },
  {
    id: 'ins-102',
    studentId: 'stu-04',
    courseId: 'calc-bc-p2',
    timestamp: 'Today · 08:54 AM',
    dateISO: '2026-11-06',
    category: 'Deadline Check-in',
    tone: 'warning',
    momentumDelta: -4,
    observation:
      'Arrived 6 minutes after the bell following varsity debate travel; PS-07 (Taylor Polynomials) has not been started yet and Euler Lab step-size table needs revision.',
    actionItem: 'Hold 15-minute structured conference during Friday 7th-period advising.',
    actionCompleted: false,
    guardianNotified: false,
  },
  {
    id: 'ins-103',
    studentId: 'stu-02',
    courseId: 'calc-bc-p2',
    timestamp: 'Yesterday · 09:35 AM',
    dateISO: '2026-11-05',
    category: 'Collaborative Leadership',
    tone: 'positive',
    momentumDelta: 6,
    observation:
      'Co-facilitated the Ratio Test board defense with remarkable composure. Jumped +11 points between Unit 4 and Unit 5 assessments after adopting structured error logs.',
    actionItem: 'Send positive momentum note to Elena Vance.',
    actionCompleted: true,
    guardianNotified: true,
  },
  {
    id: 'ins-104',
    studentId: 'stu-07',
    courseId: 'calc-bc-p2',
    timestamp: 'Nov 04 · 02:10 PM',
    dateISO: '2026-11-04',
    category: 'Attention & Pacing',
    tone: 'warning',
    momentumDelta: -6,
    observation:
      'Missed Wednesday session and arrived 13m late for the Unit 5 Exam on Tuesday. Demonstrated strong intuition on partial fractions when unhurried, but time pressure caused sign slips.',
    actionItem: 'Schedule Unit 5 exam correction session & share pacing checklist with guardian.',
    actionCompleted: false,
    guardianNotified: true,
  },
  {
    id: 'ins-105',
    studentId: 'stu-05',
    courseId: 'calc-bc-p2',
    timestamp: 'Nov 04 · 09:22 AM',
    dateISO: '2026-11-04',
    category: 'Peer Mentorship',
    tone: 'positive',
    momentumDelta: 5,
    observation:
      'Paired with Lucas to debug his Python Euler step-size script without giving away the analytical solution. Exemplary collaborative patience.',
    guardianNotified: true,
  },
  {
    id: 'ins-106',
    studentId: 'stu-03',
    courseId: 'calc-bc-p2',
    timestamp: 'Nov 03 · 09:48 AM',
    dateISO: '2026-11-03',
    category: 'Deep Focus',
    tone: 'positive',
    momentumDelta: 4,
    observation:
      'Completed Unit 5 Exam with 12 minutes to spare and verified every indefinite integral via differentiation check.',
    guardianNotified: false,
  },
  {
    id: 'ins-107',
    studentId: 'stu-09',
    courseId: 'phys-hon-p4',
    timestamp: 'Today · 11:40 AM',
    dateISO: '2026-11-06',
    category: 'Conceptual Breakthrough',
    tone: 'milestone',
    momentumDelta: 7,
    observation:
      'Connected conservation of angular momentum directly to Kepler’s second law during rotational practicum.',
    guardianNotified: true,
  },
  {
    id: 'ins-108',
    studentId: 'stu-12',
    courseId: 'stat-ap-p6',
    timestamp: 'Yesterday · 02:15 PM',
    dateISO: '2026-11-05',
    category: 'Collaborative Leadership',
    tone: 'positive',
    momentumDelta: 5,
    observation:
      'Built an interactive sampling distribution visualizer in R and shared the template with Pod 1.',
    guardianNotified: true,
  },
];

export function calculateStudentCourseGrade(
  student: Student,
  assignments: Assignment[],
  categoryWeights: Record<AssignmentCategory, number>
): {
  percentage: number;
  letter: string;
  completedCount: number;
  missingCount: number;
  categoryBreakdown: Record<AssignmentCategory, number | null>;
} {
  const courseAssignments = assignments.filter((a) => a.courseId === student.courseId);
  const categories: AssignmentCategory[] = [
    'Problem Sets',
    'Lab & Inquiry',
    'Unit Assessments',
    'Seminar & Synthesis',
  ];

  let totalActiveWeight = 0;
  let weightedSum = 0;
  let completedCount = 0;
  let missingCount = 0;

  const categoryBreakdown: Record<AssignmentCategory, number | null> = {
    'Problem Sets': null,
    'Lab & Inquiry': null,
    'Unit Assessments': null,
    'Seminar & Synthesis': null,
  };

  for (const cat of categories) {
    const catAssignments = courseAssignments.filter((a) => a.category === cat);
    let earnedPoints = 0;
    let possiblePoints = 0;

    for (const asg of catAssignments) {
      const entry = student.grades[asg.id];
      if (!entry) continue;
      if (entry.status === 'missing') {
        missingCount++;
      }
      if (entry.score !== null && entry.status !== 'excused') {
        earnedPoints += entry.score;
        possiblePoints += asg.maxPoints;
        completedCount++;
      } else if (entry.status === 'missing' && asg.urgency === 'completed') {
        // Past-due missing counts as 0 out of maxPoints until made up
        possiblePoints += asg.maxPoints;
      }
    }

    if (possiblePoints > 0) {
      const catPct = (earnedPoints / possiblePoints) * 100;
      categoryBreakdown[cat] = Math.round(catPct * 10) / 10;
      const weight = categoryWeights[cat] || 25;
      weightedSum += catPct * weight;
      totalActiveWeight += weight;
    }
  }

  const percentage =
    totalActiveWeight > 0 ? Math.round((weightedSum / totalActiveWeight) * 10) / 10 : 100;

  let letter = 'A';
  if (percentage >= 94) letter = 'A';
  else if (percentage >= 90) letter = 'A-';
  else if (percentage >= 87) letter = 'B+';
  else if (percentage >= 83) letter = 'B';
  else if (percentage >= 80) letter = 'B-';
  else if (percentage >= 77) letter = 'C+';
  else if (percentage >= 73) letter = 'C';
  else if (percentage >= 70) letter = 'C-';
  else if (percentage >= 65) letter = 'D';
  else letter = 'F';

  return {
    percentage,
    letter,
    completedCount,
    missingCount,
    categoryBreakdown,
  };
}

export function calculateAttendanceMetrics(student: Student): {
  attendanceRate: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  todayStatus: string;
} {
  const records = student.attendance;
  if (!records.length) {
    return {
      attendanceRate: 100,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      excusedCount: 0,
      todayStatus: 'present',
    };
  }

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let excusedCount = 0;

  for (const r of records) {
    if (r.status === 'present') presentCount++;
    else if (r.status === 'late') lateCount++;
    else if (r.status === 'absent') absentCount++;
    else if (r.status === 'excused') excusedCount++;
  }

  const effectiveTotal = Math.max(1, records.length - excusedCount);
  // Present counts 1.0, Late counts 0.85 toward attendance momentum rate
  const rawRate = ((presentCount + lateCount * 0.85) / effectiveTotal) * 100;
  const attendanceRate = Math.min(100, Math.round(rawRate * 10) / 10);
  const todayStatus = records[records.length - 1]?.status || 'present';

  return {
    attendanceRate,
    presentCount,
    lateCount,
    absentCount,
    excusedCount,
    todayStatus,
  };
}
