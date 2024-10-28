import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import UserModal from './UserModal';

export default function Navbar() {
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-zinc-200/80 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between h-14 items-center">
            <h1 className="text-xl font-medium text-zinc-800">DoWith</h1>
            <button 
              onClick={() => setShowUserModal(true)}
              className="p-2 text-zinc-600 hover:text-zinc-800 rounded-full transition-colors"
            >
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {showUserModal && (
        <UserModal onClose={() => setShowUserModal(false)} />
      )}
    </>
  );
}