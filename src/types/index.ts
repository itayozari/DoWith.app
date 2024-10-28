export type EventCategory = 'Sports' | 'Leisure' | 'Learning' | 'Language' | string;

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  creatorName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  datetime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}