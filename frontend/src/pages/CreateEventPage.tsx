import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Check, Plus, Trash2, Calendar, MapPin, Building, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export function CreateEventForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [eventId, setEventId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/Image 1.jpg");
  const [submitting, setSubmitting] = useState(false);

  // Step 1 States
  const [eventName, setEventName] = useState("Tech Conference 2025");
  const [category, setCategory] = useState("Tech");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("2025-10-15");
  const [endDate, setEndDate] = useState("2025-10-17");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [venueName, setVenueName] = useState("Convention Center");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [country, setCountry] = useState("Kenya");
  const [visibility, setVisibility] = useState("Public");
  const [tags, setTags] = useState<string[]>(["Conference", "Tech", "Networking"]);
  const [newTag, setNewTag] = useState("");

  // Step 2 States
  const [tickets, setTickets] = useState<Array<{ id: string; name: string; description: string; price: number; quantity: number }>>([
    { id: "1", name: "General Admission", description: "Standard entry to the event", price: 2500, quantity: 500 },
    { id: "2", name: "VIP Access", description: "Premium seating and fast-track entry", price: 7500, quantity: 100 },
    { id: "3", name: "VVIP Experience", description: "Backstage access and exclusive lounge", price: 15000, quantity: 25 },
  ]);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setEventId(id);
      api.get(`/events/${id}`)
        .then((event: any) => {
          if (event) {
            setEventName(event.title || "");
            setCategory(event.category || "Tech");
            setDescription(event.description || "");
            if (event.startDate) {
              setStartDate(new Date(event.startDate).toISOString().split('T')[0]);
            }
            if (event.endDate) {
              setEndDate(new Date(event.endDate).toISOString().split('T')[0]);
            }
            setStartTime(event.startTime || "09:00");
            setEndTime(event.endTime || "17:00");
            setVenueName(event.venueName || "Convention Center");
            setAddress(event.address || "");
            setCity(event.city || "Nairobi");
            setCountry(event.country || "Kenya");
            if (event.imageUrl) {
              setImageUrl(event.imageUrl);
            }
            if (Array.isArray(event.tickets) && event.tickets.length > 0) {
              setTickets(event.tickets.map((t: any) => ({
                id: t.id,
                name: t.name,
                description: t.description || "",
                price: t.price,
                quantity: t.quantity,
              })));
            }
            setStep(3);
          }
        })
        .catch((err) => {
          toast({
            title: "Error loading event",
            description: err.message || "Could not load event details.",
            variant: "destructive",
          });
        });
    }
  }, []);

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

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        price: 0,
        quantity: 0,
      },
    ]);
  };

  const handleRemoveTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleTicketChange = (id: string, field: string, value: any) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleContinueToStep2 = () => {
    if (
      !eventName.trim() ||
      !category.trim() ||
      !description.trim() ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !venueName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !country.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all event details before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleContinueToStep3 = () => {
    if (tickets.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one ticket tier.",
        variant: "destructive",
      });
      return;
    }
    for (const ticket of tickets) {
      if (!ticket.name.trim() || ticket.price < 0 || ticket.quantity <= 0) {
        toast({
          title: "Validation Error",
          description: "All tickets must have a valid name, non-negative price, and positive quantity.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(3);
  };

  const saveEvent = (eventStatus: "DRAFT" | "PUBLISHED") => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      title: eventName,
      description,
      category,
      location: venueName || "Virtual",
      city: city || "Nairobi",
      country: country || "Kenya",
      venueName: venueName || "Virtual",
      address: address || "Online",
      startDate,
      endDate,
      startTime,
      endTime,
      imageUrl,
      status: eventStatus,
      tickets: tickets.map((t) => ({
        name: t.name,
        description: t.description || "",
        price: Number(t.price),
        quantity: Number(t.quantity),
      })),
    };

    const request = eventId
      ? api.patch(`/events/${eventId}`, payload)
      : api.post("/events", payload);

    request
      .then(() => {
        toast({
          title: eventStatus === "PUBLISHED" ? "Event published successfully" : "Draft Saved",
          description: eventStatus === "PUBLISHED"
            ? `${eventName} is now live.`
            : "Your event draft has been saved successfully.",
        });
        setTimeout(() => {
          navigate("/organizer-dashboard/events");
        }, 1500);
      })
      .catch((err: any) => {
        setSubmitting(false);
        toast({
          title: "Submission Failed",
          description: err.message || "Could not save event.",
          variant: "destructive",
        });
      });
  };

  const handlePublish = () => {
    saveEvent("PUBLISHED");
  };

  const handleSaveDraft = () => {
    saveEvent("DRAFT");
  };

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
              {step > 2 ? <Check size={24} /> : "3"}
            </div>
            <span
              className={`text-sm font-bold ${
                step >= 3 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
              }`}
            >
              Preview & Publish
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-6">
              Create Event: Event Info
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
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                          category === cat
                            ? "bg-wadu-purple text-white shadow-sm"
                            : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-205 dark:border-slate-800 hover:border-wadu-teal hover:text-wadu-teal"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>
            </div>

            {/* Event Cover Image */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition duration-300">
              <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Event Cover Image</h3>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Current Image Preview */}
                  <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0 flex items-center justify-center shadow-inner">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">No Image</span>
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <label className="bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5 duration-200">
                        Upload Local Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {imageUrl !== "/Image 1.jpg" && (
                        <button
                          type="button"
                          onClick={() => setImageUrl("/Image 1.jpg")}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-red-500 hover:text-red-500 transition duration-200 shadow-sm"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                      Upload an image file (JPG, PNG, GIF). It will be saved directly with your event.
                    </p>
                  </div>
                </div>

                {/* Alternative: Image URL Input */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Or Enter Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl === "/Image 1.jpg" ? "" : imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value || "/Image 1.jpg")}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
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
                    className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Nairobi"
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-805 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Kenya"
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-805 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold"
                    />
                  </div>
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
                    type="button"
                    onClick={() => setVisibility(setting)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition duration-200 ${
                      setting === visibility
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
                <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-wadu-navy hover:bg-wadu-teal hover:text-wadu-navy text-white text-xs font-bold px-4 rounded-xl transition duration-200 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-wadu-navy text-wadu-teal border border-wadu-teal/20 px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm bg-opacity-95"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white text-base leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="px-6 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-wadu-teal hover:text-wadu-teal transition duration-200 shadow-sm disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={handleContinueToStep2}
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
                  src={imageUrl}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="bg-wadu-purple text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm">
                  {category}
                </span>
                <h4 className="text-wadu-navy dark:text-white font-bold text-base mt-3 mb-1">
                  {eventName || "Event Name"}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-semibold">
                  Date: {startDate || "YYYY-MM-DD"} • {startTime} - {endTime}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                  Location: {venueName || "Venue"} • {city}, {country}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setStep(1)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition duration-200 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white">
              Create Event: Ticket Types
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 relative bg-slate-50/50 dark:bg-slate-950/20"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-wadu-purple">
                    Tier #{index + 1}
                  </span>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicket(ticket.id)}
                      className="text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl p-2 transition duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIP Access"
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(ticket.id, "name", e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal text-slate-805 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Ticket Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priority boarding + welcome drink"
                      value={ticket.description}
                      onChange={(e) => handleTicketChange(ticket.id, "description", e.target.value)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal text-slate-805 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(ticket.id, "price", parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal text-slate-805 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(ticket.id, "quantity", parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal text-slate-850 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTicket}
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-wadu-teal hover:text-wadu-teal transition font-bold text-slate-400 dark:text-slate-500 text-sm"
            >
              <Plus size={16} /> Add Ticket Type
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-wadu-teal hover:text-wadu-teal transition duration-200 shadow-sm"
            >
              Back
            </button>
            <button
              onClick={handleContinueToStep3}
              className="flex-1 bg-wadu-navy border border-wadu-navy/15 text-white py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 text-center shadow-md"
            >
              Continue to Preview &amp; Publish
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setStep(2)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition duration-200 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white">
              Create Event: Review &amp; Publish
            </h2>
          </div>

          {/* Event Preview Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <img
                src={imageUrl}
                alt="Event cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-wadu-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase">
                  {category}
                </span>
                <span className="text-wadu-teal border border-wadu-teal/20 bg-wadu-teal/10 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                  {visibility}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white">
                {eventName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm leading-relaxed">
                {description || "No description provided."}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-wadu-teal" />
                <span>
                  {startDate} ({startTime}) to {endDate} ({endTime})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-wadu-teal" />
                <span>
                  {venueName} - {address && `${address}, `}
                  {city}, {country}
                </span>
              </div>
            </div>

            {/* Ticket Table */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-wadu-navy dark:text-white mb-4 text-base">
                Ticket Information
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-205 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-550 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 font-semibold">Tier Name</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                        <td className="px-6 py-4">{t.name || "Unnamed Tier"}</td>
                        <td className="px-4 py-4 text-xs text-slate-450">{t.description || "—"}</td>
                        <td className="px-4 py-4">KES {t.price.toLocaleString()}</td>
                        <td className="px-4 py-4">{t.quantity} qty</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              disabled={submitting}
              className="px-6 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-wadu-teal hover:text-wadu-teal transition duration-200 shadow-sm disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={submitting}
              className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="flex-1 bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 text-center shadow-md disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Event"}
            </button>
          </div>
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
