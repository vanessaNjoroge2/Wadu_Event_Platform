import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Smartphone,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart2,
  Eye,
  MousePointerClick,
  Users,
  ChevronRight,
  X,
  Sparkles,
  Calendar,
  Filter,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
  ArrowRight,
  FileText,
  Bell,
  Check,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type CampaignType = "EMAIL" | "WHATSAPP" | "SMS";
type CampaignStatus = "DRAFT" | "SCHEDULED" | "RUNNING" | "PAUSED" | "COMPLETED";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  eventName: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  scheduledAt: string;
  createdAt: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "EA Tech Summit — VIP Invitation", type: "EMAIL", status: "RUNNING", eventName: "EA Tech Summit 2025", audienceSize: 320, sent: 280, delivered: 276, opened: 148, clicked: 62, converted: 18, scheduledAt: "2025-07-10 09:00", createdAt: "2025-07-09" },
  { id: "c2", name: "AfroFest Nairobi — WhatsApp Blast", type: "WHATSAPP", status: "COMPLETED", eventName: "AfroFest Nairobi 2025", audienceSize: 180, sent: 180, delivered: 175, opened: 168, clicked: 84, converted: 31, scheduledAt: "2025-07-08 10:00", createdAt: "2025-07-07" },
  { id: "c3", name: "Startup Weekend — SMS Reminder", type: "SMS", status: "SCHEDULED", eventName: "Startup Weekend Nairobi", audienceSize: 500, sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, scheduledAt: "2025-07-15 08:00", createdAt: "2025-07-12" },
  { id: "c4", name: "Lagos Beats — Follow-up Email", type: "EMAIL", status: "DRAFT", eventName: "Lagos Beats Festival", audienceSize: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, scheduledAt: "—", createdAt: "2025-07-12" },
  { id: "c5", name: "Fintech Forum — WhatsApp Invite", type: "WHATSAPP", status: "PAUSED", eventName: "East Africa Fintech Forum", audienceSize: 250, sent: 120, delivered: 118, opened: 88, clicked: 44, converted: 9, scheduledAt: "2025-07-11 14:00", createdAt: "2025-07-10" },
];

// ── Wizard config ──────────────────────────────────────────────────────────
const WIZARD_STEPS = ["Channel", "Audience", "Message", "Schedule"];

const channelConfig: Record<CampaignType, { icon: any; color: string; bg: string; label: string; desc: string }> = {
  EMAIL: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50", label: "Email Campaign", desc: "Personalized invitations with open & click tracking" },
  WHATSAPP: { icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50", label: "WhatsApp Blast", desc: "Rich messages with QR codes via WhatsApp Business API" },
  SMS: { icon: Smartphone, color: "text-orange-600", bg: "bg-orange-50", label: "SMS Campaign", desc: "High-deliverability bulk SMS across Africa" },
};

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: any }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600", icon: FileText },
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-600", icon: Clock },
  RUNNING: { label: "Running", color: "bg-emerald-100 text-emerald-600", icon: Play },
  PAUSED: { label: "Paused", color: "bg-amber-100 text-amber-600", icon: Pause },
  COMPLETED: { label: "Completed", color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
};

const AI_TEMPLATES: Record<CampaignType, string> = {
  EMAIL: `Hi {{name}},

We noticed your work at {{company}} in the {{industry}} space — and we think you'd love what we have planned.

You're invited to [EVENT NAME] — one of East Africa's premier gatherings for tech leaders and innovators.

📅 [DATE] · 📍 [LOCATION]

As someone shaping the future of {{industry}}, your presence would add incredible value to the conversation.

🎟️ Grab your ticket before they sell out:
[REGISTER NOW →]

Warm regards,
The WADU Events Team

P.S. Use code LEAD20 for 20% off your ticket.

[Unsubscribe]`,
  WHATSAPP: `👋 Hey {{name}}!

You're invited to *[EVENT NAME]* 🎉

📅 *Date:* [DATE]
📍 *Location:* [LOCATION]
🎫 *Tickets:* [PRICE]

We thought of you because of your amazing work at *{{company}}*.

Tap the link to register and get your QR ticket instantly:
🔗 [LINK]

Reply *STOP* to unsubscribe.`,
  SMS: `Hi {{name}}, you're invited to [EVENT NAME] on [DATE] at [LOCATION]. Register at [LINK] - use code LEAD20 for 20% off! Reply STOP to opt out.`,
};

