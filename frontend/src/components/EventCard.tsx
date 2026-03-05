import type { Event } from '../types/event';
import { formatDateDisplay } from '../utils/dateFormatter';

interface EventCardProps {
  event: Event;
  actions?: React.ReactNode;
  variant?: 'default' | 'compact';
}

const EventCard = ({ event, actions, variant = 'default' }: EventCardProps) => {
  const isCompact = variant === 'compact';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full">
      {/* Media Section */}
      <div className={`${isCompact ? 'h-32' : 'h-48'} w-full relative`}>
        <img
          src={
            event.imageUrl ||
            'https://via.placeholder.com/400x200?text=No+Image'
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {!isCompact && (
          <span className="absolute top-2 right-2 bg-blue-600/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">
            {event.category}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h4
          className={`font-bold text-gray-900 ${isCompact ? 'text-sm' : 'text-lg'} truncate`}
        >
          {event.title}
        </h4>

        <div className="mt-2 space-y-1 flex-grow">
          <p className="text-gray-500 text-xs flex items-center">
            <span className="mr-1">📅</span>
            {formatDateDisplay(event.date)}
          </p>
          <p className="text-gray-500 text-xs flex items-center truncate">
            <span className="mr-1">📍</span>
            {event.location}
          </p>
        </div>

        {/* Action Slot: father buttons will be placed here */}
        {actions && (
          <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
