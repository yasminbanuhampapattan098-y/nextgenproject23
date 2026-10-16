import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Send,
  Building,
  UserCheck
} from 'lucide-react';
import { ServiceTicket, TicketCategory, TicketPriority } from '../../types/student';

interface ServiceTicketsViewProps {
  tickets: ServiceTicket[];
  onSubmitTicket: (ticket: ServiceTicket) => void;
  onAddComment: (ticketId: string, comment: string) => void;
}

const TICKET_CATEGORIES: TicketCategory[] = [
  'Academic Advising & Petitions',
  'Registrar & Records',
  'Cloud Computing Labs',
  'Career & Internship Office',
  'Financial Aid & Bursar',
];

export const ServiceTicketsView: React.FC<ServiceTicketsViewProps> = ({
  tickets,
  onSubmitTicket,
  onAddComment,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [commentInput, setCommentInput] = useState<string>('');

  // Form State for new ticket
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Academic Advising & Petitions');
  const [priority, setPriority] = useState<TicketPriority>('Standard');
  const [description, setDescription] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const ticketNum = `SRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTicket: ServiceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: ticketNum,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: 'Under Review',
      submittedAt: nowStr,
      lastUpdated: nowStr,
      assignedOffice: category === 'Cloud Computing Labs' 
        ? 'High-Performance Cloud Computing Labs' 
        : category === 'Registrar & Records'
        ? 'Office of the University Registrar'
        : 'Department Academic Review Board',
      timeline: [
        {
          id: `ev-${Date.now()}`,
          date: nowStr,
          actor: 'Sarah Chen (Student)',
          action: 'Ticket Submitted to Portal',
          message: 'Request received into queue for administrative review.',
        },
      ],
    };

    onSubmitTicket(newTicket);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketModalOpen(false);
    setSubject('');
    setDescription('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedTicket) return;
    onAddComment(selectedTicket.id, commentInput.trim());
    setCommentInput('');
  };

  const filteredTickets = tickets.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">Cloud Services Desk</span>
              <span aria-hidden="true">·</span>
              <span>Campus Registrations & Administrative Petitions</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Student Requests & Department Petitions
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Submit and monitor official university petitions, graduate course overrides, cloud compute allocations, and international CPT/OPT verifications.
            </p>
          </div>

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Service Petition</span>
          </button>
        </div>
      </div>

      {/* Ticket Management Split: Master list on left, Detail timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tickets List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2 px-1 text-xs">
            <span className="font-medium text-slate-400">
              Petitions in Progress ({filteredTickets.length})
            </span>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {TICKET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono tabular-nums">
                    <span className="font-semibold text-indigo-400">{ticket.ticketNumber}</span>
                    <span className="text-[11px]">{ticket.lastUpdated}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                    {ticket.subject}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 font-mono">
                    <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                      {ticket.category}
                    </span>
                    <span
                      className={`font-sans font-medium text-xs ${
                        ticket.status === 'Resolved'
                          ? 'text-emerald-400'
                          : ticket.status === 'Advisor Approved'
                          ? 'text-sky-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Ticket Detail & Status Timeline (7 cols) */}
        {selectedTicket ? (
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Top Info */}
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums">
                <span className="text-indigo-400 font-bold">{selectedTicket.ticketNumber}</span>
                <span className="text-slate-400">
                  Priority: <strong className={selectedTicket.priority === 'Urgent' ? 'text-red-400' : 'text-slate-200'}>{selectedTicket.priority}</strong>
                </span>
                <span className="text-slate-400">
                  Submitted: {selectedTicket.submittedAt}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {selectedTicket.subject}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Assigned Office: {selectedTicket.assignedOffice}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                {selectedTicket.description}
              </p>
            </div>

            {/* Department Action Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Department Review Timeline & Audit Trail</span>
              </h4>

              <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {selectedTicket.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500" />

                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                        <span className="font-semibold text-slate-200">{event.actor}</span>
                        <span>{event.date}</span>
                      </div>
                      <p className="font-semibold text-indigo-300 text-xs mb-0.5">
                        {event.action}
                      </p>
                      {event.message && (
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {event.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment / Follow-up Action */}
            <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Add Student Follow-up Note or Supporting Information
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Type an update or question for the reviewing officer..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs">
            Select a petition from the left column to inspect its resolution timeline.
          </div>
        )}
      </div>

      {/* New Service Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Submit University Service Petition
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official Academic & Student Affairs Workflow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Department Service Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {TICKET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject Line <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Late Add Override Request for Distributed Systems Lab"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Standard">Standard (3–5 business days)</option>
                  <option value="Elevated">Elevated (1–2 business days)</option>
                  <option value="Urgent">Urgent (Immediate add/drop deadline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Justification & Background <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete context, prerequisite completion details, course codes, and justification..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  File Official Petition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
