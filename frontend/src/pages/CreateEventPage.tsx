import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Check, Plus, Trash2, Calendar, MapPin, ArrowLeft } from "lucide-react";
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
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Step Indicator */}
      <div className="mb-16">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 border-4 border-wadu-black flex items-center justify-center font-black text-2xl mb-4 transition duration-300 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${
                step >= 1
                  ? "bg-wadu-black text-wadu-yellow"
                  : "bg-white text-wadu-black"
              }`}
            >
              {step > 1 ? <Check size={32} /> : "1"}
            </div>
            <span
              className={`text-lg font-black uppercase ${
                step >= 1 ? "text-wadu-black" : "text-wadu-black/50"
              }`}
            >
              Event Info
            </span>
          </div>

          {/* Line 1 */}
          <div
            className={`flex-1 h-2 mx-6 border-y-4 border-wadu-black transition duration-300 ${
              step >= 2
                ? "bg-wadu-black"
                : "bg-white"
            }`}
          />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 border-4 border-wadu-black flex items-center justify-center font-black text-2xl mb-4 transition duration-300 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${
                step >= 2
                  ? "bg-wadu-black text-wadu-yellow"
                  : "bg-white text-wadu-black"
              }`}
            >
              {step > 2 ? <Check size={32} /> : "2"}
            </div>
            <span
              className={`text-lg font-black uppercase ${
                step >= 2 ? "text-wadu-black" : "text-wadu-black/50"
              }`}
            >
              Tickets
            </span>
          </div>

          {/* Line 2 */}
          <div
            className={`flex-1 h-2 mx-6 border-y-4 border-wadu-black transition duration-300 ${
              step >= 3
                ? "bg-wadu-black"
                : "bg-white"
            }`}
          />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 border-4 border-wadu-black flex items-center justify-center font-black text-2xl mb-4 transition duration-300 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] ${
                step >= 3
                  ? "bg-wadu-black text-wadu-yellow"
                  : "bg-white text-wadu-black"
              }`}
            >
              {step > 2 ? <Check size={32} /> : "3"}
            </div>
            <span
              className={`text-lg font-black uppercase ${
                step >= 3 ? "text-wadu-black" : "text-wadu-black/50"
              }`}
            >
              Publish
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {step === 1 && (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-4xl font-black text-wadu-black uppercase">
              Create Event: Info
            </h2>

            {/* Basic Info */}
            <div className="bg-white border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black text-wadu-black uppercase mb-8 border-b-4 border-wadu-black pb-4">Basic Info</h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  />
                </div>

                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-4">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-6 py-3 font-black uppercase transition duration-200 border-4 border-wadu-black ${
                          category === cat
                            ? "bg-wadu-black text-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                            : "bg-white text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:translate-y-1 hover:translate-x-1"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-bold placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>
            </div>

            {/* Event Cover Image */}
            <div className="bg-wadu-yellow border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black text-wadu-black uppercase mb-8 border-b-4 border-wadu-black pb-4">Cover Image</h3>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-48 h-32 border-4 border-wadu-black bg-white flex-shrink-0 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black uppercase text-wadu-black">No Image</span>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <label className="bg-wadu-black hover:bg-white text-wadu-yellow hover:text-wadu-black border-4 border-wadu-black px-6 py-3 font-black text-sm uppercase transition shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
                        Upload Image
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
                          className="px-6 py-3 font-black uppercase text-sm bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-4 border-wadu-black">
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                    Or Enter Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl === "/Image 1.jpg" ? "" : imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value || "/Image 1.jpg")}
                    className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-bold focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black text-wadu-black uppercase mb-8 border-b-4 border-wadu-black pb-4">
                Date & Time
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-wadu-yellow border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black text-wadu-black uppercase mb-8 border-b-4 border-wadu-black pb-4">Location</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  />
                </div>

                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black text-wadu-black uppercase mb-8 border-b-4 border-wadu-black pb-4">Settings</h3>
              
              <div className="mb-8">
                <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-4">Visibility</label>
                <div className="flex flex-wrap gap-4">
                  {["Public", "Private", "Invite Only"].map((setting) => (
                    <button
                      key={setting}
                      type="button"
                      onClick={() => setVisibility(setting)}
                      className={`px-6 py-3 font-black uppercase transition duration-200 border-4 border-wadu-black ${
                        setting === visibility
                          ? "bg-wadu-black text-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                          : "bg-white text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:translate-y-1 hover:translate-x-1"
                      }`}
                    >
                      {setting}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-4">
                  Tags
                </label>
                <form onSubmit={handleAddTag} className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="ADD TAG..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none focus:bg-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  />
                  <button
                    type="submit"
                    className="bg-wadu-black hover:bg-white text-wadu-yellow hover:text-wadu-black text-xl font-black uppercase px-8 border-4 border-wadu-black transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-wadu-black border-4 border-wadu-black px-4 py-2 font-black uppercase flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="px-8 py-5 font-black uppercase text-lg bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={handleContinueToStep2}
                className="flex-1 bg-wadu-black border-4 border-wadu-black text-wadu-yellow py-5 font-black uppercase text-lg hover:bg-white hover:text-wadu-black transition duration-200 text-center shadow-[6px_6px_0px_0px_rgba(5,5,5,0.2)] hover:-translate-y-1 hover:-translate-x-1"
              >
                Continue to Tickets
              </button>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-wadu-yellow border-8 border-wadu-black p-8 sticky top-28 shadow-[12px_12px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black uppercase text-wadu-black mb-6 border-b-4 border-wadu-black pb-4">
                Live Preview
              </h3>
              <div className="h-48 mb-6 overflow-hidden border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] bg-white">
                <img
                  src={imageUrl}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <span className="inline-block bg-wadu-black text-wadu-yellow px-4 py-2 text-sm font-black uppercase border-2 border-wadu-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  {category}
                </span>
                <h4 className="text-wadu-black font-black text-2xl uppercase leading-tight">
                  {eventName || "Event Name"}
                </h4>
                <div className="bg-white border-4 border-wadu-black p-4 space-y-2 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                  <p className="text-wadu-black text-sm font-bold uppercase flex items-center gap-2">
                    <Calendar size={16}/> {startDate || "YYYY-MM-DD"} • {startTime}
                  </p>
                  <p className="text-wadu-black text-sm font-bold uppercase flex items-center gap-2">
                    <MapPin size={16}/> {city}, {country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => setStep(1)}
              className="p-3 bg-white border-4 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow text-wadu-black transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-4xl font-black uppercase text-wadu-black">
              Create Event: Tickets
            </h2>
          </div>

          <div className="bg-white border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] space-y-10">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="p-8 border-4 border-wadu-black bg-wadu-yellow relative shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
              >
                <div className="flex justify-between items-center mb-6 border-b-4 border-wadu-black pb-4">
                  <span className="text-xl font-black uppercase text-wadu-black">
                    Tier #{index + 1}
                  </span>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicket(ticket.id)}
                      className="text-white bg-wadu-black border-2 border-wadu-black hover:bg-white hover:text-wadu-black p-2 transition duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-wadu-black">
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="E.G. VIP ACCESS"
                      value={ticket.name}
                      onChange={(e) => handleTicketChange(ticket.id, "name", e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-wadu-black">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="E.G. PRIORITY BOARDING"
                      value={ticket.description}
                      onChange={(e) => handleTicketChange(ticket.id, "description", e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-wadu-black">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(ticket.id, "price", parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-wadu-black">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(ticket.id, "quantity", parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-white border-4 border-wadu-black px-4 py-4 text-wadu-black font-black uppercase focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTicket}
              className="flex items-center justify-center gap-3 w-full py-6 border-4 border-dashed border-wadu-black bg-white hover:bg-wadu-black hover:text-wadu-yellow transition font-black text-wadu-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
            >
              <Plus size={24} /> Add Ticket Type
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-5 font-black uppercase text-lg bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
            >
              Back
            </button>
            <button
              onClick={handleContinueToStep3}
              className="flex-1 bg-wadu-black border-4 border-wadu-black text-wadu-yellow py-5 font-black uppercase text-lg hover:bg-white hover:text-wadu-black transition duration-200 text-center shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
            >
              Continue to Publish
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => setStep(2)}
              className="p-3 bg-white border-4 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow text-wadu-black transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-4xl font-black uppercase text-wadu-black">
              Review &amp; Publish
            </h2>
          </div>

          {/* Event Preview Summary Card */}
          <div className="bg-wadu-yellow border-8 border-wadu-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(5,5,5,1)] space-y-10">
            <div className="h-80 border-4 border-wadu-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
              <img
                src={imageUrl}
                alt="Event cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-wadu-black text-wadu-yellow px-4 py-2 border-2 border-wadu-black text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  {category}
                </span>
                <span className="bg-white text-wadu-black border-2 border-wadu-black px-4 py-2 text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
                  {visibility}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase text-wadu-black leading-none">
                {eventName}
              </h1>
              <p className="text-wadu-black font-bold text-lg leading-relaxed bg-white border-4 border-wadu-black p-6 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                {description || "No description provided."}
              </p>
            </div>

            <div className="border-t-4 border-wadu-black pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg font-black uppercase text-wadu-black">
              <div className="flex items-center gap-4">
                <Calendar size={28} className="text-wadu-black" />
                <span>
                  {startDate} ({startTime})<br/>to {endDate} ({endTime})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={28} className="text-wadu-black" />
                <span>
                  {venueName}<br/>
                  {address && `${address}, `}{city}, {country}
                </span>
              </div>
            </div>

            {/* Ticket Table */}
            <div className="border-t-4 border-wadu-black pt-8">
              <h3 className="font-black text-3xl text-wadu-black uppercase mb-6">
                Tickets
              </h3>
              <div className="overflow-x-auto border-4 border-wadu-black bg-white shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-wadu-black text-wadu-yellow text-sm uppercase">
                      <th className="px-6 py-4 font-black border-b-4 border-wadu-black">Tier Name</th>
                      <th className="px-6 py-4 font-black border-b-4 border-wadu-black">Description</th>
                      <th className="px-6 py-4 font-black border-b-4 border-wadu-black">Price</th>
                      <th className="px-6 py-4 font-black border-b-4 border-wadu-black">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="text-wadu-black font-bold text-sm uppercase">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-wadu-yellow transition duration-200">
                        <td className="px-6 py-5 border-b-2 border-wadu-black/20">{t.name || "UNNAMED TIER"}</td>
                        <td className="px-6 py-5 border-b-2 border-wadu-black/20">{t.description || "—"}</td>
                        <td className="px-6 py-5 border-b-2 border-wadu-black/20">KES {t.price.toLocaleString()}</td>
                        <td className="px-6 py-5 border-b-2 border-wadu-black/20">{t.quantity} QTY</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-8">
            <button
              onClick={() => setStep(2)}
              disabled={submitting}
              className="px-8 py-5 font-black uppercase text-lg bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={submitting}
              className="px-8 py-5 font-black uppercase text-lg bg-white border-4 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="flex-1 bg-wadu-black border-4 border-wadu-black text-wadu-yellow py-5 font-black uppercase text-xl hover:bg-white hover:text-wadu-black transition duration-200 text-center shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50"
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
