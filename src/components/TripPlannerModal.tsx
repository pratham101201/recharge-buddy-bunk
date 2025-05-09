
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
import { AlertCircle, Car, Route, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface TripPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TripPlannerModal: React.FC<TripPlannerModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [carModel, setCarModel] = useState('');
  const [currentCharge, setCurrentCharge] = useState(50);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startLocation || !destination) {
      setError('Please fill in both start location and destination');
      return;
    }

    // In a real application, this would send a request to a backend service
    // to calculate the route with charging stations
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      
      toast({
        title: "Trip Planned Successfully",
        description: `Your trip from ${startLocation} to ${destination} has been planned with optimal charging stops.`,
      });
      
      // In a real app, you would redirect to a trip details page
      // or update the UI with the planned route
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Plan Your EV Trip
          </DialogTitle>
          <DialogDescription>
            Find the optimal route with charging stops based on your vehicle and trip details.
          </DialogDescription>
        </DialogHeader>
        
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
                Start
              </Label>
              <div className="col-span-3 relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="start"
                  placeholder="Starting location"
                  className="pl-8"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <div className="col-span-3 relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="destination"
                  placeholder="Final destination"
                  className="pl-8"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="car" className="text-right">
                EV Model
              </Label>
              <div className="col-span-3 relative">
                <Car className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="car"
                  placeholder="e.g. Tesla Model 3"
                  className="pl-8"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="charge" className="text-right">
                Current Charge
              </Label>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="charge"
                    type="range"
                    min="0"
                    max="100"
                    value={currentCharge}
                    onChange={(e) => setCurrentCharge(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="w-10 text-center font-medium">{currentCharge}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Planning...' : 'Plan My Trip'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TripPlannerModal;
