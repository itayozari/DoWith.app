import React from 'react';
import { User } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="max-w-2xl mx-auto bg-[#09090B] rounded-lg p-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-black/50 p-4 rounded-full">
          <User className="w-12 h-12 text-zinc-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-200">Guest User</h2>
          <p className="text-zinc-400">Sign in to create and join events</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 px-4 rounded-lg transition-colors">
          Sign In with Email
        </button>
        <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 py-2 px-4 rounded-lg transition-colors border border-zinc-800/30">
          Sign In with Google
        </button>
      </div>
    </div>
  );
}