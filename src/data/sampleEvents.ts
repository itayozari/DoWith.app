import { Event } from '../types';

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Beach Volleyball',
    description: 'Casual volleyball game at Gordon Beach',
    category: 'Sports',
    datetime: '2024-03-20T16:00:00',
    location: {
      lat: 32.0834,
      lng: 34.7677,
      address: 'Gordon Beach, Tel Aviv'
    },
    minParticipants: 4,
    maxParticipants: 12,
    currentParticipants: 3,
    creator: {
      id: 'u1',
      name: 'David Cohen',
      avatar: 'https://i.pravatar.cc/150?u=david'
    }
  },
  {
    id: '2',
    title: 'Hebrew Language Exchange',
    description: 'Practice Hebrew conversation over coffee',
    category: 'Language',
    datetime: '2024-03-21T18:00:00',
    location: {
      lat: 32.0873,
      lng: 34.7818,
      address: 'Dizengoff Center, Tel Aviv'
    },
    minParticipants: 2,
    maxParticipants: 6,
    currentParticipants: 2,
    creator: {
      id: 'u2',
      name: 'Sarah Miller',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    }
  },
  {
    id: '3',
    title: 'Startup Networking',
    description: 'Connect with local entrepreneurs',
    category: 'Learning',
    datetime: '2024-03-22T19:00:00',
    location: {
      lat: 32.0853,
      lng: 34.7818,
      address: 'WeWork Hazerem, Tel Aviv'
    },
    minParticipants: 10,
    maxParticipants: 50,
    currentParticipants: 8,
    creator: {
      id: 'u3',
      name: 'Tom Levy',
      avatar: 'https://i.pravatar.cc/150?u=tom'
    }
  }
];