import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Share2, Plus, Minus } from "lucide-react";

const mockEvents: Record<number, {
  title: string;
  category: string;
  location: string;
  date: string;
  price: string;
  status: string;
  description: string;
  lineup: string[];
  amenities: string[];
  generalPrice: number;
  vipPrice: number;
  vvipPrice: number;
}> = {
  1: {
    title: "AfroNation Nairobi 2025",
    category: "Music",
    location: "Uhuru Gardens, Nairobi",
    date: "Aug 15-17, 2025",
    price: "From KES 3,500",
    status: "ON SALE",
    description: "Get ready for the ultimate African music experience! AfroNation Nairobi 2025 brings you a weekend of non-stop energy, world-class performances, and cultural celebration under the stars. Don't miss out on the biggest festival of the year!",
    lineup: ["Burna Boy", "Wizkid", "Sauti Sol", "Tiwa Savage"],
    amenities: ["Full Bar", "Secure Parking", "Food Vendors", "VIP Lounges", "Cashless Zone"],
    generalPrice: 3500,
    vipPrice: 7500,
    vvipPrice: 15000
  },
  2: {
    title: "East Africa Tech Summit",
    category: "Tech",
    location: "Kigali Convention Center, Kigali",
    date: "Oct 20-22, 2025",
    price: "From KES 2,000",
    status: "ON SALE",
    description: "The premier gathering for technology innovators, developers, and tech leaders in East Africa. Explore the latest advancements in AI, Fintech, and cloud technologies through insightful keynotes and workshops.",
    lineup: ["Dr. Evelyn Gitau", "Sam Gichuru", "Charlotte Karungi", "Moses Mwangi"],
    amenities: ["Free Wi-Fi", "Lunch Buffet", "Networking Lounge", "Workshops Access", "Startup Pitches"],
    generalPrice: 2000,
    vipPrice: 5000,
    vvipPrice: 10000
  },
  3: {
    title: "Lamu Cultural Festival",
    category: "Culture",
    location: "Lamu Old Town, Lamu",
    date: "Nov 15-18, 2025",
    price: "From KES 1,200",
    status: "ON SALE",
    description: "An annual celebration of Lamu's rich Swahili heritage. Experience traditional dhow races, donkey races, henna painting, Swahili poetry, and traditional music in Kenya's oldest continually inhabited town.",
    lineup: ["Lamu Cultural Troupe", "Maulidi Singers", "Traditional Dhow Captains", "Swahili Poets"],
    amenities: ["Traditional Food Vendors", "Guided Tours", "Henna Stalls", "Boat Rides", "Arts & Crafts Exhibition"],
    generalPrice: 1200,
    vipPrice: 3000,
    vvipPrice: 6000
  },
  4: {
    title: "Nairobi Food Market",
    category: "Food & Drink",
    location: "Alchemist Bar, Nairobi",
    date: "Sun, Nov 26, 2025",
    price: "From KES 1,500",
    status: "LAST 47 TICKETS",
    description: "Indulge in a culinary journey showcasing the finest street food, artisanal bakes, and gourmet dishes from Nairobi's top chefs and food brands. Live acoustic sessions and craft beer pairings all day long.",
    lineup: ["Chef Raphael", "Nairobi Jazz Trio", "Acoustic Band", "DJ Dinka"],
    amenities: ["Food Tastings", "Craft Beer Tasting", "Live Music", "Kids Zone", "Pet Friendly Area"],
    generalPrice: 1500,
    vipPrice: 4000,
    vvipPrice: 8000
  },
  5: {
    title: "Nairobi Tech Week",
    category: "Tech",
    location: "iHub, Nairobi",
    date: "Oct 15-18, 2025",
    price: "From KES 500",
    status: "ON SALE",
    description: "Nairobi Tech Week is the largest sub-Saharan tech event. Join developers, designers, entrepreneurs, and students for workshops, panel discussions, hackathons, and networking.",
    lineup: ["Tech Leaders Panel", "AI Innovators", "Local Hackers Team", "Startup Founders"],
    amenities: ["Hackathon Entry", "Mentorship Sessions", "Exhibits Hall", "Certificates", "Free Drinks"],
    generalPrice: 500,
    vipPrice: 2000,
    vvipPrice: 5000
  },
  6: {
    title: "Safari Art Biennale",
    category: "Arts & Culture",
    location: "Fort Jesus, Mombasa",
    date: "Fri, Dec 1, 2025",
    price: "From KES 1,800",
    status: "ON SALE",
    description: "A breathtaking showcase of contemporary African art, installations, and photography set against the historic backdrop of Fort Jesus. Meet the artists and discover inspiring visual narratives.",
    lineup: ["Mombasa Visual Artists", "Sculptors Association", "Spoken Word Guild", "Afro-Fusion Ensemble"],
    amenities: ["Art Catalog", "Guided Gallery Walk", "Meet the Artist Sessions", "Wine & Cheese Bar", "Interactive Art Workshops"],
    generalPrice: 1800,
    vipPrice: 4500,
    vvipPrice: 9000
  }
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load event details");
        }
        return res.json();
      })
      .then((json) => {
        setEvent(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading event:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wadu-purple mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-extrabold text-wadu-navy dark:text-white mb-4">Event Not Found</h2>
          <p className="text-slate-500 font-semibold mb-6">{error || "The event you are looking for does not exist."}</p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200"
          >
            Back to Events
          </Link>
        </div>
      </Layout>
    );
  }

  const subtotal = event.tickets.reduce((acc: number, t: any) => {
    const qty = ticketQuantities[t.id] || 0;
    return acc + t.price * qty;
  }, 0);
  const serviceFee = Math.floor(subtotal * 0.1);
  const total = subtotal + serviceFee;
  const isValid = Object.values(ticketQuantities).some((qty) => qty > 0);

  const handleTicketQtyChange = (ticketTypeId: string, change: number, available: number) => {
    setTicketQuantities((prev) => {
      const current = prev[ticketTypeId] || 0;
      const next = Math.max(0, current + change);
      if (next > available) {
        return prev;
      }
      return { ...prev, [ticketTypeId]: next };
    });
  };

  const getEventDetailImage = (eventId: string) => {
    let sum = 0;
    for (let i = 0; i < eventId.length; i++) {
      sum += eventId.charCodeAt(i);
    }
    const index = (sum % 5) + 11;
    return `/image ${index}.jpg`;
  };

  const handleCheckout = () => {
    const selectedTicketsObj = event.tickets.reduce((acc: any, t: any) => {
      const qty = ticketQuantities[t.id] || 0;
      if (qty > 0) {
        acc[t.name.toLowerCase().replace(/\s+/g, "_")] = qty;
      }
      return acc;
    }, {});

    // For backend schema, we also need to pass the mapping of actual ticketTypeIds
    const orderItems = event.tickets.reduce((acc: any[], t: any) => {
      const qty = ticketQuantities[t.id] || 0;
      if (qty > 0) {
        acc.push({ ticketTypeId: t.id, quantity: qty });
      }
      return acc;
    }, []);

    // Create prices mapping
    const pricesObj = event.tickets.reduce((acc: any, t: any) => {
      acc[t.name.toLowerCase().replace(/\s+/g, "_")] = t.price;
      return acc;
    }, {});

    navigate("/checkout", {
      state: {
        eventId: event.id,
        event: {
          title: event.title,
          date: new Date(event.startDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          }) + ` at ${event.startTime}`,
          location: event.location,
        },
        selectedTickets: selectedTicketsObj,
        orderItems,
        prices: pricesObj,
        subtotal,
        serviceFee,
        total,
      },
    });
  };

  const fallbackAmenities = ["Secure Parking", "Food Vendors", "VIP Lounge Access", "Cashless Zone"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal mb-8 font-bold transition duration-200"
        >
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="rounded-2xl h-96 mb-8 overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={event.imageUrl || getEventDetailImage(event.id)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getEventDetailImage(event.id);
                }}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-wadu-purple font-extrabold text-sm uppercase">
                  {event.category}
                </span>
                <span className="text-wadu-teal font-extrabold text-sm uppercase bg-wadu-teal/10 border border-wadu-teal/20 px-3 py-1 rounded-full">
                  {event.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-wadu-navy dark:text-white mb-4 leading-tight">
                {event.title}
              </h1>

              <div className="space-y-3 text-slate-600 dark:text-slate-300 mb-8 font-medium">
                <div className="flex items-center gap-3">
                  <Calendar className="text-wadu-teal" size={20} />
                  <span>
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at {event.startTime}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-wadu-teal" size={20} />
                  <span>{event.location}</span>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-wadu-purple hover:text-wadu-teal font-bold transition duration-200">
                <Share2 size={20} />
                Share Event
              </button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-4">
                About this event
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-semibold">
                {event.description}
              </p>

              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-4">Organizer</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-wadu-navy text-wadu-teal flex items-center justify-center font-extrabold border border-wadu-teal/20">
                  ORG
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-350 font-bold text-sm">
                    {event.organizer.name}
                  </p>
                  <p className="text-slate-500 text-xs font-semibold">{event.organizer.email}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {fallbackAmenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sticky top-24 shadow-md transition duration-300">
              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-6">
                Get Your Tickets
              </h3>

              <div className="space-y-6 mb-8">
                {event.tickets.map((t: any) => {
                  const qty = ticketQuantities[t.id] || 0;
                  return (
                    <div key={t.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-wadu-navy dark:text-white">{t.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                            {t.description || "Access to the event"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {t.available} tickets available
                          </p>
                        </div>
                        <p className="font-extrabold text-wadu-navy dark:text-white">
                          KES {t.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTicketQtyChange(t.id, -1, t.available)}
                          disabled={qty === 0}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-wadu-teal hover:text-wadu-navy disabled:opacity-50 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg transition duration-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="flex-1 text-center font-bold text-wadu-navy dark:text-white text-base">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleTicketQtyChange(t.id, 1, t.available)}
                          disabled={qty >= t.available}
                          className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal p-2.5 rounded-lg transition duration-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-5 mb-6 space-y-3 transition duration-200">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <span>Subtotal:</span>
                  <span className="text-wadu-navy dark:text-white">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold text-sm">
                  <span>Service Fee:</span>
                  <span className="text-wadu-navy dark:text-white">KES {serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-wadu-navy dark:text-white font-extrabold text-base">
                  <span>Total:</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              {!isValid ? (
                <button
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-3.5 rounded-xl font-bold disabled:opacity-50 text-sm shadow-sm"
                >
                  Select tickets to continue
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="block w-full bg-wadu-navy border border-wadu-navy/15 text-white py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 text-center text-sm shadow-md"
                >
                  Continue to Checkout
                </button>
              )}

              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4 font-semibold">
                100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
