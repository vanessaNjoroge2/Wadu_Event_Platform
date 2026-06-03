import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Event } from "@/../../shared/types/event.types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Map event ID to one of the provided images in the /public folder
  const getEventImage = (id: number) => {
    const index = ((id - 1) % 15) + 1;
    return index === 1 ? "/Image 1.jpg" : `/image ${index}.jpg`;
  };

  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-250 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-wadu-teal/5"
    >
      <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={getEventImage(event.id)}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <span className="bg-wadu-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {event.category.toUpperCase()}
          </span>
          {event.status && (
            <span className="bg-wadu-navy text-wadu-teal border border-wadu-teal/30 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-opacity-95">
              {event.status}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-3 group-hover:text-wadu-teal transition line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-wadu-teal flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={16} className="text-wadu-teal flex-shrink-0" />
            <span>{event.date}</span>
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="font-extrabold text-wadu-navy dark:text-white text-base">{event.price}</p>
          <button className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal px-4 py-2 rounded-lg font-bold transition duration-200 text-sm flex items-center gap-2 shadow-sm">
            Book <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
