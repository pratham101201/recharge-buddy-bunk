import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BatteryCharging, 
  CloudLightning, 
  MapPin, 
  Star 
} from 'lucide-react';
import StationDetailsDialog from './StationDetailsDialog';

const stationData = [
  {
    id: 1,
    name: "City Center Station",
    address: "123 Main St, Downtown",
    distance: "0.8 miles away",
    rating: 4.8,
    reviews: 124,
    available: 3,
    total: 6,
    type: "Fast Charger",
    price: "$0.45/kWh"
  },
  {
    id: 2,
    name: "Westside Mall",
    address: "456 Market Ave, Westside",
    distance: "2.3 miles away",
    rating: 4.6,
    reviews: 89,
    available: 0,
    total: 4,
    type: "Ultra Fast",
    price: "$0.55/kWh"
  },
  {
    id: 3,
    name: "North Park Station",
    address: "789 Park Lane, Northside",
    distance: "3.1 miles away",
    rating: 4.7,
    reviews: 56,
    available: 5,
    total: 8,
    type: "Standard",
    price: "$0.35/kWh"
  },
];

const StationsSection = () => {
  const { toast } = useToast();
  const [selectedStation, setSelectedStation] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filteredStations, setFilteredStations] = useState(stationData);
  const [searchQuery, setSearchQuery] = useState("");

  const handleReserve = (stationId: number) => {
    const station = stationData.find(s => s.id === stationId);
    if (station?.available === 0) {
      toast({
        title: "Station Unavailable",
        description: "This station is currently full. Please try another station.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Station Reserved",
      description: `You have successfully reserved a spot at ${station?.name}. Please arrive within 15 minutes to claim your spot.`,
    });
  };

  const handleViewDetails = (stationId: number) => {
    const station = stationData.find(s => s.id === stationId);
    setSelectedStation(station);
    setIsDetailsOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = stationData.filter(station => 
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.address.toLowerCase().includes(query.toLowerCase()) ||
      station.type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  return (
    <section id="stations" className="py-20 bg-gray-50 scroll-mt-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Charging Stations <span className="gradient-text">Near You</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[600px]">
              Find and reserve charging stations in your area. Real-time availability and detailed information at your fingertips.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-evblue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" onClick={() => handleSearch("")}>
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div 
              key={station.id} 
              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BatteryCharging className="h-16 w-16 text-evblue-500 opacity-50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-16" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{station.name}</h3>
                  <Badge variant={station.available > 0 ? "success" : "destructive"}>
                    {station.available > 0 ? `${station.available}/${station.total} Available` : 'Full'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{station.address}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-gray-500">
                  <span className="text-sm">{station.distance}</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">{station.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({station.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <CloudLightning className="h-4 w-4 text-evblue-500" />
                    <span className="ml-1 text-sm">{station.type}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-semibold">{station.price}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => handleViewDetails(station.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-shrink-0"
                    disabled={station.available === 0}
                    onClick={() => handleReserve(station.id)}
                  >
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StationsSection;
