import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Event } from "@/types/event.types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className={`h-48 bg-gradient-to-br ${event.gradient || "from-purple-600 to-pink-600"} relative`}>
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="bg-slate-950/80 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
            {event.category.toUpperCase()}
          </span>
          {event.status && (
            <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
              {event.status}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-purple-400" />
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" />
            {event.date}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <p className="font-bold text-white">{event.price}</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-sm flex items-center gap-2">
            Book <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
