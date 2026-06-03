import { Layout } from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Share2, Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function EventDetail() {
  const { id } = useParams();
  const [generalTickets, setGeneralTickets] = useState(0);
  const [vipTickets, setVipTickets] = useState(0);
  const [vvipTickets, setVvipTickets] = useState(0);

  const generalPrice = 2500;
  const vipPrice = 7500;
  const vvipPrice = 15000;
  const serviceFeePct = 0.1;

  const subtotal = generalTickets * generalPrice + vipTickets * vipPrice + vvipTickets * vvipPrice;
  const serviceFee = Math.floor(subtotal * serviceFeePct);
  const total = subtotal + serviceFee;

  const handleGeneralAdd = () => setGeneralTickets(prev => prev + 1);
  const handleGeneralRemove = () => setGeneralTickets(prev => Math.max(0, prev - 1));
  const handleVipAdd = () => setVipTickets(prev => prev + 1);
  const handleVipRemove = () => setVipTickets(prev => Math.max(0, prev - 1));
  const handleVvipAdd = () => setVvipTickets(prev => prev + 1);
  const handleVvipRemove = () => setVvipTickets(prev => Math.max(0, prev - 1));

  const isValid = generalTickets > 0 || vipTickets > 0 || vvipTickets > 0;

  // Render dynamic image based on event ID, fallback to image 11
  const getEventDetailImage = (eventId: string | undefined) => {
    const numId = eventId ? parseInt(eventId, 10) : 11;
    const index = isNaN(numId) ? 11 : ((numId - 1) % 5) + 11; // Choose between 11 and 15 for premium layouts
    return `/image ${index}.jpg`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal mb-8 font-bold transition duration-200"
        >
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        {/* Event Hero */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="rounded-2xl h-96 mb-8 overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={getEventDetailImage(id)}
                alt="AfroNation Nairobi 2025"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-wadu-purple font-extrabold text-sm uppercase">
                  Music & Concerts
                </span>
                <span className="text-wadu-teal font-extrabold text-sm uppercase bg-wadu-teal/10 border border-wadu-teal/20 px-3 py-1 rounded-full">
                  On Sale
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-wadu-navy dark:text-white mb-4 leading-tight">
                AfroNation Nairobi 2025
              </h1>

              <div className="space-y-3 text-slate-600 dark:text-slate-300 mb-8 font-medium">
                <div className="flex items-center gap-3">
                  <Calendar className="text-wadu-teal" size={20} />
                  <span>Aug 15-17, 2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-wadu-teal" size={20} />
                  <span>Uhuru Gardens, Nairobi</span>
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Get ready for the ultimate African music experience! AfroNation
                Nairobi 2025 brings you a weekend of non-stop energy, world-class
                performances, and cultural celebration under the stars. Don't miss
                out on the biggest festival of the year!
              </p>
              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-4">Lineup</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {["Burna Boy", "Wizkid", "Sauti Sol", "Tiwa Savage"].map(
                  (artist) => (
                    <div key={artist} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-wadu-navy text-wadu-teal flex items-center justify-center font-extrabold border border-wadu-teal/20 mx-auto mb-2">
                        🎤
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                        {artist}
                      </p>
                    </div>
                  )
                )}
              </div>

              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Full Bar",
                  "Secure Parking",
                  "Food Vendors",
                  "VIP Lounges",
                  "Cashless Zone",
                ].map((amenity) => (
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

          {/* Sidebar - Ticket Selection */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sticky top-24 shadow-md transition duration-300">
              <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-6">
                Get Your Tickets
              </h3>

              <div className="space-y-6 mb-8">
                {/* General Admission */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-wadu-navy dark:text-white">
                        General Admission
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        General access
                      </p>
                    </div>
                    <p className="font-extrabold text-wadu-navy dark:text-white">KES {generalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGeneralRemove}
                      disabled={generalTickets === 0}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-wadu-teal hover:text-wadu-navy disabled:opacity-50 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg transition duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-bold text-wadu-navy dark:text-white text-base">
                      {generalTickets}
                    </span>
                    <button
                      onClick={handleGeneralAdd}
                      className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal p-2.5 rounded-lg transition duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* VIP */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-wadu-navy dark:text-white">VIP Access</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Front-row seating & backstage
                      </p>
                    </div>
                    <p className="font-extrabold text-wadu-navy dark:text-white">KES {vipPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleVipRemove}
                      disabled={vipTickets === 0}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-wadu-teal hover:text-wadu-navy disabled:opacity-50 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg transition duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-bold text-wadu-navy dark:text-white text-base">
                      {vipTickets}
                    </span>
                    <button
                      onClick={handleVipAdd}
                      className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal p-2.5 rounded-lg transition duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* VVIP */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-wadu-navy dark:text-white">VVIP Experience</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Premium access & catering
                      </p>
                    </div>
                    <p className="font-extrabold text-wadu-navy dark:text-white">KES {vvipPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleVvipRemove}
                      disabled={vvipTickets === 0}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-wadu-teal hover:text-wadu-navy disabled:opacity-50 text-slate-700 dark:text-slate-300 p-2.5 rounded-lg transition duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-bold text-wadu-navy dark:text-white text-base">
                      {vvipTickets}
                    </span>
                    <button
                      onClick={handleVvipAdd}
                      className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal p-2.5 rounded-lg transition duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
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

              {/* CTA */}
              {!isValid ? (
                <button
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-3.5 rounded-xl font-bold disabled:opacity-50 text-sm shadow-sm"
                >
                  Select tickets to continue
                </button>
              ) : (
                <Link
                  to="/checkout"
                  className="block w-full bg-wadu-navy border border-wadu-navy/15 text-white py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 text-center text-sm shadow-md"
                >
                  Continue to Checkout
                </Link>
              )}

              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4 font-semibold">
                ✓ 100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
