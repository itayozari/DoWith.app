export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  datetime: string;
  location: Location;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  creator: Creator;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}