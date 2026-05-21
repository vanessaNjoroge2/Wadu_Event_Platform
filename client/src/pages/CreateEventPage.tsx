import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function CreateEvent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [eventName, setEventName] = useState("Tech Conference 2025");
  const [category, setCategory] = useState("Tech");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("2025-10-15");
  const [endDate, setEndDate] = useState("2025-10-17");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [venueName, setVenueName] = useState("Convention Center");
  const [address, setAddress] = useState("");

  const categories = [
    "Music",
    "Tech",
    "Sports",
    "Conferences",
    "Festivals",
    "Workshops",
    "Exhibitions",
    "Other",
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                  step >= 1
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                {step > 1 ? <Check size={24} /> : "1"}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 1 ? "text-white" : "text-gray-500"
                }`}
              >
                Event Info
              </span>
            </div>

            {/* Line 1 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition ${
                step >= 2
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-slate-800"
              }`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                  step >= 2
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={24} /> : "2"}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 2 ? "text-white" : "text-gray-500"
                }`}
              >
                Tickets
              </span>
            </div>

            {/* Line 2 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition ${
                step >= 3
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-slate-800"
              }`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                  step >= 3
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 3 ? "text-white" : "text-gray-500"
                }`}
              >
                Media
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">
                Create Event: Event Info Step 1
              </h2>

              {/* Basic Info */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Basic Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Describe your event..."
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Date & Time
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-semibold mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Location</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="bg-slate-700 border border-slate-600 rounded-lg h-48 flex items-center justify-center text-gray-500">
                    Map Preview
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Settings</h3>
                <div className="flex gap-3 mb-4">
                  {["Public", "Private", "Invite Only"].map((setting) => (
                    <button
                      key={setting}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        setting === "Public"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-slate-700 text-gray-400 hover:bg-slate-600"
                      }`}
                    >
                      {setting}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Conference", "Tech", "Networking"].map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 rounded-lg font-semibold text-white bg-slate-700 hover:bg-slate-600 transition">
                  Save as Draft
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Continue to Tickets
                </button>
              </div>
            </div>

            {/* Live Preview Sidebar */}
            <div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">
                  Live Preview
                </h3>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg h-40 mb-4" />
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    {eventName || "Event Name"}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {startDate} - {endDate}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {venueName || "Venue"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 & 3 Placeholders */}
        {step !== 1 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Step {step} Coming Soon
            </h2>
            <p className="text-gray-400 mb-6">
              This step is being built out. Check back soon!
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Back to Step 1
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
