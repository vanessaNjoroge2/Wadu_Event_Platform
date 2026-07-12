import { useState, useEffect, useRef } from "react";
import {
  Search,
  Zap,
  Users,
  Building2,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  X,
  Star,
  Filter,
  Download,
  ChevronRight,
  Sparkles,
  Globe,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Plus,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  company: string;
  role: string;
  industry: string;
  location: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  score: number; // 0-100
  source: string;
  avatar: string;
  color: string;
}

interface DiscoveryConfig {
  eventId: string;
  industry: string;
  location: string;
  eventSize: string;
  budget: string;
}

// ── Mock leads data ────────────────────────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  { id: "l1", name: "Amara Osei", company: "Andela Kenya", role: "Head of Engineering", industry: "Tech", location: "Nairobi, Kenya", email: "amara.osei@andela.com", phone: "+254712345678", linkedin: "linkedin.com/in/amara-osei", score: 94, source: "LinkedIn", avatar: "AO", color: "#6C4DFF" },
  { id: "l2", name: "Fatima Al-Hassan", company: "Safaricom PLC", role: "Senior Product Manager", industry: "Telecom", location: "Nairobi, Kenya", email: "f.hassan@safaricom.co.ke", phone: "+254711234567", linkedin: "linkedin.com/in/fatima-alhassan", score: 88, source: "Company Website", avatar: "FA", color: "#00C2A8" },
  { id: "l3", name: "David Kimani", company: "Cellulant Corp", role: "VP of Partnerships", industry: "Fintech", location: "Nairobi, Kenya", email: "d.kimani@cellulant.io", phone: null, linkedin: "linkedin.com/in/david-kimani", score: 82, source: "Business Directory", avatar: "DK", color: "#F59E0B" },
  { id: "l4", name: "Nadia Mensah", company: "Jumia Group", role: "Marketing Director", industry: "E-Commerce", location: "Lagos, Nigeria", email: "n.mensah@jumia.com", phone: "+2348012345678", linkedin: "linkedin.com/in/nadia-mensah", score: 79, source: "LinkedIn", avatar: "NM", color: "#EC4899" },
  { id: "l5", name: "Emmanuel Kofi", company: "mPharma", role: "CEO & Co-Founder", industry: "Health Tech", location: "Accra, Ghana", email: "e.kofi@mpharma.com", phone: "+233244567890", linkedin: "linkedin.com/in/emmanuel-kofi", score: 76, source: "Startup Directory", avatar: "EK", color: "#3B82F6" },
  { id: "l6", name: "Zanele Dlamini", company: "Standard Bank Group", role: "Innovation Lead", industry: "Banking", location: "Johannesburg, SA", email: "z.dlamini@standardbank.co.za", phone: null, linkedin: "linkedin.com/in/zanele-dlamini", score: 71, source: "LinkedIn", avatar: "ZD", color: "#8B5CF6" },
  { id: "l7", name: "Kofi Acheampong", company: "Flutterwave", role: "Enterprise Sales Lead", industry: "Fintech", location: "Lagos, Nigeria", email: "k.acheampong@flutterwave.com", phone: "+2349012345678", linkedin: "linkedin.com/in/kofi-acheampong", score: 68, source: "Company Website", avatar: "KA", color: "#10B981" },
  { id: "l8", name: "Grace Wanjiru", company: "Kenya Airways", role: "Digital Transformation Manager", industry: "Aviation", location: "Nairobi, Kenya", email: null, phone: "+254720987654", linkedin: "linkedin.com/in/grace-wanjiru", score: 63, source: "Professional Forum", avatar: "GW", color: "#F97316" },
  { id: "l9", name: "Ibrahim Sani", company: "Interswitch Group", role: "CTO", industry: "Fintech", location: "Lagos, Nigeria", email: "i.sani@interswitchgroup.com", phone: null, linkedin: "linkedin.com/in/ibrahim-sani", score: 59, source: "LinkedIn", avatar: "IS", color: "#6C4DFF" },
  { id: "l10", name: "Amara Diallo", company: "Wave Mobile Money", role: "Country Manager", industry: "Fintech", location: "Dakar, Senegal", email: "a.diallo@wave.com", phone: "+221771234567", linkedin: "linkedin.com/in/amara-diallo", score: 55, source: "Startup Community", avatar: "AD", color: "#00C2A8" },
];

const DISCOVERY_STEPS = [
  "Analyzing event profile with AI...",
  "Generating targeted search queries...",
  "Scanning company websites...",
  "Searching LinkedIn company pages...",
  "Scanning professional directories...",
  "Crawling startup communities...",
  "Extracting contact information...",
  "Scoring leads by relevance...",
  "Building audience database...",
  "Discovery complete!",
];

