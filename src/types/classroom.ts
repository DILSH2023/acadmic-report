export type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent';

export type SubmissionStatus = 'submitted' | 'late' | 'missing' | 'excused';

export type AssignmentCategory =
  | 'Problem Sets'
  | 'Lab & Inquiry'
  | 'Unit Assessments'
  | 'Seminar & Synthesis';

export type BehaviorCategory =
  | 'Conceptual Breakthrough'
  | 'Collaborative Leadership'
  | 'Deep Focus'
  | 'Peer Mentorship'
  | 'Deadline Check-in'
  | 'Attention & Pacing';

export type BehaviorTone = 'positive' | 'milestone' | 'warning';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  label: string; // e.g., "Nov 06"
  status: AttendanceStatus;
  arrivalTime?: string;
  note?: string;
}

export interface GradeEntry {
  score: number | null;
  status: SubmissionStatus;
  submittedAt?: string;
  feedback?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  shortCode: string;
  category: AssignmentCategory;
  maxPoints: number;
  dueDate: string;
  urgency: 'completed' | 'due-soon' | 'in-progress';
  description: string;
}

export interface BehavioralInsight {
  id: string;
  studentId: string;
  courseId: string;
  timestamp: string;
  dateISO: string;
  category: BehaviorCategory;
  tone: BehaviorTone;
  momentumDelta: number;
  observation: string;
  actionItem?: string;
  actionCompleted?: boolean;
  guardianNotified: boolean;
}

export interface Student {
  id: string;
  courseId: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  seat: string;
  avatarSeed: number;
  streakDays: number;
  momentumScore: number; // 0 - 100
  momentumDeltaWeek: number; // e.g. +6 or -4
  currentMilestone: string;
  milestoneProgress: number; // 0 - 100
  guardianName: string;
  guardianRelation: string;
  guardianEmail: string;
  guardianPhone: string;
  attendance: AttendanceRecord[];
  grades: Record<string, GradeEntry>;
}

export interface CourseSection {
  id: string;
  code: string;
  name: string;
  period: string;
  room: string;
  schedule: string;
  termProgress: number;
  categoryWeights: Record<AssignmentCategory, number>;
}
