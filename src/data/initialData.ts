import { StudentGoal, StudentProfile, DegreeCategory, ServiceTicket, DocumentRecord, Advisor, Appointment } from '../types/student';

export const INITIAL_PROFILE: StudentProfile = {
  name: "Sarah Chen",
  studentId: "NGS-2024-8841",
  email: "s.chen@student.clouduniversity.edu",
  major: "Computer Science & Engineering",
  specialization: "Cloud Infrastructure & Distributed Systems",
  academicYear: "Senior (4th Year)",
  expectedGraduation: "Spring 2027",
  cumulativeGpa: 3.82,
  targetGpa: 3.90,
  completedCredits: 98,
  totalCreditsRequired: 124,
  currentStreakDays: 19,
  totalFocusHours: 74.5,
};

export const INITIAL_GOALS: StudentGoal[] = [
  {
    id: "goal-urgent-capstone",
    title: "Submit Cloud Capstone Architecture Proposal to Advisory Board",
    description: "Finalize distributed storage benchmarks and submit signed proposal package before the departmental 48-hour deadline cutoff.",
    category: "Academic",
    priority: "High",
    status: "In Progress",
    startDate: "2026-10-01",
    targetDate: "2026-10-16",
    loggedStudyHours: 18.5,
    tags: ["Capstone", "Immediate Deadline", "Senior Defense"],
    milestones: [
      { id: "m-u1", title: "Complete multi-node Raft consensus latency benchmark runs", completed: true, dueDate: "2026-10-12", notes: "Completed 10,000 requests test run" },
      { id: "m-u2", title: "Faculty sponsorship sign-off with Dr. Aris Thorne", completed: true, dueDate: "2026-10-14", notes: "Approved with faculty endorsement letter" },
      { id: "m-u3", title: "Final PDF archive upload to Dean's Academic Review Portal", completed: false, dueDate: "2026-10-16" }
    ]
  },
  {
    id: "goal-1",
    title: "Achieve Dean's Honor Roll (3.85+ Term GPA)",
    description: "Secure straight A grades across core senior sequence including Distributed Systems and Cloud Architecture Capstone.",
    category: "Academic",
    priority: "High",
    status: "In Progress",
    startDate: "2026-09-01",
    targetDate: "2026-12-18",
    loggedStudyHours: 32.5,
    tags: ["Academics", "Senior Year", "GPA Target"],
    milestones: [
      { id: "m-101", title: "Score 92%+ on CS 481 Midterm (Distributed Consensus)", completed: true, dueDate: "2026-10-10", notes: "Achieved 95% on Raft & Paxos implementation" },
      { id: "m-102", title: "Submit Cloud Capstone Architecture Proposal to Advisory Board", completed: true, dueDate: "2026-10-18", notes: "Approved with high commendation" },
      { id: "m-103", title: "Complete Lab 4: Multi-region DynamoDB & Redis Caching Benchmark", completed: false, dueDate: "2026-11-04" },
      { id: "m-104", title: "Deliver Final Capstone System Defense Presentation", completed: false, dueDate: "2026-12-08" },
      { id: "m-105", title: "Final Comprehensive Exam & Project Archive Submission", completed: false, dueDate: "2026-12-16" }
    ]
  },
  {
    id: "goal-2",
    title: "Secure Summer 2027 Cloud DevOps & Infrastructure Fellowship",
    description: "Target top tier engineering residency programs in cloud infrastructure, Kubernetes engineering, and site reliability.",
    category: "Career & Internship",
    priority: "High",
    status: "In Progress",
    startDate: "2026-08-20",
    targetDate: "2026-11-30",
    loggedStudyHours: 18.0,
    tags: ["Career", "Internship", "DevOps"],
    milestones: [
      { id: "m-201", title: "Revise technical resume with university career coach Elena Rostova", completed: true, dueDate: "2026-09-12", notes: "Quantified production system metrics" },
      { id: "m-202", title: "Deploy live portfolio with real-time Kubernetes cluster demo", completed: true, dueDate: "2026-09-28" },
      { id: "m-203", title: "Submit 10 targeted applications to Cloud Tier-1 programs", completed: true, dueDate: "2026-10-14", notes: "Submitted 12 applications total" },
      { id: "m-204", title: "Complete Technical Systems Architecture On-Site Round with Mentor", completed: false, dueDate: "2026-11-05" },
      { id: "m-205", title: "Evaluate and sign finalized offer letter for fellowship", completed: false, dueDate: "2026-11-28" }
    ]
  },
  {
    id: "goal-3",
    title: "Earn AWS Solutions Architect Associate Certification",
    description: "Validate deep cloud architectural patterns, VPC peering, IAM role boundary enforcement, and serverless architectures.",
    category: "Certification",
    priority: "Medium",
    status: "In Progress",
    startDate: "2026-09-15",
    targetDate: "2026-11-22",
    loggedStudyHours: 14.0,
    tags: ["AWS", "Cloud", "Credentials"],
    milestones: [
      { id: "m-301", title: "Complete Domain 1: Design Resilient Architectures practice exam", completed: true, dueDate: "2026-10-02" },
      { id: "m-302", title: "Complete Domain 2: High-Performance Architecture Labs", completed: true, dueDate: "2026-10-14" },
      { id: "m-303", title: "Score 85%+ on full official practice simulation exam #2", completed: false, dueDate: "2026-10-30" },
      { id: "m-304", title: "Take official proctored AWS certification exam at campus testing center", completed: false, dueDate: "2026-11-18" }
    ]
  },
  {
    id: "goal-4",
    title: "Publish Undergraduate Paper on Serverless Distributed Pipelines",
    description: "Co-author paper with Dr. Thorne exploring cold-start mitigations and predictive auto-scaling in event-driven serverless mesh.",
    category: "Research & Thesis",
    priority: "Medium",
    status: "In Progress",
    startDate: "2026-08-01",
    targetDate: "2027-01-15",
    loggedStudyHours: 21.0,
    tags: ["Research", "Publishing", "Faculty Collab"],
    milestones: [
      { id: "m-401", title: "Synthesize empirical latency benchmarks across 10,000 cold invocations", completed: true, dueDate: "2026-09-20" },
      { id: "m-402", title: "Draft Section 3: Predictive Reinforcement Model & Empirical Setup", completed: true, dueDate: "2026-10-08" },
      { id: "m-403", title: "Dr. Thorne peer review and faculty revision round", completed: false, dueDate: "2026-11-12" },
      { id: "m-404", title: "Submit camera-ready manuscript to IEEE Student Research Symposium", completed: false, dueDate: "2026-12-20" }
    ]
  },
  {
    id: "goal-5",
    title: "Campus Peer Tutoring & Cloud Computing Club Mentorship",
    description: "Lead weekly hands-on Linux & Cloud containerization workshops for underclassmen engineering students.",
    category: "Campus Leadership",
    priority: "Low",
    status: "Completed",
    startDate: "2026-08-25",
    targetDate: "2026-10-15",
    loggedStudyHours: 12.0,
    tags: ["Leadership", "Workshops", "Mentorship"],
    milestones: [
      { id: "m-501", title: "Organize Docker & Container Orchestration Crash Course", completed: true, dueDate: "2026-09-05" },
      { id: "m-502", title: "Host 4 office hours for intro data structures students", completed: true, dueDate: "2026-09-22" },
      { id: "m-503", title: "Conduct Cloud Git & CI/CD pipeline hackathon for 35 freshmen", completed: true, dueDate: "2026-10-12" }
    ]
  }
];

