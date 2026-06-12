import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreateEventForm } from "./CreateEventPage";
import { HelpPageContent } from "./FooterPages";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  BarChart2,
  Wallet,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  Ticket,
  Star,
  Bell,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  Search,
  Filter,
  Check,
  Smartphone,
  Building,
  Save,
  User,
  Lock,
  Shield,
  ArrowUpRight
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ── MOCK DATA ──
const revenueData = [
  { month: "Mar", revenue: 980000 },
  { month: "Apr", revenue: 1250000 },
  { month: "May", revenue: 1100000 },
  { month: "Jun", revenue: 1680000 },
  { month: "Jul", revenue: 2020000 },
  { month: "Aug", revenue: 2450000 },
];

const dailySalesData = [
  { day: "Mon", sales: 45000 },
  { day: "Tue", sales: 78000 },
  { day: "Wed", sales: 62000 },
  { day: "Thu", sales: 95000 },
  { day: "Fri", sales: 120000 },
  { day: "Sat", sales: 185000 },
  { day: "Sun", sales: 140000 },
];

const ticketCategories = [
  { name: "Concerts", value: 480, color: "#6C4DFF" },
  { name: "Tech Events", value: 310, color: "#00C2A8" },
  { name: "Festivals", value: 287, color: "#F59E0B" },
  { name: "Networking", value: 170, color: "#EC4899" },
];

const deviceData = [
  { name: "Desktop", value: 55, color: "#6C4DFF" },
  { name: "Mobile", value: 38, color: "#00C2A8" },
  { name: "Tablet", value: 7, color: "#F59E0B" },
];

