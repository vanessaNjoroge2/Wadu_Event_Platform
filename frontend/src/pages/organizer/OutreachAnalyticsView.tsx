import {
  Mail,
  MessageSquare,
  Smartphone,
  Users,
  TrendingUp,
  MousePointerClick,
  Eye,
  Send,
  CheckCircle2,
  DollarSign,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  BarChart,
  Bar,
} from "recharts";

// ── Mock analytics data ────────────────────────────────────────────────────
const dailyOutreach = [
  { date: "Jul 6", email: 120, whatsapp: 45, sms: 80 },
  { date: "Jul 7", email: 200, whatsapp: 90, sms: 130 },
  { date: "Jul 8", email: 180, whatsapp: 175, sms: 60 },
  { date: "Jul 9", email: 320, whatsapp: 120, sms: 200 },
  { date: "Jul 10", email: 280, whatsapp: 60, sms: 150 },
  { date: "Jul 11", email: 150, whatsapp: 118, sms: 0 },
  { date: "Jul 12", email: 90, whatsapp: 0, sms: 0 },
];

const funnelData = [
  { name: "Leads Identified", value: 1250, fill: "#6C4DFF" },
  { name: "Contacted", value: 920, fill: "#00C2A8" },
  { name: "Opened", value: 564, fill: "#3B82F6" },
  { name: "Clicked", value: 218, fill: "#F59E0B" },
  { name: "Registered", value: 87, fill: "#10B981" },
];

const channelBreakdown = [
  { name: "Email", value: 48, color: "#3B82F6" },
  { name: "WhatsApp", value: 32, color: "#10B981" },
  { name: "SMS", value: 20, color: "#F59E0B" },
];

const conversionByEvent = [
  { event: "EA Tech Summit", leads: 320, converted: 45, rate: 14 },
  { event: "AfroFest Nairobi", leads: 280, converted: 31, rate: 11 },
  { event: "Lagos Beats", leads: 410, converted: 6, rate: 1 },
  { event: "Startup Weekend", leads: 180, converted: 0, rate: 0 },
  { event: "Fintech Forum", events: 60, leads: 60, converted: 5, rate: 8 },
];

const topSources = [
  { source: "LinkedIn Company Pages", leads: 420, pct: 34 },
  { source: "Professional Directories", leads: 310, pct: 25 },
  { source: "Startup Communities", leads: 225, pct: 18 },
  { source: "Company Websites", leads: 185, pct: 15 },
  { source: "Online Forums", leads: 110, pct: 9 },
];

// ── KPI summary data ───────────────────────────────────────────────────────
const kpiCards = [
  {
    label: "Leads Identified",
    value: "1,250",
    change: "+18%",
    up: true,
    sub: "vs last period",
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Emails Sent",
    value: "1,340",
    change: "+12%",
    up: true,
    sub: "open rate 41.8%",
    icon: Mail,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "WhatsApp Delivered",
    value: "493",
    change: "96.1%",
    up: true,
    sub: "delivery rate",
    icon: MessageSquare,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "SMS Delivery Rate",
    value: "94.2%",
    change: "+2.1%",
    up: true,
    sub: "vs last period",
    icon: Smartphone,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Registrations",
    value: "87",
    change: "+34%",
    up: true,
    sub: "from campaigns",
    icon: CheckCircle2,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Cost per Attendee",
    value: "$3.24",
    change: "-8%",
    up: false,
    sub: "lower is better",
    icon: DollarSign,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Click Rate",
    value: "16.3%",
    change: "+3.2%",
    up: true,
    sub: "all channels",
    icon: MousePointerClick,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    changeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Expected Attendance",
    value: "215",
    change: "72% probability",
    up: null,
    sub: "AI estimate",
    icon: TrendingUp,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    changeColor: "text-indigo-600 bg-indigo-50",
  },
];

