
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
  latitude: number;
  longitude: number;
}

interface StationDetailsDialogProps {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StationDetailsDialog = ({
  station,
  open,
  onOpenChange,
}: StationDetailsDialogProps) => {
  if (!station) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{station.name}</DialogTitle>
          <DialogDescription className="pt-4">
            <div className="space-y-5 text-gray-700">
              {/* Address and Availability */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {station.address}
                </div>
                <Badge variant={station.available > 0 ? "success" : "destructive"}>
                  {station.available > 0
                    ? `${station.available}/${station.total} Available`
                    : 'Full'}
                </Badge>
              </div>

              {/* Rating and Type */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {station.rating} ({station.reviews} reviews)
                </div>
                <div className="flex items-center gap-2">
                  <CloudLightning className="h-4 w-4 text-evblue-500" />
                  {station.type}
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-1">Pricing</h4>
                <p className="text-sm text-gray-600">{station.price}</p>
              </div>

              {/* Distance */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-1">Distance</h4>
                <p className="text-sm text-gray-600">{station.distance}</p>
              </div>

              {/* Directions */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2">Directions</h4>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-evblue-500 font-medium hover:underline"
                >
                  <img
                    src="https://stimg.cardekho.com/pwa/img/fuel-stations/locationNew.svg"
                    alt="Get Direction"
                    className="w-5 h-5"
                  />
                  Get Direction
                </a>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StationDetailsDialog;
