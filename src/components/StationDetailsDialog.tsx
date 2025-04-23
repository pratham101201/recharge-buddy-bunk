
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, MapPin, CloudLightning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Station {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  available: number;
  total: number;
  type: string;
  price: string;
}

interface StationDetailsDialogProps {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StationDetailsDialog = ({ station, open, onOpenChange }: StationDetailsDialogProps) => {
  if (!station) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{station.name}</DialogTitle>
          <DialogDescription className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{station.address}</span>
                </div>
                <Badge variant={station.available > 0 ? "success" : "destructive"}>
                  {station.available > 0 ? `${station.available}/${station.total} Available` : 'Full'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">
                    {station.rating} ({station.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudLightning className="h-4 w-4 text-evblue-500" />
                  <span className="text-sm">{station.type}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p className="text-sm text-gray-600">{station.price}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Distance</h4>
                <p className="text-sm text-gray-600">{station.distance}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StationDetailsDialog;