const initialTransactions = [
  {
    name: "Amara Nwosu",
    event: "AfroFest Nairobi 2025",
    amount: "KES 4,500",
    time: "2 min ago",
    status: "completed",
    avatar: "AN",
    color: "#6C4DFF",
  },
  {
    name: "David Kimani",
    event: "EA Tech Summit",
    amount: "KES 3,000",
    time: "14 min ago",
    status: "completed",
    avatar: "DK",
    color: "#00C2A8",
  },
  {
    name: "Fatima Al-Hassan",
    event: "AfroFest Nairobi 2025",
    amount: "KES 9,000",
    time: "1 hr ago",
    status: "completed",
    avatar: "FA",
    color: "#F59E0B",
  },
  {
    name: "Kofi Mensah",
    event: "Lagos Beats Festival",
    amount: "KES 2,750",
    time: "3 hr ago",
    status: "pending",
    avatar: "KM",
    color: "#EC4899",
  },
  {
    name: "Zanele Dlamini",
    event: "AfroFest Nairobi 2025",
    amount: "KES 4,500",
    time: "5 hr ago",
    status: "completed",
    avatar: "ZD",
    color: "#3B82F6",
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/organizer-dashboard" },
  { icon: CalendarDays, label: "My Events", path: "/organizer-dashboard/events" },
  { icon: PlusCircle, label: "Create Event", path: "/post-event" },
  { icon: Users, label: "Attendees", path: "/organizer-dashboard/attendees" },
  { icon: BarChart2, label: "Analytics", path: "/organizer-dashboard/analytics" },
  { icon: Wallet, label: "Payouts", path: "/organizer-dashboard/payouts" },
  { icon: Settings, label: "Settings", path: "/organizer-dashboard/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

function formatKES(val: number) {
  if (val >= 1000000) return `KES ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `KES ${(val / 1000).toFixed(0)}K`;
  return `KES ${val}`;
}

const getEventImage = (id: string | number) => {
  if (typeof id === "number") {
    const index = ((id - 1) % 15) + 1;
    return index === 1 ? "/Image 1.jpg" : `/image ${index}.jpg`;
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = (Math.abs(hash) % 15) + 1;
  return index === 1 ? "/Image 1.jpg" : `/image ${index}.jpg`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A1F44] border border-[#6C4DFF]/30 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">{formatKES(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function OrganizerDashboardPage() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  // Dynamic states loaded from backend
  const [events, setEvents] = useState<any[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  const [attendees, setAttendees] = useState<any[]>([]);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("All");

  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("mpesa");
  const [balance, setBalance] = useState(0);
  const [mpesaName, setMpesaName] = useState("Organizer Ltd");
  const [mpesaPhone, setMpesaPhone] = useState("0712345678");
  const [bankName, setBankName] = useState("NCBA Bank Kenya");
  const [bankAccountName, setBankAccountName] = useState("Organizer Limited");
  const [bankAccountNumber, setBankAccountNumber] = useState("1029384756");
  const [bankSwift, setBankSwift] = useState("NCBAKENA");
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);
  const [payoutsHistory, setPayoutsHistory] = useState<any[]>([]);

  const [orgName, setOrgName] = useState("Organizer Profile");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("https://wadu.io");
  const [orgBio, setOrgBio] = useState("WADU Event Organizer");
  const [emailOnTicketSale, setEmailOnTicketSale] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securitySaved, setSecuritySaved] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    upcomingEventsCount: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [dailySalesData, setDailySalesData] = useState<any[]>([]);
  const [ticketCategories, setTicketCategories] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch user info
    api.get("/auth/me")
      .then((user: any) => {
        if (user) {
          setOrgName(`${user.firstName} ${user.lastName}`);
          setOrgEmail(user.email);
        }
      })
      .catch((err) => console.error("Error loading user info:", err));

    // 2. Fetch stats
    api.get("/organizer/dashboard")
      .then((stats: any) => {
        if (stats) setDashboardStats(stats);
      })
      .catch((err) => console.error("Error loading dashboard stats:", err));

    // 3. Fetch events & attendees
    api.get("/organizer/events")
      .then(async (list: any) => {
        if (Array.isArray(list)) {
          const mappedEvents = list.map((e: any) => ({
            id: e.id,
            name: e.title,
            date: new Date(e.startDate).toLocaleDateString(),
            sold: e.ticketsSold,
            capacity: e.totalCapacity,
            revenue: e.revenue,
            status: e.status === "PUBLISHED" ? "On Sale" : e.status === "DRAFT" ? "Draft" : "Sold Out",
            image: e.imageUrl || getEventImage(e.id)
          }));
          setEvents(mappedEvents);

          // Fetch attendees for all loaded events in parallel
          try {
            const allAttendees: any[] = [];
            for (const evt of mappedEvents) {
              const attendeesList = await api.get<any[]>(`/organizer/events/${evt.id}/attendees`);
              if (Array.isArray(attendeesList)) {
                const mapped = attendeesList.map((a: any) => ({
                  id: a.orderId,
                  name: `${a.firstName} ${a.lastName}`,
                  email: a.email,
                  phone: a.phone,
                  event: evt.name,
                  ticket: a.ticketType,
                  paid: `KES ${(a.quantity * 2500).toLocaleString()}`,
                  paymentStatus: "Paid",
                  deliveryMethod: "Both",
                  date: new Date(a.purchaseDate).toLocaleDateString(),
                  status: "Confirmed"
                }));
                allAttendees.push(...mapped);
              }
            }
            setAttendees(allAttendees);
          } catch (err) {
            console.error("Error loading attendees list:", err);
          }
        }
      })
      .catch((err) => console.error("Error loading events:", err));

    // 4. Fetch payouts
    api.get("/organizer/payouts")
      .then((data: any) => {
        if (data) {
          setBalance(data.pendingPayout || 0);
          if (Array.isArray(data.payoutHistory)) {
            const mappedPayouts = data.payoutHistory.map((p: any) => ({
              id: p.id,
              date: new Date(p.date).toLocaleDateString(),
              amount: `KES ${p.amount.toLocaleString()}`,
              method: p.bankName ? `${p.bankName} (${p.accountNumber})` : "Bank Transfer",
              status: p.status === "PAID" ? "Completed" : "Pending",
            }));
            setPayoutsHistory(mappedPayouts);
          }
        }
      })
      .catch((err) => console.error("Error loading payouts info:", err));

    // 5. Fetch revenue analytics
    api.get("/organizer/analytics/revenue")
      .then((data: any) => {
        if (Array.isArray(data)) {
          setRevenueData(data);
        }
      })
      .catch((err) => console.error("Error loading revenue analytics:", err));

    // 6. Fetch daily sales analytics
    api.get("/organizer/analytics/daily-sales")
      .then((data: any) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item: any) => ({
            day: item.date,
            sales: item.ticketsSold * 2500, // average ticket price KES
          }));
          setDailySalesData(mapped);
        }
      })
      .catch((err) => console.error("Error loading daily sales analytics:", err));

    // 7. Fetch ticket categories analytics
    api.get("/organizer/analytics/ticket-categories")
      .then((data: any) => {
        if (Array.isArray(data)) {
          const colors = ["#6C4DFF", "#00C2A8", "#F59E0B", "#EC4899", "#3B82F6"];
          const mapped = data.map((item: any, idx: number) => ({
            name: item.name,
            value: item.value,
            color: colors[idx % colors.length],
          }));
          setTicketCategories(mapped);
        }
      })
      .catch((err) => console.error("Error loading ticket categories analytics:", err));
  }, []);

  // Check In quick action
  const handleCheckIn = (id: string) => {
    setAttendees(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Checked In" } : a))
    );
  };

  // Instant Payout handler (simulated)
  const handleRequestPayout = () => {
    if (balance <= 0) return;
    setRequestingPayout(true);
    setPayoutStatus("Verifying balance...");
    
    setTimeout(() => {
      setPayoutStatus("Initiating secure transfer...");
      setTimeout(() => {
        setPayoutsHistory(prev => [
          {
            date: "Today",
            id: `PAY-${Math.floor(10000 + Math.random() * 90000)}-KE`,
            amount: `KES ${balance.toLocaleString()}`,
            method: payoutMethod === "mpesa" ? `M-Pesa (${mpesaPhone.substring(0, 4)} *** ${mpesaPhone.substring(7)})` : `${bankName} Transfer`,
            status: "Completed"
          },
          ...prev
        ]);
        setBalance(0);
        setRequestingPayout(false);
        setPayoutStatus("Completed!");
      }, 1500);
    }, 1200);
  };

  // Save Payout Settings handler
  const handleSavePayoutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Save Settings handler
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Navigation title calculation
  const getPageTitle = () => {
    if (currentPath === "/organizer-dashboard/events") return "My Events";
    if (currentPath === "/organizer-dashboard/attendees") return "Attendees";
    if (currentPath === "/organizer-dashboard/analytics") return "Analytics";
    if (currentPath === "/organizer-dashboard/payouts") return "Payouts";
    if (currentPath === "/organizer-dashboard/settings") return "Settings";
    if (currentPath === "/post-event") return "Create Event";
    if (currentPath === "/help") return "Help & FAQs";
    return "Dashboard";
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(eventSearch.toLowerCase());
      const matchesFilter = eventFilter === "All" || e.status === eventFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, eventSearch, eventFilter]);

  // Filtered Attendees
  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      const matchesSearch =
        a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        a.id.toLowerCase().includes(attendeeSearch.toLowerCase());
      const matchesEvent = selectedEventFilter === "All" || a.event === selectedEventFilter;
      return matchesSearch && matchesEvent;
    });
  }, [attendees, attendeeSearch, selectedEventFilter]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-800"}`}>
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] min-w-[240px] bg-[#0A1F44] flex flex-col h-full shadow-2xl z-10 text-white">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tight">WADU</span>
            <span className="text-xs bg-[#6C4DFF] text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </Link>
        </div>

        {/* Profile */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              AF
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{orgName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={11} className="text-[#00C2A8]" />
                <span className="text-[#00C2A8] text-xs font-medium">Verified Organizer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === "/organizer-dashboard"
              ? currentPath === "/organizer-dashboard" || currentPath === "/organizer-dashboard/"
              : currentPath === item.path;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#6C4DFF] text-white shadow-lg shadow-[#6C4DFF]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition text-sm font-medium"
          >
            <span className="flex items-center gap-3">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
            <div className={`w-9 h-5 rounded-full transition-colors relative ${darkMode ? "bg-[#6C4DFF]" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? "left-4" : "left-0.5"}`} />
            </div>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className={`border-b px-8 py-4 flex items-center justify-between flex-shrink-0 transition-colors duration-200 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Thursday, 21 May 2026</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className={`relative p-2 rounded-xl transition ${darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-100 text-gray-500"}`}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6C4DFF] rounded-full" />
            </button>
            
            <button className={`flex items-center gap-2 text-sm font-medium transition px-3 py-2 rounded-xl ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white text-xs font-bold">AF</div>
              {orgName}
              <ChevronDown size={14} />
            </button>
            
            <Link
              to="/post-event"
              className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-[#6C4DFF]/30"
            >
              <PlusCircle size={16} />
              Create Event
            </Link>
          </div>
        </header>

        {/* Dynamic Views Rendering Area */}
        <div className={`flex-1 overflow-y-auto px-8 py-6 space-y-6 transition-colors duration-200 ${darkMode ? "bg-slate-950" : "bg-gray-50"}`}>
          
          {/* 1. VIEW: DASHBOARD OVERVIEW (default) */}
          {(currentPath === "/organizer-dashboard" || currentPath === "/organizer-dashboard/") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  {
                    label: "Total Revenue",
                    value: `KES ${dashboardStats.totalRevenue.toLocaleString()}`,
                    change: "+18%",
                    sub: "vs last month",
                    up: true,
                    icon: Wallet,
                    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
                    iconColor: "text-emerald-600 dark:text-emerald-400",
                    changeColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400",
                  },
                  {
                    label: "Tickets Sold",
                    value: dashboardStats.totalTicketsSold.toLocaleString(),
                    change: "+24%",
                    sub: "vs last month",
                    up: true,
                    icon: Ticket,
                    iconBg: "bg-blue-50 dark:bg-blue-950/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    changeColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
                  },
                  {
                    label: "Active Events",
                    value: `${events.filter(e => e.status === "On Sale" || e.status === "PUBLISHED").length}`,
                    change: "2 ending soon",
                    sub: "",
                    up: null,
                    icon: Star,
                    iconBg: "bg-teal-50 dark:bg-teal-950/30",
                    iconColor: "text-[#00C2A8]",
                    changeColor: "text-[#00C2A8] bg-teal-50 dark:bg-teal-950/20",
                  },
                  {
                    label: "Upcoming Events",
                    value: `${dashboardStats.upcomingEventsCount}`,
                    change: "Next in 3 days",
                    sub: "",
                    up: null,
                    icon: CalendarDays,
                    iconBg: "bg-purple-50 dark:bg-purple-950/30",
                    iconColor: "text-[#6C4DFF]",
                    changeColor: "text-[#6C4DFF] bg-purple-50 dark:bg-purple-950/20",
                  },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl p-5 flex flex-col gap-3 shadow-sm border transition hover:shadow-md ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{stat.label}</span>
                      <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                        <stat.icon size={20} className={stat.iconColor} />
                      </div>
                    </div>
                    <div className="text-3xl font-black">{stat.value}</div>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${stat.changeColor}`}>
                      {stat.up === true && <TrendingUp size={12} />}
                      {stat.up === false && <TrendingDown size={12} />}
                      {stat.change}
                      {stat.sub && <span className="font-normal opacity-70 ml-1">{stat.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Line chart */}
                <div className={`lg:col-span-3 rounded-2xl shadow-sm border p-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-bold">Monthly Revenue</h2>
                      <p className="text-gray-400 text-sm">Last 6 months</p>
                    </div>
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <TrendingUp size={12} /> +18% this month
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6C4DFF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6C4DFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#6C4DFF" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: "#6C4DFF", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#6C4DFF", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Donut chart */}
                <div className={`lg:col-span-2 rounded-2xl shadow-sm border p-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="mb-4">
                    <h2 className="font-bold">Tickets by Category</h2>
                    <p className="text-gray-400 text-sm">All events combined</p>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ticketCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                        {ticketCategories.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => [`${val} tickets`, ""]} contentStyle={{ background: "#0A1F44", border: "1px solid rgba(108,77,255,0.3)", borderRadius: 12, color: "white", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {ticketCategories.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                          <span className={`${darkMode ? "text-slate-300" : "text-gray-600"}`}>{cat.name}</span>
                        </div>
                        <span className="font-semibold">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Active Events & Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pb-4">
                {/* Events list mini */}
                <div className={`lg:col-span-3 rounded-2xl shadow-sm border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="font-bold">My Active Events</h2>
                    <Link to="/organizer-dashboard/events" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8] flex items-center gap-1">
                      View all <ExternalLink size={14} />
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                          <th className="px-6 py-3 font-semibold">Event Name</th>
                          <th className="px-4 py-3 font-semibold">Date</th>
                          <th className="px-4 py-3 font-semibold">Tickets</th>
                          <th className="px-4 py-3 font-semibold">Revenue</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.slice(0, 3).map((event, i) => (
                          <tr key={event.name} className={`border-t transition-colors ${darkMode ? "border-slate-800 hover:bg-slate-800/30" : "border-gray-50 hover:bg-gray-50"} ${i % 2 === 1 ? (darkMode ? "bg-slate-900" : "bg-gray-50/50") : ""}`}>
                            <td className="px-6 py-4 font-semibold">{event.name}</td>
                            <td className="px-4 py-4 text-gray-400 whitespace-nowrap">{event.date}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{event.sold} / {event.capacity}</span>
                                <div className="w-20 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#6C4DFF]"
                                    style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-semibold">KES {event.revenue.toLocaleString()}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                event.status === "On Sale"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                              }`}>
                                {event.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transactions list mini */}
                <div className={`lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="font-bold">Recent Transactions</h2>
                    <Link to="/organizer-dashboard/attendees" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8]">View all</Link>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-800">
                    {initialTransactions.map((tx) => (
                      <div key={tx.name + tx.time} className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: tx.color }}
                        >
                          {tx.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{tx.name}</p>
                          <p className="text-xs text-gray-400 truncate">{tx.event}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold">{tx.amount}</p>
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            {tx.status === "completed" ? (
                              <CheckCircle2 size={11} className="text-emerald-500" />
                            ) : (
                              <Clock size={11} className="text-amber-500" />
                            )}
                            <span className="text-xs text-gray-400">{tx.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. VIEW: MY EVENTS */}
          {currentPath === "/organizer-dashboard/events" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className={`flex items-center gap-3 border rounded-xl px-3 py-2 w-full md:w-96 transition-colors ${darkMode ? "bg-slate-900 border-slate-800 focus-within:border-[#6C4DFF]" : "bg-white border-gray-200 focus-within:border-[#6C4DFF]"}`}>
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by event name..."
                    className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  {["All", "On Sale", "Draft", "Sold Out"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setEventFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        eventFilter === filter
                          ? "bg-[#6C4DFF] text-white shadow-md shadow-[#6C4DFF]/25"
                          : darkMode
                          ? "bg-slate-900 hover:bg-slate-800 text-slate-300"
                          : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-100"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events list table */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                        <th className="px-6 py-4 font-semibold">Event Name</th>
                        <th className="px-4 py-4 font-semibold">Date & Location</th>
                        <th className="px-4 py-4 font-semibold">Tickets Sold</th>
                        <th className="px-4 py-4 font-semibold">Revenue</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((e) => (
                          <tr key={e.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={e.image}
                                  onError={(err) => {
                                    err.currentTarget.onerror = null;
                                    err.currentTarget.src = getEventImage(e.id);
                                  }}
                                  alt={e.name}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <span className="font-bold text-wadu-navy dark:text-white">{e.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-0.5 text-xs text-gray-400">
                                <p className="font-semibold">{e.date}</p>
                                <p>Nairobi, Kenya</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {e.status !== "Draft" ? (
                                <div className="space-y-1 w-32">
                                  <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-gray-400">{e.sold} / {e.capacity}</span>
                                    <span>{Math.round((e.sold / e.capacity) * 100)}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#00C2A8]"
                                      style={{ width: `${(e.sold / e.capacity) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">N/A (Draft)</span>
                              )}
                            </td>
                            <td className="px-4 py-4 font-extrabold text-wadu-navy dark:text-white">
                              KES {e.revenue.toLocaleString()}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                e.status === "On Sale"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : e.status === "Sold Out"
                                  ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              }`}>
                                {e.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    navigate(`/post-event?id=${e.id}`);
                                  }}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-bold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    toast({
                                      title: "Viewing Public Page ",
                                      description: `Opening page for ${e.name}`,
                                    });
                                  }}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-bold transition"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setEvents(prev =>
                                      prev.map(event =>
                                        event.id === e.id ? { ...event, status: "Draft" } : event
                                      )
                                    );
                                    toast({
                                      title: "Event Saved as Draft ",
                                      description: `${e.name} status updated to Draft.`,
                                    });
                                  }}
                                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg font-bold transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-gray-400">
                            <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-350">No Events Found</h3>
                            <p className="text-sm max-w-sm mx-auto mt-1">We couldn't find any events matching "{eventSearch}" under this filter.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIEW: ATTENDEES */}
          {currentPath === "/organizer-dashboard/attendees" && (
            <div className="space-y-6">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Total Registered", value: attendees.length.toLocaleString(), desc: "Across all active events", color: "text-[#6C4DFF]" },
                  { label: "Checked In", value: `${attendees.filter(a => a.status === "Checked In").length} / ${attendees.length}`, desc: "Attending live sessions", color: "text-emerald-500" },
                  { label: "Check-in rate", value: `${Math.round((attendees.filter(a => a.status === "Checked In").length / attendees.length) * 100)}%`, desc: "Average QR scans", color: "text-[#00C2A8]" },
                ].map(m => (
                  <div key={m.label} className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-1 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">{m.label}</span>
                    <span className={`text-3xl font-black ${m.color}`}>{m.value}</span>
                    <span className="text-gray-400 text-xs mt-1">{m.desc}</span>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className={`flex items-center gap-3 border rounded-xl px-3 py-2 w-full md:w-96 transition-colors ${darkMode ? "bg-slate-900 border-slate-800 focus-within:border-[#6C4DFF]" : "bg-white border-gray-200 focus-within:border-[#6C4DFF]"}`}>
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email or ticket ID..."
                    className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">Filter by Event:</span>
                  <select
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer w-full md:w-60 transition ${
                      darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                    }`}
                    value={selectedEventFilter}
                    onChange={(e) => setSelectedEventFilter(e.target.value)}
                  >
                    <option value="All">All Events</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.name}>{evt.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      toast({
                        title: "Exporting Attendees ",
                        description: "Your CSV export of attendees has started download.",
                      });
                    }}
                    className="bg-[#0A1F44] border border-white/10 text-white hover:bg-wadu-teal hover:text-[#0A1F44] hover:border-[#00C2A8] px-4 py-2 rounded-xl font-bold transition duration-205 text-xs shadow-sm whitespace-nowrap"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Attendees Table */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-4 py-4 font-semibold">Email</th>
                        <th className="px-4 py-4 font-semibold">Phone</th>
                        <th className="px-4 py-4 font-semibold">Ticket Type</th>
                        <th className="px-4 py-4 font-semibold">Order Date</th>
                        <th className="px-4 py-4 font-semibold">Payment Status</th>
                        <th className="px-4 py-4 font-semibold">Delivery Method</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((a) => (
                          <tr key={a.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                            <td className="px-6 py-4 font-bold text-wadu-navy dark:text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C4DFF]/20 to-[#00C2A8]/20 flex items-center justify-center text-xs font-bold text-[#6C4DFF] flex-shrink-0">
                                  {a.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <span>{a.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-400">{a.email}</td>
                            <td className="px-4 py-4 font-semibold text-gray-450">{a.phone}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                                a.ticket === "VIP" || a.ticket === "VVIP"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                                  : a.ticket === "Speaker"
                                  ? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"
                              }`}>
                                {a.ticket}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-400">{a.date}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                                a.paymentStatus === "Paid"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              }`}>
                                <Check size={12} className={a.paymentStatus === "Paid" ? "text-emerald-500" : "text-amber-500"} />
                                {a.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-450">
                              {a.deliveryMethod}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {a.status !== "Checked In" ? (
                                <button
                                  onClick={() => handleCheckIn(a.id)}
                                  className="text-xs bg-[#00C2A8]/10 hover:bg-[#00C2A8]/20 text-[#00C2A8] px-3 py-1.5 rounded-lg font-bold transition inline-flex items-center gap-1"
                                >
                                  Check In
                                </button>
                              ) : (
                                <span className="text-xs text-emerald-500 font-bold flex items-center justify-end gap-1">
                                  <CheckCircle2 size={12} />
                                  Checked In
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-16 text-gray-400">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-300">No Attendees Found</h3>
                            <p className="text-sm max-w-sm mx-auto mt-1">Try refining your search keyword or selected event filter.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. VIEW: ANALYTICS */}
          {currentPath === "/organizer-dashboard/analytics" && (
            <div className="space-y-6">
              
              {/* Analytics Header Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: "Total Page Views", value: "45,820", icon: ExternalLink, color: "text-[#6C4DFF]" },
                  { label: "Tickets Sold", value: "1,247", icon: Ticket, color: "text-blue-500" },
                  { label: "Conversion Rate", value: "2.7%", icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Average Order Value", value: "KES 3,250", icon: Wallet, color: "text-[#00C2A8]" },
                ].map(m => (
                  <div key={m.label} className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase">{m.label}</span>
                      <p className="text-2xl font-black">{m.value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                      <m.icon size={20} className={m.color} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Analytics charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Revenue Over Time AreaChart */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold">Revenue Over Time</h3>
                      <p className="text-gray-400 text-xs">Monthly ticket sales revenue</p>
                    </div>
                    <span className="text-xs bg-[#6C4DFF]/10 text-[#6C4DFF] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <TrendingUp size={12} /> +18% growth
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                      <defs>
                        <linearGradient id="revenueGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6C4DFF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6C4DFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#6C4DFF" strokeWidth={2.5} fill="url(#revenueGrowthGrad)" dot={{ fill: "#6C4DFF", r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Ticket Categories PieChart */}
                <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="mb-6">
                    <h3 className="font-bold">Ticket Categories</h3>
                    <p className="text-gray-400 text-xs">Sales distribution by event type</p>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ticketCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                        {ticketCategories.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => [`${val} tickets`, "Count"]} contentStyle={{ background: "#0A1F44", border: "none", borderRadius: 12, color: "white", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-4">
                    {ticketCategories.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                          <span className="text-gray-450">{c.name}</span>
                        </div>
                        <span>{c.value} ({Math.round((c.value / ticketCategories.reduce((sum, item) => sum + item.value, 0)) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Daily Sales BarChart */}
              <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold">Daily Ticket Sales</h3>
                    <p className="text-gray-400 text-xs">Sales activity over the last 7 days</p>
                  </div>
                  <span className="text-xs bg-[#00C2A8]/10 text-[#00C2A8] font-bold px-3 py-1.5 rounded-full">
                    Average: KES 103K / day
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dailySalesData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}K`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(val) => [`KES ${Number(val).toLocaleString()}`, "Daily Sales"]} contentStyle={{ background: "#0A1F44", border: "none", borderRadius: 12, color: "white", fontSize: 12 }} />
                    <Bar dataKey="sales" fill="#00C2A8" radius={[8, 8, 0, 0]}>
                      {dailySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#00C2A8" : "#6C4DFF"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

          {/* 5. VIEW: PAYOUTS */}
          {currentPath === "/organizer-dashboard/payouts" && (
            <div className="space-y-6">
              
              {/* Wallet balances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Account Balance Card */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#6C4DFF] to-[#0A1F44] text-white shadow-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Account Balance</span>
                    <p className="text-3xl font-black">KES {balance.toLocaleString()}</p>
                  </div>

                  <div>
                    {balance > 0 ? (
                      <button
                        onClick={handleRequestPayout}
                        disabled={requestingPayout}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                          requestingPayout
                            ? "bg-white/20 text-white/50 cursor-not-allowed"
                            : "bg-[#00C2A8] hover:bg-[#00b098] text-white shadow-md shadow-[#00C2A8]/20"
                        }`}
                      >
                        {requestingPayout ? payoutStatus : (
                          <>
                            Request Instant Payout
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-white/10 rounded-xl px-4 py-2.5 text-xs text-white/80 font-bold text-center">
                        Payout completed successfully.
                      </div>
                    )}
                  </div>
                </div>

                {/* Scheduled Payout */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-[180px] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="space-y-1">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Scheduled Payout (Sept 1)</span>
                    <p className="text-3xl font-black">KES 1,263,000</p>
                    <p className="text-gray-400 text-xs mt-1">Automatic payout to NCB Bank Account</p>
                  </div>
                  
                  <div className="flex items-center gap-2 border-t pt-3 border-gray-100 dark:border-slate-800 text-xs text-gray-400">
                    <CheckCircle2 size={14} className="text-[#00C2A8]" />
                    Verification checks completed.
                  </div>
                </div>

                {/* Lifetime earnings */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-[180px] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="space-y-1">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Lifetime Revenue</span>
                    <p className="text-3xl font-black">KES {(2450000 + (482500 - balance)).toLocaleString()}</p>
                    <p className="text-gray-400 text-xs mt-1">Excludes active refund reserves</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                    <TrendingUp size={14} />
                    +34% Growth compared to Q1 2025
                  </div>
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Form configuration */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-5 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div>
                    <h3 className="font-bold text-lg">Payout Accounts Setup</h3>
                    <p className="text-gray-400 text-xs">Configure where you receive ticket sales payouts</p>
                  </div>

                  {/* Payment Method Switcher */}
                  <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl gap-2 w-fit">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("mpesa")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                        payoutMethod === "mpesa"
                          ? "bg-[#00C2A8] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Smartphone size={14} />
                      M-Pesa (Kenya Mobile Money)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("bank")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                        payoutMethod === "bank"
                          ? "bg-[#6C4DFF] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Building size={14} />
                      Bank Account Transfer
                    </button>
                  </div>

                  {/* Payout Details input forms */}
                  <form onSubmit={handleSavePayoutSettings} className="space-y-4 pt-2">
                    {payoutMethod === "mpesa" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Registered Name (Safaricom M-Pesa)</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#00C2A8]" : "bg-white border-gray-200 focus:border-[#00C2A8]"
                            }`}
                            value={mpesaName}
                            onChange={(e) => setMpesaName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Registered Safaricom Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-sm text-gray-400 font-bold">+254</span>
                            <input
                              type="text"
                              required
                              pattern="[0-9]{9,10}"
                              className={`w-full text-sm pl-14 pr-4 py-3 rounded-xl border outline-none ${
                                darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#00C2A8]" : "bg-white border-gray-200 focus:border-[#00C2A8]"
                              }`}
                              placeholder="712345678"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Bank Name</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Account Holder Name</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Account Number</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">SWIFT / BIC Code</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankSwift}
                            onChange={(e) => setBankSwift(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        <Save size={14} />
                        Save Payout Details
                      </button>

                      {saveSettingsSuccess && (
                        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                          <Check size={14} />
                          Saved successfully!
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Quick Info card */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <h4 className="font-bold text-sm">Payout Rules & Fees</h4>
                  <ul className="space-y-3 text-xs text-gray-400 font-medium">
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>M-Pesa instant transfers reflect within 2 minutes. Instant payout fee is 1.5%.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>Regular bank transfers are free of charge and processed automatically every Saturday.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>Minimum transfer limit is KES 500; maximum per single instant transfer is KES 150,000 due to Central Bank regulation.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payout History list */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="font-bold text-md">Payouts History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                        <th className="px-6 py-4 font-semibold">Date Completed</th>
                        <th className="px-4 py-4 font-semibold">Payout ID</th>
                        <th className="px-4 py-4 font-semibold">Amount Transferred</th>
                        <th className="px-4 py-4 font-semibold">Destination Method</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {payoutsHistory.map((history) => (
                        <tr key={history.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                          <td className="px-6 py-4 text-gray-400">{history.date}</td>
                          <td className="px-4 py-4 font-mono text-xs font-semibold text-gray-400">{history.id}</td>
                          <td className="px-4 py-4 font-black">{history.amount}</td>
                          <td className="px-4 py-4 font-medium text-gray-400">{history.method}</td>
                          <td className="px-4 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                              <Check size={12} className="text-emerald-500" />
                              {history.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 6. VIEW: SETTINGS */}
          {currentPath === "/organizer-dashboard/settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Profile Config */}
              <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div>
                  <h3 className="font-bold text-lg">Organization Profile</h3>
                  <p className="text-gray-400 text-xs">Configure your public facing branding as an organizer</p>
                </div>

                <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                      AF
                    </div>
                    <div className="space-y-1 w-full text-center md:text-left">
                      <p className="text-sm font-semibold">Branding Logo</p>
                      <p className="text-gray-400 text-xs">PNG, JPG up to 2MB. Logo appears on all your public ticket pages.</p>
                      <button type="button" className={`px-4 py-1.5 rounded-lg text-xs font-bold mt-1 border transition ${
                        darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}>
                        Upload Logo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">Organization Name</label>
                      <input
                        type="text"
                        required
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">Contact / Billing Email</label>
                      <input
                        type="email"
                        required
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-400">Website Address</label>
                      <input
                        type="url"
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-400">Organization Description</label>
                      <textarea
                        rows={3}
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] resize-none ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgBio}
                        onChange={(e) => setOrgBio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                    >
                      <Save size={14} />
                      Save General Profile
                    </button>

                    {settingsSaved && (
                      <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                        <Check size={14} />
                        Profile updated!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Notifications and Security panel */}
              <div className="space-y-5">
                {/* Security settings */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <Shield size={16} className="text-[#6C4DFF]" />
                    <h4 className="font-bold text-sm">Security Controls</h4>
                  </div>
                  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!currentPassword || !newPassword || !confirmPassword) {
                        toast({
                          title: "Verification Error",
                          description: "All password fields are required.",
                          variant: "destructive",
                        });
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        toast({
                          title: "Verification Error",
                          description: "New passwords do not match.",
                          variant: "destructive",
                        });
                        return;
                      }
                      setSecuritySaved(true);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setTimeout(() => setSecuritySaved(false), 3000);
                      toast({
                        title: "Password Updated ",
                        description: "Your account password has been changed successfully.",
                      });
                    }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-xs bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white font-bold py-2.5 rounded-lg transition"
                    >
                      Update Password
                    </button>
                    {securitySaved && (
                      <span className="text-emerald-500 text-xs font-semibold flex items-center justify-center gap-1 mt-2">
                        <Check size={14} />
                        Password changed!
                      </span>
                    )}
                  </form>
                </div>

                {/* Notifications setup */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <Bell size={16} className="text-[#00C2A8]" />
                    <h4 className="font-bold text-sm">Sale Notifications</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Toggle row 1 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Email on Ticket Sale</p>
                        <p className="text-[10px] text-gray-400">Receive alert for every registration</p>
                      </div>
                      <button
                        onClick={() => setEmailOnTicketSale(!emailOnTicketSale)}
                        className={`w-9 h-5 rounded-full transition relative ${emailOnTicketSale ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${emailOnTicketSale ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 2 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Daily Digest Digest</p>
                        <p className="text-[10px] text-gray-400">Summarized transaction email daily</p>
                      </div>
                      <button
                        onClick={() => setDailyDigest(!dailyDigest)}
                        className={`w-9 h-5 rounded-full transition relative ${dailyDigest ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${dailyDigest ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 3 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Weekly Performance Report</p>
                        <p className="text-[10px] text-gray-400">Full analysis report on Monday mornings</p>
                      </div>
                      <button
                        onClick={() => setWeeklyDigest(!weeklyDigest)}
                        className={`w-9 h-5 rounded-full transition relative ${weeklyDigest ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${weeklyDigest ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 4 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Security Alerts</p>
                        <p className="text-[10px] text-gray-400">Instant notification on account settings changes</p>
                      </div>
                      <button
                        onClick={() => setSecurityAlerts(!securityAlerts)}
                        className={`w-9 h-5 rounded-full transition relative ${securityAlerts ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${securityAlerts ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {currentPath === "/post-event" && (
            <CreateEventForm />
          )}

          {currentPath === "/help" && (
            <HelpPageContent />
          )}

        </div>
      </main>
    </div>
  );
}
