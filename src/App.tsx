import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainView from './components/MainView';
import { sampleEvents } from './data/sampleEvents';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-zinc-600">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pt-20 pb-8">
          <MainView events={sampleEvents} />
        </main>
      </div>
    </Router>
  );
}