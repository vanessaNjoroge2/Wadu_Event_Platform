import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { toast } = useToast();
  const [upcomingTickets, setUpcomingTickets] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: "Tickets Purchased", value: "0", icon: Ticket, color: "text-wadu-black", bg: "bg-wadu-yellow" },
    { label: "Events Attended", value: "0", icon: Star, color: "text-wadu-black", bg: "bg-white" },
    { label: "Upcoming Events", value: "0", icon: Calendar, color: "text-wadu-yellow", bg: "bg-wadu-black" },
  ]);

  const handleDeleteTicket = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setUpcomingTickets(prev => prev.filter(t => t.id !== orderId));
      toast({
        title: "Ticket deleted successfully",
        description: "The past ticket has been removed from your dashboard.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to delete ticket",
        description: err.message || "An error occurred while deleting the ticket.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    api.get<any[]>("/orders")
      .then((orders) => {
        if (Array.isArray(orders)) {
          const paidOrders = orders.filter(o => o.paymentStatus === "PAID");
          const ticketsList: any[] = [];
          let totalPurchased = 0;
          const distinctEvents = new Set<string>();
          const distinctUpcomingEvents = new Set<string>();
          const now = new Date();

          paidOrders.forEach(o => {
            distinctEvents.add(o.eventId);
            const eventEndDate = o.event.endDate ? new Date(o.event.endDate) : new Date(o.event.startDate);
            const isUpcoming = new Date(o.event.startDate) > now;
            const isAttended = eventEndDate < now;

            if (isUpcoming) {
              distinctUpcomingEvents.add(o.eventId);
            }

            o.items.forEach((item: any) => {
              totalPurchased += item.quantity;
              ticketsList.push({
                id: o.id,
                title: o.event.title,
                date: new Date(o.event.startDate).toLocaleString(),
                location: o.event.location,
                seat: item.ticketType.name,
                status: isAttended ? "Attended" : "Confirmed",
                isAttended,
              });
            });
          });

          setUpcomingTickets(ticketsList);
          setStats([
            { label: "Tickets Purchased", value: totalPurchased.toString(), icon: Ticket, color: "text-wadu-black", bg: "bg-wadu-yellow" },
            { label: "Events Attended", value: distinctEvents.size.toString(), icon: Star, color: "text-wadu-black", bg: "bg-white" },
            { label: "Upcoming Events", value: distinctUpcomingEvents.size.toString(), icon: Calendar, color: "text-wadu-yellow", bg: "bg-wadu-black" },
          ]);
        }
      })
      .catch((err) => console.error("Error loading dashboard data:", err));
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-wadu-black font-black text-lg uppercase tracking-widest mb-2 border-b-4 border-wadu-black inline-block pb-1">
              My Account
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-wadu-black uppercase">Dashboard</h1>
            <p className="text-wadu-black font-bold mt-4 text-xl bg-wadu-yellow inline-block px-4 py-2 border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
              Welcome back! Here's what's coming up.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`${stat.bg} border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] transform transition-transform hover:-translate-y-2`}
              >
                <div className="flex justify-between items-start mb-6">
                  <Icon className={`${stat.color}`} size={48} />
                  <p className={`text-6xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <p className={`text-xl font-black uppercase ${stat.color} border-t-4 border-current pt-4`}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-8 border-b-4 border-wadu-black pb-4">
              <h2 className="text-3xl font-black text-wadu-black uppercase">My Tickets</h2>
              <Link
                to="/explore"
                className="bg-wadu-black text-wadu-yellow px-6 py-3 font-black uppercase text-sm border-2 border-wadu-black hover:bg-white hover:text-wadu-black transition shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] flex items-center gap-2"
              >
                Browse <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-6">
              {upcomingTickets.map((ticket, i) => (
                <div
                  key={ticket.id}
                  className="bg-white border-4 border-wadu-black hover:bg-wadu-yellow transition shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] group"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div
                      className={`w-full sm:w-4 flex-shrink-0 border-b-4 sm:border-b-0 sm:border-r-4 border-wadu-black ${i % 2 === 0 ? "bg-wadu-black" : "bg-white"}`}
                    />
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-wadu-black uppercase mb-4 leading-tight group-hover:underline">
                            {ticket.title}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold uppercase text-wadu-black">
                            <p className="flex items-center gap-3">
                              <Clock size={18} className="text-wadu-black" /> {ticket.date}
                            </p>
                            <p className="flex items-center gap-3">
                              <MapPin size={18} className="text-wadu-black" /> {ticket.location}
                            </p>
                            <p className="flex items-center gap-3">
                              <Ticket size={18} className="text-wadu-black" /> {ticket.seat}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`text-sm font-black uppercase px-4 py-2 border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] inline-block ${
                              ticket.status === "Confirmed"
                                ? "bg-wadu-yellow text-wadu-black"
                                : ticket.status === "Attended"
                                ? "bg-white text-wadu-black"
                                : "bg-wadu-black text-wadu-yellow"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t-4 border-wadu-black gap-4">
                        <span className="text-sm text-wadu-black font-black uppercase bg-white border-2 border-wadu-black px-3 py-1">
                          TKT #: TKT-{ticket.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}
                        </span>
                        
                        <div className="flex gap-4 items-center w-full sm:w-auto">
                          {ticket.isAttended && (
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="bg-white text-red-600 hover:bg-red-600 hover:text-white border-4 border-red-600 px-4 py-3 font-black uppercase transition duration-200 text-sm shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] flex items-center gap-2 hover:-translate-y-1 hover:-translate-x-1"
                              title="Delete past ticket"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="flex-1 sm:flex-none bg-wadu-black text-wadu-yellow hover:bg-white hover:text-wadu-black px-6 py-3 border-4 border-wadu-black font-black uppercase transition duration-200 text-sm shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(5,5,5,1)]">
                                View Ticket
                              </button>
                            </DialogTrigger>
                            <DialogContent className="bg-wadu-yellow border-8 border-wadu-black max-w-md shadow-[16px_16px_0px_0px_rgba(5,5,5,1)] p-8">
                              <DialogHeader>
                                <DialogTitle className="text-wadu-black font-black text-3xl mb-4 text-center uppercase border-b-4 border-wadu-black pb-4">
                                  {ticket.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 my-6">
                                <div className="text-wadu-black text-lg font-bold uppercase space-y-2 bg-white border-4 border-wadu-black p-6 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                                  <p className="flex items-center gap-3"><Clock size={20} /> {ticket.date}</p>
                                  <p className="flex items-center gap-3"><MapPin size={20} /> {ticket.location}</p>
                                  <p className="flex items-center gap-3"><Ticket size={20} /> {ticket.seat}</p>
                                </div>
                                
                                <div className="w-64 h-64 bg-white border-4 border-wadu-black shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] flex items-center justify-center mx-auto p-4">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WDU-TICKET-${ticket.id}`}
                                    alt="Ticket QR Code"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              
                              <button
                                onClick={() => {
                                  toast({
                                    title: "Ticket downloaded ",
                                    description: `Saved ticket for ${ticket.title} to your device.`,
                                  });
                                }}
                                className="w-full bg-wadu-black text-wadu-yellow hover:bg-white hover:text-wadu-black border-4 border-wadu-black py-4 font-black uppercase text-lg transition duration-200 shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                              >
                                Download Ticket
                              </button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-wadu-black mb-8 uppercase border-b-4 border-wadu-black pb-4">Quick Actions</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Explore Events",
                  to: "/explore",
                  icon: Calendar,
                },
                {
                  label: "Browse Categories",
                  to: "/categories",
                  icon: Star,
                },
                {
                  label: "Find by City",
                  to: "/cities",
                  icon: MapPin,
                },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex items-center gap-6 bg-white border-4 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow text-wadu-black p-4 transition group shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                  >
                    <div
                      className="w-12 h-12 bg-wadu-yellow text-wadu-black border-4 border-wadu-black flex items-center justify-center flex-shrink-0 group-hover:bg-white"
                    >
                      <Icon size={24} />
                    </div>
                    <span className="font-black uppercase text-lg transition duration-200">
                      {action.label}
                    </span>
                    <ArrowRight
                      size={24}
                      className="ml-auto transition-transform duration-200 group-hover:translate-x-2"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 bg-wadu-black border-4 border-wadu-black p-8 text-center text-wadu-yellow shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <p className="font-black mb-4 text-3xl uppercase">Get the App</p>
              <p className="text-white text-base font-bold mb-8 uppercase bg-wadu-black border-2 border-white/20 p-4">
                Manage tickets on the go
              </p>
              <div className="space-y-4">
                <button className="w-full bg-white border-4 border-wadu-black text-wadu-black px-6 py-4 text-lg font-black uppercase hover:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1">
                  App Store
                </button>
                <button className="w-full bg-white border-4 border-wadu-black text-wadu-black px-6 py-4 text-lg font-black uppercase hover:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1">
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