export const INITIAL_DEGREE_CATEGORIES: DegreeCategory[] = [
  {
    id: "core-cs",
    name: "Core Computer Science Requirements",
    requiredCredits: 44,
    completedCredits: 44,
    courses: [
      { code: "CS 101", name: "Intro to Computer Science & Python", credits: 4, grade: "A", status: "Completed", semester: "Fall 2023" },
      { code: "CS 201", name: "Data Structures & Algorithm Analysis", credits: 4, grade: "A", status: "Completed", semester: "Spring 2024" },
      { code: "CS 250", name: "Computer Architecture & Assembly", credits: 4, grade: "A-", status: "Completed", semester: "Fall 2024" },
      { code: "CS 310", name: "Operating Systems Internals", credits: 4, grade: "A", status: "Completed", semester: "Spring 2025" },
      { code: "CS 320", name: "Database Systems & Data Modeling", credits: 4, grade: "A", status: "Completed", semester: "Fall 2025" },
      { code: "MATH 221", name: "Discrete Mathematics & Graph Theory", credits: 4, grade: "A", status: "Completed", semester: "Fall 2023" },
      { code: "MATH 240", name: "Linear Algebra & Vector Spaces", credits: 4, grade: "B+", status: "Completed", semester: "Spring 2024" },
      { code: "STAT 301", name: "Probability & Statistics for Engineers", credits: 4, grade: "A-", status: "Completed", semester: "Fall 2024" },
      { code: "CS 370", name: "Computer Networks & Protocols", credits: 4, grade: "A", status: "Completed", semester: "Spring 2025" },
      { code: "CS 380", name: "Software Engineering Methodologies", credits: 4, grade: "A", status: "Completed", semester: "Fall 2025" },
      { code: "CS 390", name: "Formal Languages & Automata", credits: 4, grade: "A-", status: "Completed", semester: "Spring 2026" }
    ]
  },
  {
    id: "cloud-track",
    name: "Cloud & Distributed Systems Specialization",
    requiredCredits: 32,
    completedCredits: 24,
    courses: [
      { code: "CS 455", name: "Distributed Systems & Consensus", credits: 4, grade: "A", status: "Completed", semester: "Spring 2026" },
      { code: "CS 460", name: "Cloud Computing Architectures", credits: 4, grade: "A", status: "Completed", semester: "Spring 2026" },
      { code: "CS 472", name: "Site Reliability & Cloud Infrastructure", credits: 4, grade: "A-", status: "Completed", semester: "Spring 2026" },
      { code: "CS 481", name: "Advanced Distributed Consensus & Fault Tolerance", credits: 4, status: "Enrolled", semester: "Fall 2026" },
      { code: "CS 488", name: "Cloud Security, IAM & Cryptography", credits: 4, status: "Enrolled", semester: "Fall 2026" },
      { code: "CS 495", name: "Senior Cloud Capstone Project I", credits: 4, status: "Enrolled", semester: "Fall 2026" },
      { code: "CS 496", name: "Senior Cloud Capstone Project II", credits: 4, status: "Planned", semester: "Spring 2027" },
      { code: "CS 499", name: "Undergraduate Honors Thesis Research", credits: 4, status: "Planned", semester: "Spring 2027" }
    ]
  },
  {
    id: "gen-ed",
    name: "General Education & Electives",
    requiredCredits: 48,
    completedCredits: 30,
    courses: [
      { code: "ENGL 110", name: "Academic Writing & Research Methods", credits: 4, grade: "A", status: "Completed", semester: "Fall 2023" },
      { code: "PHIL 230", name: "Ethics of Artificial Intelligence & Data", credits: 4, grade: "A", status: "Completed", semester: "Spring 2024" },
      { code: "ECON 101", name: "Principles of Microeconomics", credits: 4, grade: "B+", status: "Completed", semester: "Fall 2024" },
      { code: "PHYS 151", name: "University Physics I (Mechanics & Waves)", credits: 5, grade: "A-", status: "Completed", semester: "Spring 2024" },
      { code: "PHYS 152", name: "University Physics II (Electromagnetism)", credits: 5, grade: "B+", status: "Completed", semester: "Fall 2024" },
      { code: "COMM 205", name: "Technical Communication & Presentation", credits: 4, grade: "A", status: "Completed", semester: "Fall 2025" },
      { code: "POLS 210", name: "Science, Technology & Public Policy", credits: 4, status: "Enrolled", semester: "Fall 2026" },
      { code: "HUM 320", name: "Contemporary World History", credits: 4, status: "Planned", semester: "Spring 2027" },
      { code: "ARTS 105", name: "Digital Media Design & Visualization", credits: 4, status: "Planned", semester: "Spring 2027" },
      { code: "FREE 401", name: "Interdisciplinary Capstone Seminar", credits: 6, status: "Planned", semester: "Spring 2027" }
    ]
  }
];

