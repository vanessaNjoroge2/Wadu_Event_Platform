import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Share2, Plus, Minus } from "lucide-react";

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
          <div className="animate-spin rounded-none h-16 w-16 border-8 border-wadu-black border-t-wadu-yellow mx-auto mb-6"></div>
          <p className="text-wadu-black font-black uppercase text-2xl">Loading event details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-wadu-yellow border-4 border-wadu-black shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] max-w-2xl mt-12">
          <h2 className="text-4xl font-black uppercase text-wadu-black mb-4">Event Not Found</h2>
          <p className="text-wadu-black font-bold mb-8">{error || "The event you are looking for does not exist."}</p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-black border-2 border-wadu-black text-wadu-yellow px-8 py-4 rounded-none font-black uppercase hover:bg-white hover:text-wadu-black transition duration-200 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
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

    const orderItems = event.tickets.reduce((acc: any[], t: any) => {
      const qty = ticketQuantities[t.id] || 0;
      if (qty > 0) {
        acc.push({ ticketTypeId: t.id, quantity: qty });
      }
      return acc;
    }, []);

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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-wadu-black hover:text-wadu-black/70 mb-6 font-black uppercase text-sm md:text-base transition duration-200"
        >
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="rounded-none h-56 sm:h-72 md:h-96 mb-6 md:mb-8 overflow-hidden bg-slate-100 border-4 border-wadu-black shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
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

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-wadu-black text-wadu-yellow px-4 py-2 border-2 border-wadu-black font-black uppercase">
                  {event.category}
                </span>
                <span className="bg-white text-wadu-black px-4 py-2 border-2 border-wadu-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                  {event.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-wadu-black mb-6 leading-none uppercase break-words">
                {event.title}
              </h1>

              <div className="space-y-4 text-wadu-black mb-8 font-bold text-xl uppercase">
                <div className="flex items-center gap-4">
                  <Calendar className="text-wadu-black" size={28} />
                  <span>
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    AT {event.startTime}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-wadu-black" size={28} />
                  <span>{event.location}</span>
                </div>
              </div>

              <button className="inline-flex items-center gap-3 bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-6 py-3 font-black uppercase transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(5,5,5,1)]">
                <Share2 size={20} />
                Share Event
              </button>
            </div>

            <div className="border-t-8 border-wadu-black pt-12 mb-8">
              <h2 className="text-4xl font-black uppercase text-wadu-black mb-6">
                About this event
              </h2>
              <p className="text-wadu-black text-lg leading-relaxed mb-10 font-medium">
                {event.description}
              </p>

              <h3 className="text-2xl font-black uppercase text-wadu-black mb-6">Organizer</h3>
              <div className="flex items-center gap-6 mb-12 bg-wadu-yellow border-4 border-wadu-black p-6 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
                <div className="w-16 h-16 rounded-none bg-wadu-black text-wadu-yellow flex items-center justify-center font-black text-xl border-4 border-wadu-black">
                  ORG
                </div>
                <div>
                  <p className="text-wadu-black font-black text-xl uppercase">
                    {event.organizer.name}
                  </p>
                  <p className="text-wadu-black font-bold text-sm uppercase">{event.organizer.email}</p>
                </div>
              </div>

              <h3 className="text-2xl font-black uppercase text-wadu-black mb-6">Amenities</h3>
              <div className="flex flex-wrap gap-4">
                {fallbackAmenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-white border-4 border-wadu-black text-wadu-black px-5 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-wadu-yellow border-4 md:border-8 border-wadu-black rounded-none p-6 md:p-8 md:sticky md:top-28 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] md:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-3xl font-black uppercase text-wadu-black mb-8 border-b-4 border-wadu-black pb-4">
                Get Tickets
              </h3>

              <div className="space-y-6 mb-10">
                {event.tickets.map((t: any) => {
                  const qty = ticketQuantities[t.id] || 0;
                  return (
                    <div key={t.id} className="bg-white border-4 border-wadu-black p-4 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-wadu-black text-lg uppercase">{t.name}</p>
                          <p className="text-sm text-wadu-black font-bold mt-1 uppercase">
                            {t.description || "Access to the event"}
                          </p>
                          <p className="text-xs text-wadu-black/70 mt-1 font-black uppercase">
                            {t.available} Available
                          </p>
                        </div>
                        <p className="font-black text-wadu-black text-xl bg-wadu-yellow border-2 border-wadu-black px-3 py-1">
                          KES {t.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t-2 border-wadu-black pt-4">
                        <button
                          onClick={() => handleTicketQtyChange(t.id, -1, t.available)}
                          disabled={qty === 0}
                          className="bg-white border-4 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-wadu-black text-wadu-black p-2 transition duration-200"
                        >
                          <Minus size={24} />
                        </button>
                        <span className="flex-1 text-center font-black text-wadu-black text-2xl">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleTicketQtyChange(t.id, 1, t.available)}
                          disabled={qty >= t.available}
                          className="bg-wadu-black border-4 border-wadu-black text-wadu-yellow hover:bg-white hover:text-wadu-black disabled:opacity-50 p-2 transition duration-200"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white border-4 border-wadu-black p-6 mb-8 space-y-4 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                <div className="flex justify-between text-wadu-black font-black uppercase">
                  <span>Subtotal:</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-wadu-black font-black uppercase">
                  <span>Service Fee:</span>
                  <span>KES {serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t-4 border-wadu-black pt-4 flex justify-between text-wadu-black font-black text-2xl uppercase">
                  <span>Total:</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              {!isValid ? (
                <button
                  disabled
                  className="w-full bg-white border-4 border-wadu-black text-wadu-black/50 py-5 rounded-none font-black text-xl uppercase transition shadow-[4px_4px_0px_0px_rgba(5,5,5,0.2)] cursor-not-allowed"
                >
                  Select Tickets
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-wadu-black border-4 border-wadu-black text-wadu-yellow py-5 rounded-none font-black uppercase hover:bg-white hover:text-wadu-black transition duration-200 text-center text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                >
                  Checkout
                </button>
              )}

              <p className="text-xs text-wadu-black text-center mt-6 font-black uppercase">
                100% BUYER GUARANTEE. TICKETS ARE SECURE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
