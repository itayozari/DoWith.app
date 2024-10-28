import React, { useState } from 'react';
import MapView from './MapView';
import EventsList from './EventsList';
import CreateEventModal from './CreateEventModal';
import BookingConfirmationModal from './BookingConfirmationModal';
import { Event } from '../types';
import { Map, List, SortAsc, Plus } from 'lucide-react';

type SortOption = 'all' | 'joined' | 'date';

interface MainViewProps {
  events: Event[];
}

export default function MainView({ events: initialEvents }: MainViewProps) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userBookings, setUserBookings] = useState(new Set<string>());
  const [sortBy, setSortBy] = useState<SortOption>('all');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [events, setEvents] = useState(initialEvents);

  const handleCreateEvent = (newEvent: Omit<Event, 'id' | 'creator'>) => {
    const event: Event = {
      ...newEvent,
      id: `e${events.length + 1}`,
      creator: {
        id: 'guest',
        name: 'Guest User',
        avatar: ''
      },
      currentParticipants: 1
    };
    setEvents(prev => [...prev, event]);
    setShowCreateModal(false);
  };

  const handleBookEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedEvent) {
      setUserBookings(prev => {
        const newBookings = new Set(prev);
        newBookings.add(selectedEvent.id);
        return newBookings;
      });
      
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, currentParticipants: event.currentParticipants + 1 }
          : event
      ));
      
      setShowBookingModal(false);
      setSelectedEvent(null);
    }
  };

  const sortEvents = (eventsToSort: Event[]): Event[] => {
    let sortedEvents = [...eventsToSort];

    switch (sortBy) {
      case 'joined':
        return sortedEvents.filter(event => userBookings.has(event.id));
      case 'date':
        return sortedEvents.sort((a, b) => {
          const now = new Date().getTime();
          const timeToEventA = Math.abs(new Date(a.datetime).getTime() - now);
          const timeToEventB = Math.abs(new Date(b.datetime).getTime() - now);
          return timeToEventA - timeToEventB;
        });
      default:
        return sortedEvents;
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'joined', label: 'Joined Events' },
    { value: 'date', label: 'By Date' }
  ];

  const sortedEvents = sortEvents(events);

  return (
    <div className="relative space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1" />
        <div className="bg-gray-100 p-1 rounded-2xl">
          <div className="flex gap-1">
            <button
              onClick={() => setView('map')}
              className={`p-2 rounded-xl transition-colors ${
                view === 'map' 
                  ? 'bg-white text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-xl transition-colors ${
                view === 'list' 
                  ? 'bg-white text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          <span className="text-sm text-gray-500">Sort by</span>
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="p-2 rounded-xl transition-colors hover:bg-gray-100"
              title="Sort events"
            >
              <SortAsc className="w-4 h-4" />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-50">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortOptions(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      sortBy === option.value ? 'bg-gray-50' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={view === 'map' ? "rounded-2xl overflow-hidden" : ""}>
        {view === 'map' ? (
          <MapView 
            events={sortedEvents} 
            onBookEvent={handleBookEvent}
            userBookings={userBookings}
          />
        ) : (
          <EventsList 
            events={sortedEvents}
            onBookEvent={handleBookEvent}
            userBookings={userBookings}
          />
        )}
      </div>

      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 z-[100] bg-white text-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {showBookingModal && selectedEvent && (
        <BookingConfirmationModal
          event={selectedEvent}
          onConfirm={handleConfirmBooking}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}