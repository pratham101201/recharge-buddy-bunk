import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Car, Route, MapPin, Battery, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useTripContext } from '@/context/TripContext';

interface TripPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChargingStop {
  id: number;
  name: string;
  location: string;
  distance: number;
  chargingTime: number;
  chargerType: string;
  power: string;
}

const TripPlannerModal: React.FC<TripPlannerModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { addTrip } = useTripContext();
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [carModel, setCarModel] = useState('');
  const [currentCharge, setCurrentCharge] = useState(50);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<{
    totalDistance: number;
    estimatedTime: number;
    chargingStops: ChargingStop[];
  } | null>(null);

  const carModels = [
    { value: 'tesla-model-3', label: 'Tesla Model 3', range: 358 },
    { value: 'tesla-model-s', label: 'Tesla Model S', range: 405 },
    { value: 'bmw-i3', label: 'BMW i3', range: 153 },
    { value: 'nissan-leaf', label: 'Nissan Leaf', range: 226 },
    { value: 'audi-etron', label: 'Audi e-tron', range: 222 },
    { value: 'ford-mustang-mach-e', label: 'Ford Mustang Mach-E', range: 314 },
  ];

  const generateTripPlan = (distance: number, vehicleRange: number, currentBattery: number) => {
    const availableRange = (vehicleRange * currentBattery) / 100;
    const chargingStops: ChargingStop[] = [];
    
    let remainingDistance = distance;
    let currentDistance = 0;
    let stopCounter = 1;

    if (availableRange >= distance) {
      return {
        totalDistance: distance,
        estimatedTime: Math.round(distance / 60 * 100) / 100,
        chargingStops: []
      };
    }

    while (remainingDistance > availableRange * 0.8) {
      const stopDistance = currentDistance + (availableRange * 0.8);
      chargingStops.push({
        id: stopCounter,
        name: `Charging Station ${stopCounter}`,
        location: `Mile ${Math.round(stopDistance)}`,
        distance: Math.round(stopDistance),
        chargingTime: 30,
        chargerType: 'DC Fast Charger',
        power: '150kW'
      });
      
      currentDistance = stopDistance;
      remainingDistance = distance - currentDistance;
      stopCounter++;
    }

    const totalTime = (distance / 60) + (chargingStops.length * 0.5);
    
    return {
      totalDistance: distance,
      estimatedTime: Math.round(totalTime * 100) / 100,
      chargingStops
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startLocation || !destination || !carModel) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const mockDistance = Math.floor(Math.random() * 500) + 100;
      const selectedCar = carModels.find(car => car.value === carModel);
      
      if (selectedCar) {
        const plan = generateTripPlan(mockDistance, selectedCar.range, currentCharge);
        setTripPlan(plan);
      }
      
      setLoading(false);
      
      toast({
        title: "Trip Planned Successfully",
        description: `Your route from ${startLocation} to ${destination} has been calculated.`,
      });
    }, 2000);
  };

  const saveTrip = () => {
    if (tripPlan) {
      const selectedCarLabel = carModels.find(car => car.value === carModel)?.label || carModel;
      addTrip({
        startLocation,
        destination,
        carModel: selectedCarLabel,
        totalDistance: tripPlan.totalDistance,
        estimatedTime: tripPlan.estimatedTime,
        chargingStops: tripPlan.chargingStops,
      });

      toast({
        title: "Trip Saved",
        description: "Your trip has been saved to your history.",
      });

      resetPlan();
      onOpenChange(false);
    }
  };

  const resetPlan = () => {
    setTripPlan(null);
    setStartLocation('');
    setDestination('');
    setCarModel('');
    setCurrentCharge(50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            EV Trip Planner
          </DialogTitle>
          <DialogDescription>
            Plan your electric vehicle journey with optimal charging stops.
          </DialogDescription>
        </DialogHeader>
        
        {!tripPlan ? (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Start *
                </Label>
                <div className="col-span-3 relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="start"
                    placeholder="Starting location (e.g., San Francisco, CA)"
                    className="pl-8"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">
                  Destination *
                </Label>
                <div className="col-span-3 relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="destination"
                    placeholder="Final destination (e.g., Los Angeles, CA)"
                    className="pl-8"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="car" className="text-right">
                  EV Model *
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={setCarModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your electric vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {carModels.map((car) => (
                        <SelectItem key={car.value} value={car.value}>
                          {car.label} ({car.range} miles range)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="charge" className="text-right">
                  Current Charge
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <Input
                      id="charge"
                      type="range"
                      min="10"
                      max="100"
                      value={currentCharge}
                      onChange={(e) => setCurrentCharge(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Battery className="h-4 w-4" />
                      <span className="font-medium">{currentCharge}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Planning Route...' : 'Plan My Trip'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Trip Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Route className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Distance</span>
                  </div>
                  <span className="text-xl font-bold">{tripPlan.totalDistance} mi</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Est. Time</span>
                  </div>
                  <span className="text-xl font-bold">{tripPlan.estimatedTime} hrs</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Stops</span>
                  </div>
                  <span className="text-xl font-bold">{tripPlan.chargingStops.length}</span>
                </div>
              </div>
            </div>

            {tripPlan.chargingStops.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Charging Stops</h3>
                <div className="space-y-3">
                  {tripPlan.chargingStops.map((stop) => (
                    <Card key={stop.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <span className="text-sm font-bold text-blue-600">{stop.id}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{stop.name}</h4>
                              <p className="text-sm text-gray-600">{stop.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Zap className="h-4 w-4" />
                              {stop.power} • {stop.chargingTime} min
                            </div>
                            <p className="text-sm font-medium">{stop.chargerType}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Alert className="mb-4">
                <Battery className="h-4 w-4" />
                <AlertDescription>
                  Great news! Your current charge is sufficient to reach your destination without stopping.
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={resetPlan}>
                Plan Another Trip
              </Button>
              <Button onClick={saveTrip} className="bg-blue-600 hover:bg-blue-700">
                Save Trip
              </Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TripPlannerModal;
