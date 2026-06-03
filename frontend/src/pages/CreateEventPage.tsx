import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Check } from "lucide-react";

export function CreateEventForm() {
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                step >= 1
                  ? "bg-wadu-purple text-white shadow-sm"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {step > 1 ? <Check size={24} /> : "1"}
            </div>
            <span
              className={`text-sm font-bold ${
                step >= 1 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
              }`}
            >
              Event Info
            </span>
          </div>

          {/* Line 1 */}
          <div
            className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
              step >= 2
                ? "bg-wadu-purple"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                step >= 2
                  ? "bg-wadu-purple text-white shadow-sm"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {step > 2 ? <Check size={24} /> : "2"}
            </div>
            <span
              className={`text-sm font-bold ${
                step >= 2 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
              }`}
            >
              Tickets
            </span>
          </div>

          {/* Line 2 */}
          <div
            className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
              step >= 3
                ? "bg-wadu-purple"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                step >= 3
                  ? "bg-wadu-purple text-white shadow-sm"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}
            >
              3
            </div>
            <span
              className={`text-sm font-bold ${
                step >= 3 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
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
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-6">
              Create Event: Event Info Step 1
            </h2>

            {/* Basic Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Basic Info</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-805 dark:text-white placeholder-slate-455 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-805 dark:text-white placeholder-slate-455 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">
                Date & Time
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Location</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-850 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl h-48 flex items-center justify-center text-slate-400 font-semibold text-sm">
                  Map Preview
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Settings</h3>
              <div className="flex gap-3 mb-6">
                {["Public", "Private", "Invite Only"].map((setting) => (
                  <button
                    key={setting}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition duration-200 ${
                      setting === "Public"
                        ? "bg-wadu-purple text-white border border-wadu-purple"
                        : "bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:border-wadu-teal dark:hover:border-wadu-teal hover:text-wadu-teal"
                    }`}
                  >
                    {setting}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {["Conference", "Tech", "Networking"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-wadu-navy text-wadu-teal border border-wadu-teal/20 px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm bg-opacity-95"
                    >
                      {tag}
                      <button className="hover:text-white text-base leading-none">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-wadu-teal hover:text-wadu-teal transition duration-200 shadow-sm">
                Save as Draft
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-wadu-navy border border-wadu-navy/15 text-white py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 text-center shadow-md"
              >
                Continue to Tickets
              </button>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sticky top-24 shadow-md transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">
                Live Preview
              </h3>
              <div className="rounded-xl h-40 mb-4 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <img
                  src="/image 12.jpg"
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-wadu-navy dark:text-white font-bold text-base mb-1">
                  {eventName || "Event Name"}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold">
                  {startDate} - {endDate}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  📍 {venueName || "Venue"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 & 3 Placeholders */}
      {step !== 1 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-extrabold text-wadu-navy dark:text-white mb-4">
            Step {step} Coming Soon
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-semibold">
            This step is being built out. Check back soon!
          </p>
          <button
            onClick={() => setStep(1)}
            className="bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm"
          >
            Back to Step 1
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreateEvent() {
  return (
    <Layout>
      <CreateEventForm />
    </Layout>
  );
}
