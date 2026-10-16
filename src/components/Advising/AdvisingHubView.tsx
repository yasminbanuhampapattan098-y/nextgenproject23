import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Plus, 
  X, 
  CheckCircle2, 
  Mail, 
  Target,
  ExternalLink
} from 'lucide-react';
import { Advisor, Appointment, StudentGoal } from '../../types/student';

interface AdvisingHubViewProps {
  advisors: Advisor[];
  appointments: Appointment[];
  goals: StudentGoal[];
  onBookAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export const AdvisingHubView: React.FC<AdvisingHubViewProps> = ({
  advisors,
  appointments,
  goals,
  onBookAppointment,
  onCancelAppointment,
}) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(advisors[0]?.id || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [meetingFormat, setMeetingFormat] = useState<'Virtual Video Call' | 'In-Person (Campus Hall)'>('Virtual Video Call');
  const [topic, setTopic] = useState<string>('');
  const [linkedGoalId, setLinkedGoalId] = useState<string>('');
  const [meetingNotes, setMeetingNotes] = useState<string>('');

  const currentAdvisor = advisors.find((a) => a.id === selectedAdvisorId) || advisors[0];

  const handleOpenBookingForAdvisor = (advisorId: string) => {
    setSelectedAdvisorId(advisorId);
    const adv = advisors.find((a) => a.id === advisorId);
    if (adv && adv.availableSlots.length > 0) {
      setSelectedTimeSlot(adv.availableSlots[0]);
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      advisorId: currentAdvisor.id,
      advisorName: currentAdvisor.name,
      date: bookingDate,
      timeSlot: selectedTimeSlot || currentAdvisor.availableSlots[0] || '10:00 AM',
      format: meetingFormat,
      topic: topic.trim(),
      linkedGoalId: linkedGoalId || undefined,
      status: 'Confirmed',
      meetingNotes: meetingNotes.trim() || undefined,
    };

    onBookAppointment(newAppointment);
    setIsBookingModalOpen(false);
    setTopic('');
    setMeetingNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">Academic & Career Mentorship</span>
              <span aria-hidden="true">·</span>
              <span>Cloud Faculty Advisory Network</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Advising Consultations & Goal Mentorship
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Book dedicated 1-on-1 strategy sessions with department chairs, career coordinators, and research directors directly connected to your active milestones.
            </p>
          </div>

          <button
            onClick={() => handleOpenBookingForAdvisor(advisors[0]?.id || '')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Advising Session</span>
          </button>
        </div>
      </div>

      {/* Upcoming Confirmed Appointments */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Scheduled Advising Consultations ({appointments.length})</span>
        </h3>

        {appointments.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No upcoming sessions booked. Select a faculty member below to reserve a consultation slot.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => {
              const linkedGoal = goals.find((g) => g.id === apt.linkedGoalId);
              return (
                <div
                  key={apt.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400">
                        {apt.advisorName}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {apt.topic}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{apt.status}</span>
                    </div>
                  </div>

                  {/* Date & Mode info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono tabular-nums">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {apt.timeSlot}
                    </span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="flex items-center gap-1 font-sans text-slate-400">
                      {apt.format.includes('Virtual') ? <Video className="w-3.5 h-3.5 text-sky-400" /> : <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                      {apt.format}
                    </span>
                  </div>

                  {/* Linked goal if present */}
                  {linkedGoal && (
                    <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80 text-xs flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-slate-400">Aligned with:</span>
                      <span className="text-slate-200 font-medium truncate">{linkedGoal.title}</span>
                    </div>
                  )}

                  {apt.meetingNotes && (
                    <p className="text-xs text-slate-400 italic">
                      "{apt.meetingNotes}"
                    </p>
                  )}

                  {/* Card actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => alert(`Launching university secure video room for session with ${apt.advisorName}...`)}
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      <span>Join Room Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onCancelAppointment(apt.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Cancel Consultation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Faculty Advisors Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Available Faculty Advisors & Career Coordinators
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {advisor.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {advisor.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {advisor.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{advisor.office}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{advisor.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Specialties:
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {advisor.specialties.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block font-mono">
                  {advisor.availableSlots.length} open slots this week
                </span>
                <button
                  onClick={() => handleOpenBookingForAdvisor(advisor.id)}
                  className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors text-center"
                >
                  Book with {advisor.name.split(' ')[1] || advisor.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Schedule Advising Consultation
                  </h3>
                  <p className="text-xs text-slate-400">
                    NextGen Cloud Student Services Network
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Selected Advisor
                </label>
                <select
                  value={selectedAdvisorId}
                  onChange={(e) => setSelectedAdvisorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {advisors.map((adv) => (
                    <option key={adv.id} value={adv.id}>
                      {adv.name} ({adv.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Available Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot || currentAdvisor.availableSlots[0]}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {currentAdvisor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Meeting Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeetingFormat('Virtual Video Call')}
                    className={`py-2 px-3 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                      meetingFormat === 'Virtual Video Call'
                        ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Virtual Video Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingFormat('In-Person (Campus Hall)')}
                    className={`py-2 px-3 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                      meetingFormat === 'In-Person (Campus Hall)'
                        ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Person Office</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Connect Consultation with Active Goal (Optional)
                </label>
                <select
                  value={linkedGoalId}
                  onChange={(e) => setLinkedGoalId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">-- No specific goal --</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      [{g.category}] {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Consultation Topic <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Senior Capstone System Architecture Review"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preparation Notes & Discussion Questions
                </label>
                <textarea
                  rows={2}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Key questions, specific course codes, or draft files to review..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Confirm & Sync Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
