
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface TripPlan {
  id: string;
  startLocation: string;
  destination: string;
  carModel: string;
  totalDistance: number;
  estimatedTime: number;
  chargingStops: ChargingStop[];
  createdAt: Date;
}

export interface ChargingStop {
  id: number;
  name: string;
  location: string;
  distance: number;
  chargingTime: number;
  chargerType: string;
  power: string;
}

interface TripContextType {
  trips: TripPlan[];
  addTrip: (trip: Omit<TripPlan, 'id' | 'createdAt'>) => void;
  deleteTrip: (id: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<TripPlan[]>([]);

  const addTrip = (trip: Omit<TripPlan, 'id' | 'createdAt'>) => {
    const newTrip: TripPlan = {
      ...trip,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTrips(prev => [newTrip, ...prev]);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};