// ── Tooltip ────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-wadu-yellow border-4 border-wadu-black rounded-none px-3 py-2 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
        <p className="text-white text-xs font-black uppercase mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-white text-xs font-black uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: p.color }} />
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Component ─────────────────────────────────────────────────────────
interface Props {
  darkMode: boolean;
}

export default function OutreachAnalyticsView({ darkMode }: Props) {
  const card = `rounded-none border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${darkMode ? "bg-slate-900" : "bg-white"}`;
  const dm = darkMode;

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-black uppercase">Outreach Analytics</h2>
        <p className={`text-sm mt-0.5 ${dm ? "text-slate-400" : "text-gray-500"}`}>
          Full-funnel performance across email, WhatsApp, and SMS campaigns
        </p>
      </div>

      {/* ── KPI Cards (8-grid) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className={`${card} p-4 flex flex-col gap-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase ${dm ? "text-slate-400" : "text-gray-500"}`}>{kpi.label}</span>
              <div className={`w-8 h-8 rounded-none ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon size={14} className={kpi.iconColor} />
              </div>
            </div>
            <p className="text-2xl font-black">{kpi.value}</p>
            <div className={`inline-flex items-center gap-1 text-xs font-black uppercase px-2 py-0.5 rounded-full w-fit ${kpi.changeColor}`}>
              {kpi.up === true && <ArrowUpRight size={11} />}
              {kpi.up === false && <ArrowDownRight size={11} />}
              {kpi.up === null && <Minus size={11} />}
              {kpi.change}
              {kpi.sub && <span className="font-normal opacity-70 ml-1">{kpi.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Daily Activity + Channel Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Area chart: daily outreach */}
        <div className={`${card} p-6 lg:col-span-3`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black uppercase">Daily Outreach Activity</h3>
              <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-gray-400"}`}>Messages sent across all channels</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-black uppercase">
              {[{ color: "#3B82F6", label: "Email" }, { color: "#10B981", label: "WhatsApp" }, { color: "#F59E0B", label: "SMS" }].map(l => (
                <span key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyOutreach} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="waGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="smsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#1e293b" : "#f0f0f0"} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="email" name="Email" stroke="#3B82F6" strokeWidth={2} fill="url(#emailGrad)" dot={false} />
              <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="#10B981" strokeWidth={2} fill="url(#waGrad)" dot={false} />
              <Area type="monotone" dataKey="sms" name="SMS" stroke="#F59E0B" strokeWidth={2} fill="url(#smsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart: channel breakdown */}
        <div className={`${card} p-6 lg:col-span-2`}>
          <div className="mb-4">
            <h3 className="font-black uppercase">Channel Breakdown</h3>
            <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-gray-400"}`}>Share of total outreach</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={channelBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {channelBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(val: any) => [`${val}%`, ""]}
                contentStyle={{ background: "#0A1F44", border: "1px solid rgba(108,77,255,0.3)", borderRadius: 4, color: "white", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {channelBreakdown.map(ch => (
              <div key={ch.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ch.color }} />
                  <span className={dm ? "text-slate-300" : "text-gray-600"}>{ch.name}</span>
                </div>
                <span className="font-black">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Conversion Funnel + Event Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Funnel */}
        <div className={`${card} p-6 lg:col-span-2`}>
          <div className="mb-5">
            <h3 className="font-black uppercase">Conversion Funnel</h3>
            <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-gray-400"}`}>Leads → Registration pipeline</p>
          </div>
          <div className="space-y-2.5">
            {funnelData.map((step, i) => {
              const pct = Math.round((step.value / funnelData[0].value) * 100);
              return (
                <div key={step.name}>
                  <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
                    <span className={dm ? "text-slate-300" : "text-gray-600"}>{step.name}</span>
                    <span>{step.value.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 border-2 border-wadu-black rounded-none overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 flex items-center justify-end pr-1"
                      style={{ width: `${pct}%`, background: step.fill }}
                    />
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="w-px h-2 bg-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={`mt-4 border-4 border-wadu-black rounded-none p-3 ${dm ? "bg-slate-800" : "bg-emerald-50"}`}>
            <p className="text-xs font-black uppercase text-gray-400">Overall Conversion Rate</p>
            <p className={`text-2xl font-black mt-1 ${dm ? "text-emerald-400" : "text-emerald-600"}`}>
              {Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100 * 10) / 10}%
            </p>
            <p className="text-xs text-gray-400">Lead → Registration</p>
          </div>
        </div>

        {/* Event conversion bar chart */}
        <div className={`${card} p-6 lg:col-span-3`}>
          <div className="mb-5">
            <h3 className="font-black uppercase">Conversions by Event</h3>
            <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-gray-400"}`}>Leads contacted vs registrations generated</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionByEvent} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#1e293b" : "#f0f0f0"} vertical={false} />
              <XAxis dataKey="event" tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="leads" name="Leads" fill="#6C4DFF" radius={0} />
              <Bar dataKey="converted" name="Converted" fill="#10B981" radius={0} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs font-black uppercase">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-none bg-[#6C4DFF] inline-block" /> Leads</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-none bg-[#10B981] inline-block" /> Converted</span>
          </div>
        </div>
      </div>

      {/* ── Top Lead Sources Table ── */}
      <div className={`${card} overflow-hidden`}>
        <div className={`px-6 py-4 border-b-4 border-wadu-black ${dm ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <h3 className="font-black uppercase">Top Lead Sources</h3>
          <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-gray-400"}`}>Where your best leads are coming from</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-xs uppercase tracking-wider ${dm ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                <th className="px-6 py-3 font-black uppercase text-left">Source</th>
                <th className="px-4 py-3 font-black uppercase text-right">Leads</th>
                <th className="px-4 py-3 font-black uppercase text-right">Share</th>
                <th className="px-6 py-3 font-black uppercase text-left">Distribution</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dm ? "divide-slate-800" : "divide-gray-100"}`}>
              {topSources.map((source, i) => (
                <tr key={source.source} className={`transition-colors ${dm ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-none flex items-center justify-center text-xs font-black border-2 border-wadu-black ${i === 0 ? "bg-wadu-black text-white" : dm ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}>{i + 1}</span>
                      <span className="font-black uppercase text-sm">{source.source}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-black text-right">{source.leads}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase ${dm ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}>{source.pct}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full h-2 bg-gray-100 border border-gray-200 rounded-none overflow-hidden">
                      <div className="h-full bg-wadu-black transition-all" style={{ width: `${source.pct}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Channel Performance Summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            channel: "Email", icon: Mail, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
            stats: [{ label: "Sent", value: "1,340" }, { label: "Open Rate", value: "41.8%" }, { label: "CTR", value: "16.3%" }, { label: "Unsubscribes", value: "12" }],
          },
          {
            channel: "WhatsApp", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
            stats: [{ label: "Sent", value: "493" }, { label: "Delivery", value: "96.1%" }, { label: "Read Rate", value: "85.4%" }, { label: "Opt-outs", value: "3" }],
          },
          {
            channel: "SMS", icon: Smartphone, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200",
            stats: [{ label: "Sent", value: "380" }, { label: "Delivery", value: "94.2%" }, { label: "Clicks", value: "8.7%" }, { label: "Opt-outs", value: "7" }],
          },
        ].map(ch => (
          <div key={ch.channel} className={`${card} p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-none border-4 border-wadu-black flex items-center justify-center ${ch.bg}`}>
                <ch.icon size={18} className={ch.color} />
              </div>
              <h3 className="font-black uppercase">{ch.channel} Performance</h3>
            </div>
            <div className="space-y-2">
              {ch.stats.map(stat => (
                <div key={stat.label} className={`flex items-center justify-between py-1.5 border-b ${dm ? "border-slate-800" : "border-gray-100"}`}>
                  <span className="text-xs font-black uppercase text-gray-400">{stat.label}</span>
                  <span className="text-sm font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
