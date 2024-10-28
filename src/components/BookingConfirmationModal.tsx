import React from 'react';
import { X, MapPin, Calendar, Users } from 'lucide-react';
import { Event } from '../types';

interface BookingConfirmationModalProps {
  event: Event;
  onConfirm: () => void;
  onClose: () => void;
}

export default function BookingConfirmationModal({ 
  event, 
  onConfirm, 
  onClose 
}: BookingConfirmationModalProps) {
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

  if (!event || !event.location) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Confirm Booking</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              <span className="text-sm text-gray-500">{event.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">{event.location.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">{formatDate(event.datetime)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">
                {event.minParticipants}-{event.maxParticipants} participants
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}