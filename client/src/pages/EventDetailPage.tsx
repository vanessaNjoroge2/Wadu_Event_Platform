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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        {/* Event Hero */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl h-96 mb-8" />

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-purple-400 font-semibold text-sm uppercase">
                  Music & Concerts
                </span>
                <span className="text-orange-400 font-semibold text-sm uppercase bg-orange-500/20 px-3 py-1 rounded-full">
                  On Sale
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                AfroNation Nairobi 2025
              </h1>

              <div className="space-y-3 text-gray-300 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar size={20} />
                  <span>Aug 15-17, 2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <span>Uhuru Gardens, Nairobi</span>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold">
                <Share2 size={20} />
                Share Event
              </button>
            </div>

            <div className="border-t border-slate-700 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                About this event
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Get ready for the ultimate African music experience! AfroNation
                Nairobi 2025 brings you a weekend of non-stop energy, world-class
                performances, and cultural celebration under the stars. Don't miss
                out on the biggest festival of the year!
              </p>
              <h3 className="text-xl font-bold text-white mb-3">Lineup</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["Burna Boy", "Wizkid", "Sauti Sol", "Tiwa Savage"].map(
                  (artist) => (
                    <div key={artist} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mx-auto mb-2" />
                      <p className="text-gray-300 font-semibold text-sm">
                        {artist}
                      </p>
                    </div>
                  )
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Amenities</h3>
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
                    className="bg-slate-800 text-gray-300 px-4 py-2 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="md:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">
                Get Your Tickets
              </h3>

              <div className="space-y-6 mb-8">
                {/* General Admission */}
                <div className="border-b border-slate-700 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">
                        General Admission
                      </p>
                      <p className="text-sm text-gray-400">
                        General access
                      </p>
                    </div>
                    <p className="font-bold text-white">KES {generalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGeneralRemove}
                      disabled={generalTickets === 0}
                      className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white p-2 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-semibold text-white">
                      {generalTickets}
                    </span>
                    <button
                      onClick={handleGeneralAdd}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* VIP */}
                <div className="border-b border-slate-700 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">VIP Access</p>
                      <p className="text-sm text-gray-400">
                        Front-row seating & backstage
                      </p>
                    </div>
                    <p className="font-bold text-white">KES {vipPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleVipRemove}
                      disabled={vipTickets === 0}
                      className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white p-2 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-semibold text-white">
                      {vipTickets}
                    </span>
                    <button
                      onClick={handleVipAdd}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* VVIP */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">VVIP Experience</p>
                      <p className="text-sm text-gray-400">
                        Premium access & catering
                      </p>
                    </div>
                    <p className="font-bold text-white">KES {vvipPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleVvipRemove}
                      disabled={vvipTickets === 0}
                      className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white p-2 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-semibold text-white">
                      {vvipTickets}
                    </span>
                    <button
                      onClick={handleVvipAdd}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Fee:</span>
                  <span>KES {serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-600 pt-2 flex justify-between text-white font-bold">
                  <span>Total:</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA */}
              {!isValid ? (
                <button
                  disabled
                  className="w-full bg-slate-700 text-gray-400 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  Select tickets to continue
                </button>
              ) : (
                <Link
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-center"
                >
                  Continue to Checkout
                </Link>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
