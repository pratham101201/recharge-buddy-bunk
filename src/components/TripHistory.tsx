
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripContext } from '@/context/TripContext';
import { Route, Clock, Zap, MapPin, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TripHistory = () => {
  const { trips, deleteTrip } = useTripContext();

  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips planned yet</h3>
          <p className="text-gray-500">Use the trip planner to create your first EV journey!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Trip History</h2>
      {trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">
                  {trip.startLocation} → {trip.destination}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(trip.createdAt, 'MMM dd, yyyy')}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTrip(trip.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Distance</span>
                </div>
                <span className="text-lg font-semibold">{trip.totalDistance} mi</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Est. Time</span>
                </div>
                <span className="text-lg font-semibold">{trip.estimatedTime} hrs</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Charging Stops</span>
                </div>
                <span className="text-lg font-semibold">{trip.chargingStops.length}</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm text-gray-600">Vehicle</span>
                </div>
                <span className="text-sm font-medium">{trip.carModel}</span>
              </div>
            </div>

            {trip.chargingStops.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Charging Stops</h4>
                <div className="space-y-2">
                  {trip.chargingStops.map((stop) => (
                    <div key={stop.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                          {stop.id}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{stop.name}</span>
                          <p className="text-xs text-gray-600">{stop.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">{stop.power} • {stop.chargingTime} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TripHistory;