export const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  {
    id: "tkt-001",
    ticketNumber: "SRV-2026-4491",
    category: "Academic Advising & Petitions",
    subject: "Graduate Cross-Registration Petition: CS 582 Advanced Cloud Systems",
    description: "Requesting department and Dean authorization to enroll in 500-level graduate research seminar in Spring 2027 while completing undergraduate senior honors thesis.",
    priority: "Elevated",
    status: "Advisor Approved",
    submittedAt: "2026-10-02 09:15",
    lastUpdated: "2026-10-12 14:30",
    assignedOffice: "Department of Computer Science Academic Board",
    timeline: [
      { id: "ev-1", date: "2026-10-02 09:15", actor: "Sarah Chen (Student)", action: "Ticket Submitted", message: "Form submitted with faculty sponsorship note from Dr. Thorne." },
      { id: "ev-2", date: "2026-10-05 11:20", actor: "Registrar Records Desk", action: "Prerequisite Verification", message: "Confirmed student meets 3.75+ GPA prerequisite threshold (3.82)." },
      { id: "ev-3", date: "2026-10-12 14:30", actor: "Dr. Aris Thorne (Faculty Chair)", action: "Department Endorsement", message: "Approved for enrollment. Forwarded to Dean of Graduate Studies for final registration override." }
    ]
  },
  {
    id: "tkt-002",
    ticketNumber: "SRV-2026-4512",
    category: "Cloud Computing Labs",
    subject: "HPC GPU Cluster Allocation Extension for Capstone Benchmark",
    description: "Requesting additional 1,000 GPU-hours allocation on the university Slurm compute cluster for testing distributed distributed Raft consensus under network partition faults.",
    priority: "Urgent",
    status: "Under Review",
    submittedAt: "2026-10-11 16:40",
    lastUpdated: "2026-10-14 08:20",
    assignedOffice: "High-Performance Computing Research Facilities",
    timeline: [
      { id: "ev-4", date: "2026-10-11 16:40", actor: "Sarah Chen (Student)", action: "Ticket Submitted", message: "Attached Slurm workload job profiles and faculty grant code." },
      { id: "ev-5", date: "2026-10-14 08:20", actor: "SysAdmin Cloud Team", action: "Resource Review", message: "Allocating partition compute pool on Cluster Node 04-B." }
    ]
  },
  {
    id: "tkt-003",
    ticketNumber: "SRV-2026-4210",
    category: "Career & Internship Office",
    subject: "Curricular Practical Training (CPT) Internship Credit Validation",
    description: "Official evaluation and credit approval for upcoming summer cloud engineering residency program.",
    priority: "Standard",
    status: "Resolved",
    submittedAt: "2026-09-18 10:00",
    lastUpdated: "2026-09-29 16:00",
    assignedOffice: "Office of Career Advancement & Cooperative Education",
    timeline: [
      { id: "ev-6", date: "2026-09-18 10:00", actor: "Sarah Chen (Student)", action: "Form Submitted" },
      { id: "ev-7", date: "2026-09-25 13:00", actor: "Elena Rostova (Career Advisor)", action: "Employer Verification Confirmed" },
      { id: "ev-8", date: "2026-09-29 16:00", actor: "Office of the Registrar", action: "Approved & Transcript Code Added", message: "Course CS 498-CPT formally stamped into graduation degree audit." }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-1",
    title: "Official Academic Transcript (Through Spring 2026)",
    category: "Transcript",
    issueDate: "2026-06-15",
    issuer: "Office of the University Registrar",
    verificationHash: "SHA256: 8f9b2a7c41e06d91f24d9c73e811bc0359871abf3170e28",
    fileSize: "248 KB",
    fileType: "PDF",
    status: "Official",
    description: "Sealed cryptographic transcript bearing the university registrar seal, semester-by-semester GPA record, and course credits."
  },
  {
    id: "doc-2",
    title: "Degree Verification & Enrollment Certification Letter",
    category: "Verification",
    issueDate: "2026-09-02",
    issuer: "Dean of Academic Services",
    verificationHash: "SHA256: 41b8a92f00e93ca2d9817f54c91a039b5671ef0812239d1",
    fileSize: "182 KB",
    fileType: "PDF",
    status: "Verified",
    description: "Certified documentation of full-time undergraduate enrollment in good standing, eligible for graduation in Spring 2027."
  },
  {
    id: "doc-3",
    title: "Dean's List Award of Academic Excellence (Spring 2026)",
    category: "Award",
    issueDate: "2026-06-20",
    issuer: "School of Engineering & Applied Sciences",
    verificationHash: "SHA256: 129a0f44bc998317e06a32df910088cb43187adbc902341",
    fileSize: "320 KB",
    fileType: "PDF",
    status: "Official",
    description: "Awarded to undergraduate scholars maintaining a semester grade point average of 3.80 or higher with zero incomplete grades."
  },
  {
    id: "doc-4",
    title: "Institutional Research Grant Authorization (#GR-2026-904)",
    category: "Financial",
    issueDate: "2026-08-28",
    issuer: "University Office of Sponsored Programs",
    verificationHash: "SHA256: c982310ab94751f08832aae4179bc289018471bade00473",
    fileSize: "195 KB",
    fileType: "PDF",
    status: "Official",
    description: "Funding stipend grant for undergraduate capstone compute infrastructure and conference submission publication fee coverage."
  }
];

