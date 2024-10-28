import React from 'react';
import { Event } from '../types';
import EventCard from './EventCard';

interface EventsListProps {
  events: Event[];
  onBookEvent: (eventId: string) => void;
  userBookings?: Set<string>;
}

export default function EventsList({ events, onBookEvent, userBookings = new Set() }: EventsListProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  return (
    <div className="events-list">
      {sortedEvents.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onBook={onBookEvent}
          isBooked={userBookings.has(event.id)}
        />
      ))}
    </div>
  );
}