// ── Helper components ──────────────────────────────────────────────────────
function StatPill({ label, value, color = "" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-base font-black ${color}`}>{value}</span>
      <span className="text-xs text-gray-400 uppercase font-black">{label}</span>
    </div>
  );
}

function DeliveryFunnel({ campaign }: { campaign: Campaign }) {
  const steps = [
    { label: "Audience", value: campaign.audienceSize, color: "#6C4DFF" },
    { label: "Sent", value: campaign.sent, color: "#00C2A8" },
    { label: "Delivered", value: campaign.delivered, color: "#3B82F6" },
    { label: "Opened", value: campaign.opened, color: "#F59E0B" },
    { label: "Clicked", value: campaign.clicked, color: "#EC4899" },
    { label: "Converted", value: campaign.converted, color: "#10B981" },
  ];
  const max = campaign.audienceSize || 1;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-xs font-black uppercase w-20 text-right text-gray-500">{s.label}</span>
          <div className="flex-1 h-5 bg-gray-100 rounded-none overflow-hidden border-2 border-wadu-black">
            <div className="h-full transition-all" style={{ width: `${(s.value / max) * 100}%`, background: s.color }} />
          </div>
          <span className="text-xs font-black w-10">{s.value.toLocaleString()}</span>
          {i > 0 && campaign.audienceSize > 0 && (
            <span className="text-xs text-gray-400 w-10">{Math.round((s.value / campaign.audienceSize) * 100)}%</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
interface Props {
  darkMode: boolean;
  events: { id: string; name: string }[];
}

export default function CampaignsView({ darkMode, events }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");

  // Wizard state
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardType, setWizardType] = useState<CampaignType>("EMAIL");
  const [wizardEvent, setWizardEvent] = useState(events[0]?.id ?? "");
  const [wizardName, setWizardName] = useState("");
  const [wizardMessage, setWizardMessage] = useState("");
  const [wizardScheduleType, setWizardScheduleType] = useState<"now" | "later">("now");
  const [wizardDate, setWizardDate] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const card = `rounded-none border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900" : "bg-white"}`;

  const filteredCampaigns = campaigns.filter(c => statusFilter === "ALL" || c.status === statusFilter);

  const handleGenerateAI = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setWizardMessage(AI_TEMPLATES[wizardType]);
      setAiGenerating(false);
    }, 1800);
  };

  const handleLaunchCampaign = () => {
    const eventObj = events.find(e => e.id === wizardEvent);
    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      name: wizardName || `${channelConfig[wizardType].label} Campaign`,
      type: wizardType,
      status: wizardScheduleType === "now" ? "RUNNING" : "SCHEDULED",
      eventName: eventObj?.name ?? "My Event",
      audienceSize: 150,
      sent: wizardScheduleType === "now" ? 150 : 0,
      delivered: wizardScheduleType === "now" ? 147 : 0,
      opened: 0, clicked: 0, converted: 0,
      scheduledAt: wizardScheduleType === "now" ? "Just now" : wizardDate,
      createdAt: new Date().toLocaleDateString(),
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowWizard(false);
    setWizardStep(0);
    setWizardName("");
    setWizardMessage("");
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === "RUNNING" ? "PAUSED" : c.status === "PAUSED" ? "RUNNING" : c.status }
        : c
    ));
  };

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase">Campaign Manager</h2>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Manage email, WhatsApp, and SMS campaigns for your events</p>
        </div>
        <button
          onClick={() => { setShowWizard(true); setWizardStep(0); }}
          className="flex items-center gap-2 bg-wadu-black hover:bg-gray-900 text-white px-5 py-3 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: campaigns.length, icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Running Now", value: campaigns.filter(c => c.status === "RUNNING").length, icon: Play, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Sent", value: campaigns.reduce((s, c) => s + c.sent, 0).toLocaleString(), icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Conversions", value: campaigns.reduce((s, c) => s + c.converted, 0), icon: CheckCircle2, color: "text-wadu-black", bg: "bg-yellow-50" },
        ].map(stat => (
          <div key={stat.label} className={`${card} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-black uppercase ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{stat.label}</span>
              <div className={`w-8 h-8 rounded-none ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={15} className={stat.color} />
              </div>
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {(["ALL", "RUNNING", "SCHEDULED", "PAUSED", "COMPLETED", "DRAFT"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-xs font-black uppercase rounded-none border-4 whitespace-nowrap transition ${statusFilter === s
              ? "bg-wadu-black text-white border-wadu-black shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]"
              : `border-wadu-black ${darkMode ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-white text-gray-600 hover:bg-gray-50"}`
            }`}
          >
            {s === "ALL" ? "All Campaigns" : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* ── Campaign Cards ── */}
      <div className="space-y-3">
        {filteredCampaigns.map(campaign => {
          const ch = channelConfig[campaign.type];
          const st = statusConfig[campaign.status];
          const openRate = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
          const clickRate = campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0;
          const convRate = campaign.audienceSize > 0 ? Math.round((campaign.converted / campaign.audienceSize) * 100) : 0;

          return (
            <div
              key={campaign.id}
              className={`${card} p-5 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] transition-all`}
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: icon + info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-none border-4 border-wadu-black flex items-center justify-center flex-shrink-0 ${ch.bg}`}>
                    <ch.icon size={20} className={ch.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black uppercase text-sm">{campaign.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1 ${st.color}`}>
                        <st.icon size={10} />{st.label}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{campaign.eventName} · {ch.label}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Calendar size={11} /><span>{campaign.scheduledAt}</span>
                      <span className="mx-1">·</span>
                      <Users size={11} /><span>{campaign.audienceSize} recipients</span>
                    </div>
                  </div>
                </div>

                {/* Right: stats + actions */}
                <div className="flex items-center gap-6 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  {campaign.status !== "DRAFT" && (
                    <div className="hidden md:flex items-center gap-6">
                      <StatPill label="Sent" value={campaign.sent} />
                      <StatPill label="Open Rate" value={`${openRate}%`} color={openRate > 40 ? "text-emerald-600" : "text-gray-700"} />
                      <StatPill label="CTR" value={`${clickRate}%`} color={clickRate > 15 ? "text-emerald-600" : "text-gray-700"} />
                      <StatPill label="Conversions" value={campaign.converted} color="text-wadu-black" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {(campaign.status === "RUNNING" || campaign.status === "PAUSED") && (
                      <button
                        onClick={() => handleToggleStatus(campaign.id)}
                        className={`w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center transition ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                      >
                        {campaign.status === "RUNNING" ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className={`w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center transition ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar (for running campaigns) */}
              {campaign.status === "RUNNING" && campaign.audienceSize > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-none overflow-hidden border-x-0 border-2 border-wadu-black">
                    <div className="h-full bg-wadu-black" style={{ width: `${(campaign.sent / campaign.audienceSize) * 100}%` }} />
                  </div>
                  <span className="text-xs font-black text-gray-400">{Math.round((campaign.sent / campaign.audienceSize) * 100)}% sent</span>
                </div>
              )}
            </div>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <div className={`${card} p-12 flex flex-col items-center text-center`}>
            <Send size={32} className="text-gray-300 mb-3" />
            <p className="font-black uppercase text-gray-400">No campaigns found</p>
            <button onClick={() => setShowWizard(true)} className="mt-4 flex items-center gap-2 bg-wadu-black text-white px-4 py-2.5 rounded-none font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
              <Plus size={13} /> Create First Campaign
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════
          CREATE CAMPAIGN WIZARD MODAL
      ════════════════════════════════════════════ */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowWizard(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-2xl border-4 border-wadu-black shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b-4 border-wadu-black ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <div>
                <h3 className="font-black uppercase">Create New Campaign</h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Step {wizardStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[wizardStep]}</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className={`px-6 py-3 border-b-4 border-wadu-black flex items-center gap-0 ${darkMode ? "bg-slate-800/50" : "bg-gray-50/50"}`}>
              {WIZARD_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-0 flex-1">
                  <div className={`flex items-center gap-2 flex-shrink-0`}>
                    <div className={`w-6 h-6 rounded-none border-2 border-wadu-black flex items-center justify-center text-xs font-black ${i < wizardStep ? "bg-wadu-black text-white" : i === wizardStep ? "bg-wadu-yellow text-white border-wadu-black" : `${darkMode ? "bg-slate-700 text-slate-400" : "bg-gray-100 text-gray-400"}`}`}>
                      {i < wizardStep ? <Check size={10} /> : i + 1}
                    </div>
                    <span className={`text-xs font-black uppercase ${i === wizardStep ? "text-wadu-black" : "text-gray-400"}`}>{step}</span>
                  </div>
                  {i < WIZARD_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < wizardStep ? "bg-wadu-black" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="px-6 py-6 min-h-[280px]">

              {/* Step 0: Channel */}
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-black uppercase text-gray-400 mb-4">Choose your outreach channel</p>
                  <div className="grid grid-cols-3 gap-4">
                    {(["EMAIL", "WHATSAPP", "SMS"] as CampaignType[]).map(type => {
                      const ch = channelConfig[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setWizardType(type)}
                          className={`border-4 rounded-none p-5 flex flex-col items-center gap-3 text-center transition ${wizardType === type ? "border-wadu-black bg-wadu-black text-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]" : `border-wadu-black ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-700"}`}`}
                        >
                          <div className={`w-12 h-12 rounded-none ${wizardType === type ? "bg-white/20" : ch.bg} flex items-center justify-center`}>
                            <ch.icon size={22} className={wizardType === type ? "text-white" : ch.color} />
                          </div>
                          <div>
                            <p className="font-black uppercase text-sm">{ch.label}</p>
                            <p className={`text-xs mt-1 ${wizardType === type ? "text-white/70" : "text-gray-400"}`}>{ch.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1: Audience */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Campaign Name</label>
                    <input
                      value={wizardName}
                      onChange={e => setWizardName(e.target.value)}
                      placeholder="e.g. VIP Invitation — EA Tech Summit"
                      className={`w-full border-4 border-wadu-black rounded-none px-4 py-3 text-sm font-black uppercase outline-none ${darkMode ? "bg-slate-800 text-white placeholder:text-slate-500" : "bg-white text-gray-800 placeholder:text-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Target Event</label>
                    <select
                      value={wizardEvent}
                      onChange={e => setWizardEvent(e.target.value)}
                      className={`w-full border-4 border-wadu-black rounded-none px-4 py-3 text-sm font-black uppercase outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
                    >
                      {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                    </select>
                  </div>
                  <div className={`border-4 border-wadu-black rounded-none p-4 ${darkMode ? "bg-slate-800" : "bg-blue-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={14} className="text-wadu-black" />
                      <p className="text-xs font-black uppercase">Audience Source</p>
                    </div>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                      This campaign will use leads discovered via the Audience Discovery Engine. 10 leads are currently selected.
                      <button className="text-wadu-black underline ml-1 font-black">Change</button>
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Message */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black uppercase text-gray-400">Message Template</label>
                    <button
                      onClick={handleGenerateAI}
                      disabled={aiGenerating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-wadu-black text-white text-xs font-black uppercase rounded-none border-2 border-wadu-black shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] disabled:opacity-50 transition"
                    >
                      <Sparkles size={11} className={aiGenerating ? "animate-spin" : ""} />
                      {aiGenerating ? "Generating..." : "AI Generate"}
                    </button>
                  </div>
                  <textarea
                    value={wizardMessage}
                    onChange={e => setWizardMessage(e.target.value)}
                    placeholder={`Write your ${channelConfig[wizardType].label.toLowerCase()} message here, or click "AI Generate" to create one...`}
                    rows={10}
                    className={`w-full border-4 border-wadu-black rounded-none px-4 py-3 text-sm outline-none font-mono resize-none ${darkMode ? "bg-slate-800 text-white placeholder:text-slate-500" : "bg-white text-gray-800 placeholder:text-gray-300"}`}
                  />
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-400"}`}>
                    Use <code className="bg-gray-100 px-1 rounded font-black text-wadu-black">{"{{name}}"}</code>, <code className="bg-gray-100 px-1 rounded font-black text-wadu-black">{"{{company}}"}</code>, <code className="bg-gray-100 px-1 rounded font-black text-wadu-black">{"{{industry}}"}</code> for personalization.
                  </p>
                </div>
              )}

              {/* Step 3: Schedule */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <p className="text-sm font-black uppercase text-gray-400">When should this campaign go out?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {(["now", "later"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setWizardScheduleType(opt)}
                        className={`border-4 rounded-none p-5 flex flex-col gap-2 text-left transition ${wizardScheduleType === opt ? "border-wadu-black bg-wadu-black text-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]" : `border-wadu-black ${darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100"}`}`}
                      >
                        <div className={`w-8 h-8 rounded-none border-2 flex items-center justify-center ${wizardScheduleType === opt ? "border-white bg-white/20" : "border-wadu-black"}`}>
                          {opt === "now" ? <Send size={14} className={wizardScheduleType === opt ? "text-white" : ""} /> : <Bell size={14} className={wizardScheduleType === opt ? "text-white" : ""} />}
                        </div>
                        <div>
                          <p className="font-black uppercase text-sm">{opt === "now" ? "Send Now" : "Schedule Later"}</p>
                          <p className={`text-xs mt-0.5 ${wizardScheduleType === opt ? "text-white/70" : "text-gray-400"}`}>
                            {opt === "now" ? "Launch campaign immediately" : "Pick a date and time"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {wizardScheduleType === "later" && (
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Schedule Date & Time</label>
                      <input
                        type="datetime-local"
                        value={wizardDate}
                        onChange={e => setWizardDate(e.target.value)}
                        className={`w-full border-4 border-wadu-black rounded-none px-4 py-3 text-sm font-black outline-none ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
                      />
                    </div>
                  )}
                  {/* Summary */}
                  <div className={`border-4 border-wadu-black rounded-none p-4 space-y-2 ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                    <p className="text-xs font-black uppercase text-gray-400 mb-2">Campaign Summary</p>
                    {[
                      { label: "Name", value: wizardName || "(unnamed)" },
                      { label: "Channel", value: channelConfig[wizardType].label },
                      { label: "Event", value: events.find(e => e.id === wizardEvent)?.name ?? "—" },
                      { label: "Recipients", value: "10 leads selected" },
                      { label: "Launch", value: wizardScheduleType === "now" ? "Immediately" : (wizardDate || "Not set") },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="font-black uppercase text-gray-400 text-xs">{row.label}</span>
                        <span className="font-black uppercase text-xs">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t-4 border-wadu-black flex items-center justify-between ${darkMode ? "bg-slate-800/50" : "bg-gray-50"}`}>
              <button
                onClick={() => wizardStep === 0 ? setShowWizard(false) : setWizardStep(s => s - 1)}
                className={`px-5 py-2.5 border-4 border-wadu-black rounded-none font-black uppercase text-sm transition ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-white hover:bg-gray-100 text-gray-700"}`}
              >
                {wizardStep === 0 ? "Cancel" : "← Back"}
              </button>
              {wizardStep < WIZARD_STEPS.length - 1 ? (
                <button
                  onClick={() => setWizardStep(s => s + 1)}
                  className="flex items-center gap-2 bg-wadu-black hover:bg-gray-900 text-white px-6 py-2.5 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleLaunchCampaign}
                  className="flex items-center gap-2 bg-wadu-black hover:bg-gray-900 text-white px-6 py-2.5 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition"
                >
                  <Send size={14} /> {wizardScheduleType === "now" ? "Launch Campaign" : "Schedule Campaign"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          CAMPAIGN DETAIL DRAWER
      ════════════════════════════════════════════ */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedCampaign(null)}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
          <div
            className={`w-full max-w-lg border-l-4 border-wadu-black flex flex-col h-full overflow-y-auto shadow-[-8px_0_0_0_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b-4 border-wadu-black ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                {(() => { const ch = channelConfig[selectedCampaign.type]; return <div className={`w-9 h-9 rounded-none border-2 border-wadu-black ${ch.bg} flex items-center justify-center`}><ch.icon size={17} className={ch.color} /></div>; })()}
                <div>
                  <h3 className="font-black uppercase text-sm">{selectedCampaign.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase ${statusConfig[selectedCampaign.status].color}`}>{statusConfig[selectedCampaign.status].label}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6 flex-1">
              {/* Key Metrics */}
              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-3">Performance Metrics</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Send, label: "Sent", value: selectedCampaign.sent },
                    { icon: Eye, label: "Opened", value: selectedCampaign.opened },
                    { icon: MousePointerClick, label: "Clicked", value: selectedCampaign.clicked },
                    { icon: Users, label: "Audience", value: selectedCampaign.audienceSize },
                    { icon: CheckCircle2, label: "Delivered", value: selectedCampaign.delivered },
                    { icon: CheckCircle2, label: "Converted", value: selectedCampaign.converted, highlight: true },
                  ].map(m => (
                    <div key={m.label} className={`border-4 border-wadu-black rounded-none p-3 ${m.highlight ? "bg-wadu-black text-white" : darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                      <m.icon size={13} className={m.highlight ? "text-white mb-1" : "text-gray-400 mb-1"} />
                      <p className="text-lg font-black">{m.value}</p>
                      <p className="text-xs font-black uppercase text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Funnel */}
              {selectedCampaign.audienceSize > 0 && (
                <div>
                  <p className="text-xs font-black uppercase text-gray-400 mb-3">Delivery Funnel</p>
                  <DeliveryFunnel campaign={selectedCampaign} />
                </div>
              )}

              {/* Campaign Details */}
              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-3">Details</p>
                <div className="space-y-2">
                  {[
                    { label: "Event", value: selectedCampaign.eventName },
                    { label: "Channel", value: channelConfig[selectedCampaign.type].label },
                    { label: "Scheduled At", value: selectedCampaign.scheduledAt },
                    { label: "Created", value: selectedCampaign.createdAt },
                  ].map(d => (
                    <div key={d.label} className={`flex items-center justify-between py-2 border-b ${darkMode ? "border-slate-800" : "border-gray-100"}`}>
                      <span className="text-xs font-black uppercase text-gray-400">{d.label}</span>
                      <span className="text-xs font-black uppercase">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`px-6 py-5 border-t-4 border-wadu-black space-y-2 ${darkMode ? "bg-slate-800/50" : "bg-gray-50"}`}>
              {(selectedCampaign.status === "RUNNING" || selectedCampaign.status === "PAUSED") && (
                <button
                  onClick={() => { handleToggleStatus(selectedCampaign.id); setSelectedCampaign(null); }}
                  className="flex items-center justify-center gap-2 w-full border-4 border-wadu-black bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-3 rounded-none font-black uppercase text-sm transition"
                >
                  {selectedCampaign.status === "RUNNING" ? <><Pause size={14} /> Pause Campaign</> : <><Play size={14} /> Resume Campaign</>}
                </button>
              )}
              {selectedCampaign.status === "DRAFT" && (
                <button className="flex items-center justify-center gap-2 w-full bg-wadu-black hover:bg-gray-900 text-white px-4 py-3 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition">
                  <Send size={14} /> Launch Campaign
                </button>
              )}
              <button
                onClick={() => { setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id)); setSelectedCampaign(null); }}
                className="flex items-center justify-center gap-2 w-full border-4 border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-none font-black uppercase text-sm transition"
              >
                <Trash2 size={13} /> Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