export const INITIAL_ADVISORS: Advisor[] = [
  {
    id: "adv-1",
    name: "Dr. Aris Thorne",
    title: "Chief Academic Advisor & Associate Professor",
    department: "Computer Science & Cloud Systems",
    email: "a.thorne@clouduniversity.edu",
    office: "Turing Hall, Room 418",
    initials: "AT",
    specialties: ["Degree Audit & Requirements", "Cloud Research & Honors Thesis", "Graduate School Petitions"],
    availableSlots: ["Mon 10:00 AM", "Mon 02:00 PM", "Wed 11:30 AM", "Thu 03:00 PM"]
  },
  {
    id: "adv-2",
    name: "Elena Rostova",
    title: "Director of Industry Partnerships & Career Strategy",
    department: "Engineering Career Center",
    email: "e.rostova@clouduniversity.edu",
    office: "Founders Hall, Suite 210",
    initials: "ER",
    specialties: ["Technical Resume & Portfolio", "Big Tech Internship Placement", "CPT/OPT Work Authorization"],
    availableSlots: ["Tue 09:30 AM", "Tue 01:30 PM", "Thu 10:00 AM", "Fri 02:00 PM"]
  },
  {
    id: "adv-3",
    name: "Marcus Vance",
    title: "Senior Financial Aid & Scholarship Counselor",
    department: "Student Financial Services",
    email: "m.vance@clouduniversity.edu",
    office: "Student Commons, Room 104",
    initials: "MV",
    specialties: ["STEM Fellowship Grants", "FAFSA & Emergency Relief", "Tuition Payment Scheduling"],
    availableSlots: ["Mon 01:00 PM", "Wed 09:00 AM", "Wed 03:30 PM", "Fri 11:00 AM"]
  },
  {
    id: "adv-4",
    name: "Dr. Maya Patel",
    title: "Undergraduate Research Coordinator",
    department: "Interdisciplinary Research Institute",
    email: "m.patel@clouduniversity.edu",
    office: "Science Complex, Lab 302",
    initials: "MP",
    specialties: ["Conference Paper Submissions", "Lab Access Credentials", "Faculty Co-Authorship"],
    availableSlots: ["Tue 11:00 AM", "Wed 02:00 PM", "Thu 01:30 PM", "Fri 10:30 AM"]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    advisorId: "adv-1",
    advisorName: "Dr. Aris Thorne",
    date: "2026-10-21",
    timeSlot: "Wed 11:30 AM",
    format: "In-Person (Campus Hall)",
    topic: "Senior Capstone System Architecture Sign-off & Spring Course Overrides",
    linkedGoalId: "goal-1",
    status: "Confirmed",
    meetingNotes: "Bring architectural diagram for distributed cache consensus testbed."
  },
  {
    id: "apt-2",
    advisorId: "adv-2",
    advisorName: "Elena Rostova",
    date: "2026-10-27",
    timeSlot: "Tue 01:30 PM",
    format: "Virtual Video Call",
    topic: "Final Fellowship Technical Interview Dry Run & Offer Negotiation Prep",
    linkedGoalId: "goal-2",
    status: "Confirmed",
    meetingNotes: "Prepare 5-minute system design walkthrough of container cluster."
  }
];