const INDUSTRIES = ["All Industries", "Tech", "Fintech", "Health Tech", "E-Commerce", "Telecom", "Banking", "Aviation", "Media", "Education"];
const LOCATIONS = ["All Locations", "Nairobi, Kenya", "Lagos, Nigeria", "Accra, Ghana", "Johannesburg, SA", "Dakar, Senegal", "Kampala, Uganda", "Dar es Salaam, TZ"];
const EVENT_SIZES = ["< 100 attendees", "100–500 attendees", "500–2,000 attendees", "2,000+ attendees"];
const BUDGETS = ["$0 – $500", "$500 – $2,000", "$2,000 – $10,000", "$10,000+"];

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-600";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  return "Cold";
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  darkMode: boolean;
  events: { id: string; name: string }[];
}

export default function AudienceDiscoveryView({ darkMode, events }: Props) {
  const [config, setConfig] = useState<DiscoveryConfig>({
    eventId: events[0]?.id ?? "",
    industry: "Tech",
    location: "Nairobi, Kenya",
    eventSize: "100–500 attendees",
    budget: "$500 – $2,000",
  });

  const [isDiscovering, setIsDiscovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [addedToCampaign, setAddedToCampaign] = useState<Set<string>>(new Set());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDiscover = () => {
    setIsDiscovering(true);
    setProgress(0);
    setLeads([]);
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const pct = Math.min(Math.round((step / DISCOVERY_STEPS.length) * 100), 100);
      setProgress(pct);
      setStepText(DISCOVERY_STEPS[step - 1] ?? "");

      if (step >= DISCOVERY_STEPS.length) {
        clearInterval(intervalRef.current!);
        setTimeout(() => {
          setIsDiscovering(false);
          setLeads(MOCK_LEADS);
        }, 600);
      }
    }, 700);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const filtered = leads
    .filter(l => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.role.toLowerCase().includes(q);
      const matchI = industryFilter === "All Industries" || l.industry === industryFilter;
      return matchQ && matchI;
    })
    .sort((a, b) => sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name));

  const card = `rounded-none border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900" : "bg-white"}`;
  const input = `w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-400`;
  const inputWrap = `flex items-center gap-2 border-4 border-wadu-black rounded-none px-3 py-2.5 ${darkMode ? "bg-slate-800" : "bg-white"}`;

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-wadu-black text-white text-xs font-black uppercase rounded-none">AI Powered</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-black uppercase rounded-none flex items-center gap-1"><Sparkles size={10} /> Beta</span>
          </div>
          <h2 className="text-2xl font-black uppercase">Audience Discovery Engine</h2>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>AI scans the web to find the right people for your event</p>
        </div>
        {leads.length > 0 && (
          <button className="flex items-center gap-2 border-4 border-wadu-black bg-white hover:bg-gray-50 text-wadu-black px-4 py-2.5 rounded-none font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition">
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {/* ── Discovery Controls ── */}
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <Target size={16} className="text-wadu-black" />
          <h3 className="font-black uppercase text-sm">Discovery Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Event */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Target Event</label>
            <select
              value={config.eventId}
              onChange={e => setConfig(c => ({ ...c, eventId: e.target.value }))}
              className={`w-full border-4 border-wadu-black rounded-none px-3 py-2.5 text-sm font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            >
              {events.length > 0
                ? events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)
                : <option value="">No events yet</option>
              }
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Target Industry</label>
            <select
              value={config.industry}
              onChange={e => setConfig(c => ({ ...c, industry: e.target.value }))}
              className={`w-full border-4 border-wadu-black rounded-none px-3 py-2.5 text-sm font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            >
              {INDUSTRIES.filter(i => i !== "All Industries").map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Location</label>
            <select
              value={config.location}
              onChange={e => setConfig(c => ({ ...c, location: e.target.value }))}
              className={`w-full border-4 border-wadu-black rounded-none px-3 py-2.5 text-sm font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            >
              {LOCATIONS.filter(l => l !== "All Locations").map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Event Size */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Event Size</label>
            <select
              value={config.eventSize}
              onChange={e => setConfig(c => ({ ...c, eventSize: e.target.value }))}
              className={`w-full border-4 border-wadu-black rounded-none px-3 py-2.5 text-sm font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            >
              {EVENT_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-black uppercase text-gray-400 mb-1.5 block">Campaign Budget</label>
            <div className="flex gap-2">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => setConfig(c => ({ ...c, budget: b }))}
                  className={`px-3 py-2 text-xs font-black uppercase rounded-none border-4 transition ${config.budget === b ? "bg-wadu-black text-white border-wadu-black shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]" : `border-wadu-black ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleDiscover}
            disabled={isDiscovering || !config.eventId}
            className="flex items-center gap-2 bg-wadu-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition self-end"
          >
            {isDiscovering ? <><Clock size={16} className="animate-spin" /> Discovering...</> : <><Zap size={16} /> Find Audience</>}
          </button>
        </div>
      </div>

      {/* ── Progress Bar (during discovery) ── */}
      {isDiscovering && (
        <div className={`${card} p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-wadu-black flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white animate-pulse" />
            </div>
            <div>
              <p className="font-black uppercase text-sm">AI Discovery In Progress</p>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{stepText}</p>
            </div>
            <span className="ml-auto text-2xl font-black text-wadu-black">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 border-2 border-wadu-black rounded-none overflow-hidden">
            <div
              className="h-full bg-wadu-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { icon: Globe, label: "Sources Scanned", value: Math.round(progress * 0.24) },
              { icon: Users, label: "Profiles Found", value: Math.round(progress * 0.63) },
              { icon: Mail, label: "Emails Extracted", value: Math.round(progress * 0.41) },
              { icon: Star, label: "Leads Scored", value: Math.round(progress * 0.18) },
            ].map(stat => (
              <div key={stat.label} className={`border-4 border-wadu-black rounded-none p-3 ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                <stat.icon size={14} className="text-gray-400 mb-1" />
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase font-black">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Leads Table ── */}
      {leads.length > 0 && (
        <div className={`${card} overflow-hidden`}>
          {/* Table header + filters */}
          <div className={`flex flex-col md:flex-row gap-3 items-center justify-between px-6 py-4 border-b-4 border-wadu-black ${darkMode ? "bg-slate-800/50" : "bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="font-black uppercase text-sm">{leads.length} Leads Discovered</span>
              <span className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-400"}`}>· {leads.filter(l => l.score >= 80).length} hot leads</span>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Search */}
              <div className={`${inputWrap} flex-1 md:w-64`}>
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Search leads..." className={input} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              {/* Industry filter */}
              <select
                value={industryFilter}
                onChange={e => setIndustryFilter(e.target.value)}
                className={`border-4 border-wadu-black rounded-none px-3 py-2.5 text-xs font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
              >
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as "score" | "name")}
                className={`border-4 border-wadu-black rounded-none px-3 py-2.5 text-xs font-black uppercase bg-transparent outline-none cursor-pointer ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
              >
                <option value="score">Sort: Score</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                  <th className="px-6 py-3 font-black uppercase">Person</th>
                  <th className="px-4 py-3 font-black uppercase">Company & Role</th>
                  <th className="px-4 py-3 font-black uppercase">Industry</th>
                  <th className="px-4 py-3 font-black uppercase">Location</th>
                  <th className="px-4 py-3 font-black uppercase">Contact</th>
                  <th className="px-4 py-3 font-black uppercase">Score</th>
                  <th className="px-4 py-3 font-black uppercase">Source</th>
                  <th className="px-6 py-3 font-black uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                {filtered.map(lead => (
                  <tr
                    key={lead.id}
                    className={`transition-colors cursor-pointer ${darkMode ? "hover:bg-slate-800/40" : "hover:bg-purple-50/30"}`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black uppercase flex-shrink-0" style={{ background: lead.color }}>
                          {lead.avatar}
                        </div>
                        <span className="font-black uppercase text-sm whitespace-nowrap">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className={`text-xs font-black uppercase ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{lead.company}</p>
                        <p className="text-xs text-gray-400">{lead.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-black uppercase ${darkMode ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}>{lead.industry}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1"><MapPin size={11} />{lead.location}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {lead.email && <div className="w-7 h-7 border-2 border-wadu-black rounded-none flex items-center justify-center" title={lead.email}><Mail size={12} /></div>}
                        {lead.phone && <div className="w-7 h-7 border-2 border-wadu-black rounded-none flex items-center justify-center" title={lead.phone}><Phone size={12} /></div>}
                        {lead.linkedin && <div className="w-7 h-7 border-2 border-wadu-black rounded-none flex items-center justify-center" title={lead.linkedin}><Linkedin size={12} /></div>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-wadu-black rounded-full" style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase ${scoreColor(lead.score)}`}>{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400 font-black uppercase">{lead.source}</td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setAddedToCampaign(prev => new Set([...prev, lead.id]))}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-none text-xs font-black uppercase border-2 border-wadu-black transition ${addedToCampaign.has(lead.id) ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-white hover:bg-gray-50 text-wadu-black"}`}
                        >
                          {addedToCampaign.has(lead.id) ? <><CheckCircle2 size={11} /> Added</> : <><Plus size={11} /> Campaign</>}
                        </button>
                        <button onClick={() => setSelectedLead(lead)} className="w-7 h-7 border-2 border-wadu-black rounded-none flex items-center justify-center hover:bg-gray-50 transition">
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle size={32} className="text-gray-300 mb-3" />
              <p className="font-black uppercase text-sm text-gray-400">No leads match your filters</p>
              <button onClick={() => { setSearchQuery(""); setIndustryFilter("All Industries"); }} className="mt-3 text-xs font-black uppercase text-wadu-black underline">Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isDiscovering && leads.length === 0 && (
        <div className={`${card} p-12 flex flex-col items-center text-center`}>
          <div className="w-20 h-20 bg-wadu-black rounded-full flex items-center justify-center mb-5">
            <Zap size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-black uppercase mb-2">Ready to Find Your Audience?</h3>
          <p className={`text-sm max-w-md ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            Configure your discovery parameters above and click <strong>"Find Audience"</strong>. Our AI will scan the web — company websites, LinkedIn, directories, and startup communities — to build your perfect lead database.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-lg">
            {[
              { icon: Globe, label: "24+ Source Types", sub: "Web, LinkedIn, Directories" },
              { icon: TrendingUp, label: "AI Lead Scoring", sub: "0–100 relevance score" },
              { icon: Users, label: "Rich Profiles", sub: "Email, Phone, LinkedIn" },
            ].map(f => (
              <div key={f.label} className={`border-4 border-wadu-black rounded-none p-4 ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                <f.icon size={20} className="text-wadu-black mb-2" />
                <p className="font-black uppercase text-xs">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lead Detail Drawer ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedLead(null)}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
          <div
            className={`w-full max-w-md border-l-4 border-wadu-black flex flex-col h-full overflow-y-auto shadow-[-8px_0_0_0_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b-4 border-wadu-black ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <h3 className="font-black uppercase">Lead Profile</h3>
              <button onClick={() => setSelectedLead(null)} className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center hover:bg-gray-100 transition">
                <X size={16} />
              </button>
            </div>

            {/* Profile */}
            <div className="px-6 py-6 border-b-4 border-wadu-black">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-black uppercase flex-shrink-0" style={{ background: selectedLead.color }}>
                  {selectedLead.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-black uppercase">{selectedLead.name}</h4>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{selectedLead.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 size={13} className="text-gray-400" />
                    <span className="text-sm font-black uppercase">{selectedLead.company}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-2xl font-black ${scoreColor(selectedLead.score).split(" ")[1]}`}>{selectedLead.score}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase ${scoreColor(selectedLead.score)}`}>{scoreLabel(selectedLead.score)}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-4 flex-1">
              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-3">Contact Information</p>
                <div className="space-y-2.5">
                  {selectedLead.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center flex-shrink-0"><Mail size={14} /></div>
                      <span className="text-sm">{selectedLead.email}</span>
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center flex-shrink-0"><Phone size={14} /></div>
                      <span className="text-sm">{selectedLead.phone}</span>
                    </div>
                  )}
                  {selectedLead.linkedin && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-wadu-black rounded-none flex items-center justify-center flex-shrink-0"><Linkedin size={14} /></div>
                      <a href={`https://${selectedLead.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-wadu-black underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {selectedLead.linkedin} <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-3">Profile Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Industry", value: selectedLead.industry },
                    { label: "Location", value: selectedLead.location },
                    { label: "Source", value: selectedLead.source },
                    { label: "Lead Score", value: `${selectedLead.score}/100` },
                  ].map(d => (
                    <div key={d.label} className={`border-4 border-wadu-black rounded-none p-3 ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                      <p className="text-xs text-gray-400 font-black uppercase">{d.label}</p>
                      <p className="text-sm font-black uppercase mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-2">Attendance Probability</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 border-2 border-wadu-black rounded-none overflow-hidden">
                    <div className="h-full bg-wadu-black transition-all" style={{ width: `${selectedLead.score}%` }} />
                  </div>
                  <span className="font-black text-sm">{selectedLead.score}%</span>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className={`px-6 py-5 border-t-4 border-wadu-black space-y-2 ${darkMode ? "bg-slate-800/50" : "bg-gray-50"}`}>
              <button
                onClick={() => { setAddedToCampaign(prev => new Set([...prev, selectedLead.id])); setSelectedLead(null); }}
                className="flex items-center justify-center gap-2 w-full bg-wadu-black hover:bg-gray-900 text-white px-4 py-3 rounded-none font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition"
              >
                <Plus size={14} /> Add to Campaign
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex items-center justify-center gap-2 w-full border-4 border-wadu-black bg-white hover:bg-gray-50 text-wadu-black px-4 py-2.5 rounded-none font-black uppercase text-sm transition"
              >
                Disqualify Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
