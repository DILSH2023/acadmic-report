import React, { useState } from 'react';
import {
  Check,
  Plus,
  Mail,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import {
  BehaviorCategory,
  BehavioralInsight,
  BehaviorTone,
  CourseSection,
  Student,
} from '../types/classroom';
import { PupilAvatar } from './PupilAvatar';

interface BehaviorInsightsViewProps {
  course: CourseSection;
  students: Student[];
  insights: BehavioralInsight[];
  onAddInsight: (newInsight: {
    studentId: string;
    category: BehaviorCategory;
    tone: BehaviorTone;
    momentumDelta: number;
    observation: string;
    actionItem?: string;
    guardianNotified: boolean;
  }) => void;
  onToggleInsightAction: (insightId: string) => void;
  onToggleGuardianNotified: (insightId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

const BEHAVIOR_Presets: {
  category: BehaviorCategory;
  tone: BehaviorTone;
  defaultDelta: number;
  promptHint: string;
}[] = [
  {
    category: 'Conceptual Breakthrough',
    tone: 'milestone',
    defaultDelta: 8,
    promptHint: 'Independent derivation, creative proof, or deep synthesis...',
  },
  {
    category: 'Collaborative Leadership',
    tone: 'positive',
    defaultDelta: 6,
    promptHint: 'Facilitating seminar discussion or lab bench coordination...',
  },
  {
    category: 'Peer Mentorship',
    tone: 'positive',
    defaultDelta: 5,
    promptHint: 'Coaching a tablemate through a challenging step...',
  },
  {
    category: 'Deep Focus',
    tone: 'positive',
    defaultDelta: 4,
    promptHint: 'Sustained problem-solving composure and verification...',
  },
  {
    category: 'Deadline Check-in',
    tone: 'warning',
    defaultDelta: -4,
    promptHint: 'Upcoming assignment milestone check-in or revision plan...',
  },
  {
    category: 'Attention & Pacing',
    tone: 'warning',
    defaultDelta: -5,
    promptHint: 'Rushed sign errors, fatigue, or pacing adjustment needed...',
  },
];

export const BehaviorInsightsView: React.FC<BehaviorInsightsViewProps> = ({
  course,
  students,
  insights,
  onAddInsight,
  onToggleInsightAction,
  onToggleGuardianNotified,
  onSelectStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<BehaviorCategory>(
    'Conceptual Breakthrough'
  );
  const [momentumDelta, setMomentumDelta] = useState<number>(8);
  const [observation, setObservation] = useState<string>('');
  const [actionItem, setActionItem] = useState<string>('');
  const [guardianNotified, setGuardianNotified] = useState<boolean>(true);

  const [filterTone, setFilterTone] = useState<'all' | 'positive' | 'warning' | 'pending-action'>('all');
  const [filterStudent, setFilterStudent] = useState<string>('all');

  const handleCategorySelect = (cat: BehaviorCategory) => {
    setSelectedCategory(cat);
    const preset = BEHAVIOR_Presets.find((p) => p.category === cat);
    if (preset) {
      setMomentumDelta(preset.defaultDelta);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim() || !selectedStudentId) return;
    const preset = BEHAVIOR_Presets.find((p) => p.category === selectedCategory);
    onAddInsight({
      studentId: selectedStudentId,
      category: selectedCategory,
      tone: preset?.tone || (momentumDelta >= 0 ? 'positive' : 'warning'),
      momentumDelta,
      observation: observation.trim(),
      actionItem: actionItem.trim() || undefined,
      guardianNotified,
    });
    setObservation('');
    setActionItem('');
  };

  const filteredInsights = insights.filter((ins) => {
    if (filterStudent !== 'all' && ins.studentId !== filterStudent) return false;
    if (filterTone === 'positive') return ins.tone === 'positive' || ins.tone === 'milestone';
    if (filterTone === 'warning') return ins.tone === 'warning';
    if (filterTone === 'pending-action')
      return Boolean(ins.actionItem && !ins.actionCompleted);
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 5 Columns: Real-Time Observation Composer */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-ambient space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            Record Behavioral Insight
          </h2>
          <p className="text-xs text-[#64748B]">
            Capture real-time classroom habits, breakthroughs, or supportive check-ins. Logging an observation updates pupil momentum immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pupil Selector */}
          <div>
            <label
              htmlFor="insight-pupil-select"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Select Pupil
            </label>
            <select
              id="insight-pupil-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-medium bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.seat} · Momentum {s.momentumScore})
                </option>
              ))}
            </select>
          </div>

          {/* Behavioral Dimension Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Behavioral Dimension
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BEHAVIOR_Presets.map((preset) => {
                const isSelected = selectedCategory === preset.category;
                return (
                  <button
                    key={preset.category}
                    type="button"
                    onClick={() => handleCategorySelect(preset.category)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#0F172A]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#464555] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {preset.category}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                          preset.defaultDelta >= 0
                            ? 'text-[#047857]'
                            : 'text-[#B45309]'
                        }`}
                      >
                        {preset.defaultDelta >= 0
                          ? `+${preset.defaultDelta}`
                          : preset.defaultDelta}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Momentum Delta Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label
                htmlFor="momentum-delta-range"
                className="font-semibold text-[#0F172A]"
              >
                Momentum Impact Adjustment
              </label>
              <span
                className={`font-mono font-bold tabular-nums ${
                  momentumDelta >= 0 ? 'text-[#047857]' : 'text-[#B45309]'
                }`}
              >
                {momentumDelta >= 0 ? `+${momentumDelta} pts` : `${momentumDelta} pts`}
              </span>
            </div>
            <input
              id="momentum-delta-range"
              type="range"
              min={-10}
              max={10}
              step={1}
              value={momentumDelta}
              onChange={(e) => setMomentumDelta(Number(e.target.value))}
              className="w-full accent-[#4F46E5]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#64748B] tabular-nums">
              <span>-10 (Support Needed)</span>
              <span>0 (Neutral Note)</span>
              <span>+10 (Breakthrough)</span>
            </div>
          </div>

          {/* Observation Narrative */}
          <div>
            <label
              htmlFor="insight-narrative"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Classroom Observation Details
            </label>
            <textarea
              id="insight-narrative"
              required
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder={
                BEHAVIOR_Presets.find((p) => p.category === selectedCategory)
                  ?.promptHint || 'Enter specific behavioral evidence...'
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          {/* Follow-up Action Item */}
          <div>
            <label
              htmlFor="insight-action-item"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Follow-Up Action or Milestone Step (Optional)
            </label>
            <input
              id="insight-action-item"
              type="text"
              value={actionItem}
              onChange={(e) => setActionItem(e.target.value)}
              placeholder="e.g., Review Q4 Taylor remainder bound during study hall"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          {/* Guardian Notification Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={guardianNotified}
              onChange={(e) => setGuardianNotified(e.target.checked)}
              className="w-4 h-4 rounded border-[#94A3B8] text-[#10B981] focus:ring-[#4F46E5]"
            />
            <span className="text-xs font-medium text-[#0F172A]">
              Include in weekly guardian momentum digest
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-transform active:scale-98 shadow-xs"
          >
            Save Behavioral Observation
          </button>
        </form>
      </div>

      {/* Right 7 Columns: Chronological Behavioral Stream */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Classroom Behavioral Timeline ({filteredInsights.length})
              </h3>
              <p className="text-xs text-[#64748B]">
                Longitudinal log of positive habit reinforcement and early intervention check-ins
              </p>
            </div>

            <select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              aria-label="Filter insights by pupil"
              className="text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="all">All Enrolled Pupils</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterTone('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterTone === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Logs ({insights.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTone('positive')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterTone === 'positive'
                  ? 'bg-white text-[#047857] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Breakthroughs & Praise
            </button>
            <button
              type="button"
              onClick={() => setFilterTone('warning')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterTone === 'warning'
                  ? 'bg-white text-[#B45309] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Support Check-ins
            </button>
            <button
              type="button"
              onClick={() => setFilterTone('pending-action')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterTone === 'pending-action'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Open Action Items
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {filteredInsights.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-[#0F172A]">
                No behavioral observations match this filter
              </p>
              <p className="text-xs text-[#64748B]">
                Use the form on the left to record a new classroom observation or reset filters.
              </p>
            </div>
          ) : (
            filteredInsights.map((item) => {
              const student = students.find((s) => s.id === item.studentId);
              return (
                <div key={item.id} className="p-5 hover:bg-[#F8FAFC]/60 transition-colors space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {student && (
                        <PupilAvatar
                          seed={student.avatarSeed}
                          firstName={student.firstName}
                          lastName={student.lastName}
                          size="md"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => student && onSelectStudent(student.id)}
                            className="text-sm font-bold text-[#0F172A] hover:text-[#4F46E5] transition-colors"
                          >
                            {student
                              ? `${student.firstName} ${student.lastName}`
                              : 'Enrolled Pupil'}
                          </button>
                          <span className="text-xs text-[#64748B]">·</span>
                          <span
                            className={`text-xs font-semibold ${
                              item.tone === 'warning'
                                ? 'text-[#B45309]'
                                : item.tone === 'milestone'
                                ? 'text-[#4F46E5]'
                                : 'text-[#047857]'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">
                          {item.timestamp}
                          {student ? ` · ${student.seat}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-mono text-sm font-bold tabular-nums ${
                          item.momentumDelta >= 0 ? 'text-[#047857]' : 'text-[#B45309]'
                        }`}
                      >
                        {item.momentumDelta >= 0
                          ? `+${item.momentumDelta} Momentum`
                          : `${item.momentumDelta} Momentum`}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#0F172A] leading-relaxed">
                    {item.observation}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    {item.actionItem ? (
                      <button
                        type="button"
                        onClick={() => onToggleInsightAction(item.id)}
                        className="inline-flex items-center gap-2 text-left group"
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                            item.actionCompleted
                              ? 'bg-[#10B981] border-[#10B981] text-white'
                              : 'border-[#94A3B8] bg-white group-hover:border-[#4F46E5]'
                          }`}
                        >
                          {item.actionCompleted && <Check className="w-3 h-3" />}
                        </span>
                        <span
                          className={`text-xs ${
                            item.actionCompleted
                              ? 'line-through text-[#64748B]'
                              : 'text-[#0F172A] font-semibold'
                          }`}
                        >
                          Follow-up: {item.actionItem}
                        </span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#64748B]">
                        No follow-up action required
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onToggleGuardianNotified(item.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        item.guardianNotified
                          ? 'text-[#047857]'
                          : 'text-[#64748B] hover:text-[#4F46E5]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {item.guardianNotified
                        ? 'Shared with Guardian'
                        : 'Share with Guardian'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
