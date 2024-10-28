import React, { useState, useCallback } from 'react';
import { X, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Event } from '../types';
import { searchLocations } from '../services/geocoding';
import debounce from 'lodash/debounce';

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id' | 'creator'>) => void;
}

export default function CreateEventModal({ onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    datetime: new Date(),
    location: {
      lat: 32.0853,
      lng: 34.7818,
      address: ''
    },
    minParticipants: 2,
    maxParticipants: 10
  });

  const [locationSuggestions, setLocationSuggestions] = useState<Array<{address: string, lat: number, lng: number}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const categories = ['Sports', 'Leisure', 'Learning', 'Language'];

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        const results = await searchLocations(query);
        setLocationSuggestions(results);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      datetime: formData.datetime.toISOString(),
      location: formData.location,
      minParticipants: Number(formData.minParticipants),
      maxParticipants: Number(formData.maxParticipants)
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'location.address') {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, address: value }
      }));
      debouncedSearch(value);
    } else if (name === 'minParticipants' || name === 'maxParticipants') {
      const numValue = value.replace(/[^0-9]/g, '').slice(0, 2);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location: {
        address: location.address,
        lat: location.lat,
        lng: location.lng
      }
    }));
    setShowSuggestions(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[1001] overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-md relative border border-gray-200 shadow-xl">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-xl font-medium text-gray-900">Let's DoWith</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="minParticipants"
                  placeholder="Min"
                  value={formData.minParticipants}
                  onChange={handleChange}
                  className="w-16 text-center bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700"
                  required
                />
                <input
                  type="text"
                  name="maxParticipants"
                  placeholder="Max"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-16 text-center bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  name="category"
                  placeholder="Choose category or create new"
                  value={formData.category}
                  onChange={handleChange}
                  onFocus={() => setShowCategories(true)}
                  onBlur={() => setTimeout(() => setShowCategories(false), 200)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400"
                  required
                  autoComplete="off"
                />
                {showCategories && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({ ...prev, category }));
                          setShowCategories(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                name="location.address"
                placeholder="Location"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400"
                required
              />
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((location, index) => (
                    <button
                      key={`${location.address}-${index}`}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {location.address}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <DatePicker
                selected={formData.datetime}
                onChange={(date: Date) => setFormData(prev => ({ ...prev, datetime: date }))}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700"
                required
              />
            </div>

            <div>
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400 min-h-[100px]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl p-3 transition-colors"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}