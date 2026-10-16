import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROFILE, 
  INITIAL_GOALS, 
  INITIAL_DEGREE_CATEGORIES, 
  INITIAL_SERVICE_TICKETS, 
  INITIAL_DOCUMENTS, 
  INITIAL_ADVISORS, 
  INITIAL_APPOINTMENTS 
} from './data/initialData';
import { 
  StudentProfile, 
  StudentGoal, 
  DegreeCategory, 
  ServiceTicket, 
  DocumentRecord, 
  Advisor, 
  Appointment 
} from './types/student';
import { TopNav } from './components/TopNav';
import { QuickStatsStrip } from './components/QuickStatsStrip';
import { GoalList } from './components/GoalCenter/GoalList';
import { GoalModal } from './components/GoalCenter/GoalModal';
import { FocusSprintModal } from './components/GoalCenter/FocusSprintModal';
import { DegreeAuditView } from './components/DegreeAudit/DegreeAuditView';
import { ServiceTicketsView } from './components/ServicesHub/ServiceTicketsView';
import { AdvisingHubView } from './components/Advising/AdvisingHubView';
import { DocumentVaultView } from './components/Vault/DocumentVaultView';
import { ProfileModal } from './components/ProfileModal';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('goals');

  // Core Persistent State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ng_student_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [goals, setGoals] = useState<StudentGoal[]>(() => {
    const saved = localStorage.getItem('ng_student_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [degreeCategories, setDegreeCategories] = useState<DegreeCategory[]>(() => {
    const saved = localStorage.getItem('ng_degree_categories');
    return saved ? JSON.parse(saved) : INITIAL_DEGREE_CATEGORIES;
  });

  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(() => {
    const saved = localStorage.getItem('ng_service_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_TICKETS;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem('ng_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [advisors] = useState<Advisor[]>(INITIAL_ADVISORS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ng_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  // Modal States
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudentGoal | null>(null);
  const [isFocusSprintOpen, setIsFocusSprintOpen] = useState(false);
  const [activeTimerGoal, setActiveTimerGoal] = useState<StudentGoal | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ng_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ng_student_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('ng_degree_categories', JSON.stringify(degreeCategories));
  }, [degreeCategories]);

  useEffect(() => {
    localStorage.setItem('ng_service_tickets', JSON.stringify(serviceTickets));
  }, [serviceTickets]);

  useEffect(() => {
    localStorage.setItem('ng_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('ng_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Goal Operations
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allDone = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);
        const newlyCompleted = !g.milestones.find((m) => m.id === milestoneId)?.completed;

        showToast(
          newlyCompleted
            ? `Milestone marked achieved in "${g.title}"`
            : `Milestone reverted in "${g.title}"`
        );

        return {
          ...g,
          milestones: updatedMilestones,
          status: allDone ? 'Completed' : g.status === 'Completed' ? 'In Progress' : g.status,
        };
      })
    );
  };

  const handleAddMilestone = (goalId: string, milestoneTitle: string, dueDate: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newM = {
          id: `m-${Date.now()}-${Math.random()}`,
          title: milestoneTitle,
          dueDate: dueDate || g.targetDate,
          completed: false,
        };
        return {
          ...g,
          milestones: [...g.milestones, newM],
        };
      })
    );
    showToast(`Added action checkpoint to goal`);
  };

  const handleToggleGoalStatus = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextStatus = g.status === 'Completed' ? 'In Progress' : 'Completed';
        showToast(`Goal status updated to: ${nextStatus}`);
        return {
          ...g,
          status: nextStatus,
        };
      })
    );
  };

  const handleSaveGoal = (goalToSave: StudentGoal) => {
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === goalToSave.id);
      if (exists) {
        showToast(`Goal "${goalToSave.title}" updated`);
        return prev.map((g) => (g.id === goalToSave.id ? goalToSave : g));
      } else {
        showToast(`New goal created: "${goalToSave.title}"`);
        return [goalToSave, ...prev];
      }
    });
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    showToast('Goal deleted from roadmap');
  };

  const handleEditGoal = (goal: StudentGoal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  // Launch Pomodoro timer
  const handleLaunchTimer = (goal: StudentGoal) => {
    setActiveTimerGoal(goal);
    setIsFocusSprintOpen(true);
  };

  const handleLogStudyTime = (goalId: string, hoursAdded: number, sessionNote: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          loggedStudyHours: g.loggedStudyHours + hoursAdded,
        };
      })
    );
    setProfile((prev) => ({
      ...prev,
      totalFocusHours: prev.totalFocusHours + hoursAdded,
    }));
    showToast(`Logged +${hoursAdded.toFixed(1)} hrs towards goal progress!`);
  };

  // Degree Target update
  const handleUpdateTargetGpa = (newTarget: number) => {
    setProfile((prev) => ({
      ...prev,
      targetGpa: newTarget,
    }));
    showToast(`Graduation target GPA updated to ${newTarget.toFixed(2)}`);
  };

  // Ticket Operations
  const handleSubmitTicket = (ticket: ServiceTicket) => {
    setServiceTickets((prev) => [ticket, ...prev]);
    showToast(`Petition ${ticket.ticketNumber} submitted to department queue`);
  };

  const handleAddTicketComment = (ticketId: string, commentText: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setServiceTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newEvent = {
          id: `ev-${Date.now()}`,
          date: nowStr,
          actor: `${profile.name} (Student)`,
          action: 'Student Response Added',
          message: commentText,
        };
        return {
          ...t,
          lastUpdated: nowStr,
          timeline: [...t.timeline, newEvent],
        };
      })
    );
    showToast('Student message added to petition audit record');
  };

  // Advising Operations
  const handleBookAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
    showToast(`Consultation with ${apt.advisorName} confirmed`);
  };

  const handleCancelAppointment = (aptId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    showToast('Advising appointment cancelled');
  };

  // Document Vault Operations
  const handleRequestNewDocument = (doc: DocumentRecord) => {
    setDocuments((prev) => [doc, ...prev]);
    showToast(`Generated verifiable document: ${doc.title}`);
  };

  // Reset demo
  const handleResetDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setGoals(INITIAL_GOALS);
    setDegreeCategories(INITIAL_DEGREE_CATEGORIES);
    setServiceTickets(INITIAL_SERVICE_TICKETS);
    setDocuments(INITIAL_DOCUMENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    localStorage.clear();
    showToast('Reset all data to default senior engineering student state');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewGoalModal={() => {
          setEditingGoal(null);
          setIsGoalModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenFocusSprint={() => {
          setActiveTimerGoal(goals[0] || null);
          setIsFocusSprintOpen(true);
        }}
        profile={profile}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Achievement Summary Strip */}
        <QuickStatsStrip profile={profile} goals={goals} />

        {/* Tab 1: Goal Radar */}
        {activeTab === 'goals' && (
          <GoalList
            goals={goals}
            profile={profile}
            onToggleMilestone={handleToggleMilestone}
            onAddMilestone={handleAddMilestone}
            onToggleGoalStatus={handleToggleGoalStatus}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onLaunchTimer={handleLaunchTimer}
            onOpenNewGoalModal={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
          />
        )}

        {/* Tab 2: Degree Audit & GPA Simulator */}
        {activeTab === 'degree' && (
          <DegreeAuditView
            categories={degreeCategories}
            profile={profile}
            onUpdateTargetGpa={handleUpdateTargetGpa}
          />
        )}

        {/* Tab 3: Student Services & Petitions Helpdesk */}
        {activeTab === 'services' && (
          <ServiceTicketsView
            tickets={serviceTickets}
            onSubmitTicket={handleSubmitTicket}
            onAddComment={handleAddTicketComment}
          />
        )}

        {/* Tab 4: Advising Hub & Mentorship Network */}
        {activeTab === 'advising' && (
          <AdvisingHubView
            advisors={advisors}
            appointments={appointments}
            goals={goals}
            onBookAppointment={handleBookAppointment}
            onCancelAppointment={handleCancelAppointment}
          />
        )}

        {/* Tab 5: Document & Verification Vault */}
        {activeTab === 'vault' && (
          <DocumentVaultView
            documents={documents}
            profile={profile}
            onRequestNewDocument={handleRequestNewDocument}
          />
        )}
      </main>

      {/* Global Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        initialGoal={editingGoal}
      />

      <FocusSprintModal
        isOpen={isFocusSprintOpen}
        onClose={() => setIsFocusSprintOpen(false)}
        goals={goals}
        activeGoal={activeTimerGoal}
        onLogStudyTime={handleLogStudyTime}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        goals={goals}
        degreeCategories={degreeCategories}
        appointments={appointments}
        onUpdateProfile={(updated) => {
          setProfile(updated);
          showToast('Student credentials updated');
        }}
        onResetData={handleResetDemoData}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1120] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">NextGen Cloud Student Services Portal</span>
            <span aria-hidden="true">·</span>
            <span>Academic & Goal Achievement Architecture</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              System Diagnostics & Export
            </button>
            <span aria-hidden="true" className="text-slate-800">|</span>
            <span className="font-mono text-[11px] text-slate-400">
              Cloud Host: ais-run-2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
