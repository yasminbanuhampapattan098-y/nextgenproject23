export type GoalCategory = 
  | 'Academic'
  | 'Career & Internship'
  | 'Certification'
  | 'Research & Thesis'
  | 'Campus Leadership'
  | 'Personal Wellness';

export type GoalPriority = 'High' | 'Medium' | 'Low';
export type GoalStatus = 'In Progress' | 'Completed' | 'Deferred';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  notes?: string;
}

export interface StudentGoal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  targetDate: string;
  startDate: string;
  milestones: Milestone[];
  loggedStudyHours: number;
  tags: string[];
}

export interface DegreeCourse {
  code: string;
  name: string;
  credits: number;
  grade?: string; // 'A', 'A-', 'B+', etc.
  status: 'Completed' | 'Enrolled' | 'Planned';
  semester: string;
}

export interface DegreeCategory {
  id: string;
  name: string;
  requiredCredits: number;
  completedCredits: number;
  courses: DegreeCourse[];
}

export type TicketCategory = 
  | 'Registrar & Records'
  | 'Career & Internship Office'
  | 'Financial Aid & Bursar'
  | 'Cloud Computing Labs'
  | 'Academic Advising & Petitions';

export type TicketPriority = 'Standard' | 'Elevated' | 'Urgent';
export type TicketStatus = 'Under Review' | 'Advisor Approved' | 'Action Required' | 'Resolved';

export interface TicketTimelineEvent {
  id: string;
  date: string;
  actor: string;
  action: string;
  message?: string;
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  submittedAt: string;
  lastUpdated: string;
  assignedOffice: string;
  timeline: TicketTimelineEvent[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'Transcript' | 'Verification' | 'Certification' | 'Financial' | 'Award';
  issueDate: string;
  issuer: string;
  verificationHash: string;
  fileSize: string;
  fileType: string;
  status: 'Verified' | 'Official' | 'Archived';
  description: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  office: string;
  specialties: string[];
  availableSlots: string[];
  initials: string;
}

export interface Appointment {
  id: string;
  advisorId: string;
  advisorName: string;
  date: string;
  timeSlot: string;
  format: 'Virtual Video Call' | 'In-Person (Campus Hall)';
  topic: string;
  linkedGoalId?: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled';
  meetingNotes?: string;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  email: string;
  major: string;
  specialization: string;
  academicYear: string;
  expectedGraduation: string;
  cumulativeGpa: number;
  targetGpa: number;
  completedCredits: number;
  totalCreditsRequired: number;
  currentStreakDays: number;
  totalFocusHours: number;
}
