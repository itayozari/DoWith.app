import React from 'react';
import { Plus } from 'lucide-react';

export default function CreateEventButton() {
  return (
    <button className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow">
      <Plus className="w-6 h-6" />
    </button>
  );
}