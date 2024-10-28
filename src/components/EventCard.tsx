import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  isMapView?: boolean;
  onBook: (eventId: string) => void;
  isBooked?: boolean;
}

export default function EventCard({ event, isMapView = false, onBook, isBooked = false }: EventCardProps) {
  const [showParticipants, setShowParticipants] = useState(false);
  const participantsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (participantsRef.current && !participantsRef.current.contains(event.target as Node)) {
        setShowParticipants(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
  };

  const ParticipantsList = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xs font-medium text-blue-600">{event.creator.name[0]}</span>
        </div>
        <span className="text-sm text-zinc-600">{event.creator.name} (Host)</span>
      </div>
      {Array.from({ length: event.currentParticipants - 1 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center">
            <span className="text-xs font-medium text-zinc-600">P</span>
          </div>
          <span className="text-sm text-zinc-600">Participant {index + 1}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`event-card ${isMapView ? 'border border-zinc-200/80 sm:w-96 w-[calc(100vw-3rem)] mx-auto' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1 flex-1 mr-4">
          <h3 className="text-lg sm:text-2xl leading-tight font-medium text-zinc-800 line-clamp-2">{event.title}</h3>
          <span className="text-xs sm:text-sm text-zinc-500 block">{event.category}</span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-xs text-zinc-500 whitespace-nowrap">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{event.minParticipants}-{event.maxParticipants}</span>
          </div>
          <div className="relative" ref={participantsRef}>
            <button 
              onClick={() => setShowParticipants(!showParticipants)}
              className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors"
            >
              <span>{event.currentParticipants} joined</span>
              {showParticipants ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showParticipants && isMapView && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-zinc-200 p-3 z-[1002]">
                <h4 className="text-sm font-medium text-zinc-700 mb-2">Current Participants</h4>
                <ParticipantsList />
              </div>
            )}
          </div>
        </div>
      </div>

      {showParticipants && !isMapView && (
        <div className="mb-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
          <h4 className="text-sm font-medium text-zinc-700 mb-2">Current Participants</h4>
          <ParticipantsList />
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
          <span className="text-xs sm:text-sm text-zinc-600 line-clamp-2">{event.description}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
          <span className="text-xs sm:text-sm text-zinc-600 truncate">{event.location.address}</span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
          <span className="text-xs sm:text-sm text-zinc-600">{formatDate(event.datetime)}</span>
        </div>
      </div>

      <button
        onClick={() => onBook(event.id)}
        disabled={event.currentParticipants >= event.maxParticipants || isBooked}
        className={`w-full font-medium rounded-xl p-2 sm:p-3 text-sm transition-colors border ${
          isBooked 
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200' 
            : event.currentParticipants >= event.maxParticipants 
              ? 'bg-zinc-50 text-zinc-400 cursor-not-allowed border-zinc-200' 
              : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-300'
        }`}
      >
        {isBooked ? 'Already Joined' : 
          event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Join Event'}
      </button>
    </div>
  );
}