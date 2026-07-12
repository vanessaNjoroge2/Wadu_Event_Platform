import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Event } from "@shared/types/event.types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Map event ID to one of the provided images in the /public folder
  const getEventImage = (id: string | number) => {
    if (typeof id === "number") {
      const index = ((id - 1) % 15) + 1;
      return index === 1 ? "/Image 1.jpg" : `/image ${index}.jpg`;
    }
    // Calculate simple hash of the string id to deterministically map to 1-15
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = (Math.abs(hash) % 15) + 1;
    return index === 1 ? "/Image 1.jpg" : `/image ${index}.jpg`;
  };

  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-white rounded-none overflow-hidden border-4 border-wadu-black hover:border-wadu-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)] flex flex-col"
    >
      <div className="h-48 relative overflow-hidden bg-slate-100 border-b-4 border-wadu-black">
        <img
          src={event.imageUrl || getEventImage(event.id)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getEventImage(event.id);
          }}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <span className="bg-wadu-black text-wadu-yellow px-3 py-1 rounded-none border-2 border-wadu-black text-xs font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            {event.category.toUpperCase()}
          </span>
          {event.status && (
            <span className="bg-white text-wadu-black border-2 border-wadu-black px-3 py-1 rounded-none text-xs font-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
              {event.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow bg-wadu-yellow">
        <h3 className="text-xl font-black text-wadu-black mb-4 uppercase line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-3 text-sm text-wadu-black font-bold mb-6 flex-grow">
          <p className="flex items-center gap-3">
            <MapPin size={20} className="text-wadu-black flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
          <p className="flex items-center gap-3">
            <Calendar size={20} className="text-wadu-black flex-shrink-0" />
            <span className="uppercase">{event.date}</span>
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t-4 border-wadu-black">
          <p className="font-black text-wadu-black text-xl">{event.price}</p>
          <button className="bg-white border-2 border-wadu-black text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-6 py-2 rounded-none font-black transition duration-200 text-sm flex items-center gap-2 uppercase shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
            Book <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
