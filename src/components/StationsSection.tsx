
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BatteryCharging, CloudLightning, MapPin, Star, Filter, Heart, HeartOff } from 'lucide-react';
import StationDetailsDialog from './StationDetailsDialog';
import { db } from '@/firebase';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import EVStationMap from './EVStationMap';
import StationFilters from './StationFilters';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

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

interface FilterOptions {
  type: string[];
  minAvailability: number;
  maxDistance: number;
  minRating: number;
}

const StationsSection = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [stationData, setStationData] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: [],
    minAvailability: 0,
    maxDistance: 100,
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stations"), (snapshot) => {
      const stations: Station[] = snapshot.docs.map((doc) => ({
        id: parseInt(doc.id),
        ...(doc.data() as Omit<Station, "id">),
      }));
      setStationData(stations);
      applyFiltersAndSearch(stations, searchQuery, filterOptions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user favorites
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchFavorites = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().favorites) {
          setFavorites(userSnap.data().favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    
    fetchFavorites();
  }, [currentUser]);

  const applyFiltersAndSearch = (
    stations: Station[], 
    query: string, 
    filters: FilterOptions
  ) => {
    let results = stations;

    // Apply search query
    if (query) {
      results = results.filter(station =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.address.toLowerCase().includes(query.toLowerCase()) ||
        station.type.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type.length > 0) {
      results = results.filter(station => 
        filters.type.some(type => station.type.includes(type))
      );
    }

    // Apply minimum availability filter
    if (filters.minAvailability > 0) {
      results = results.filter(station => station.available >= filters.minAvailability);
    }

    // Apply distance filter - assuming distance is in format "X.X miles"
    if (filters.maxDistance < 100) {
      results = results.filter(station => {
        const distanceValue = parseFloat(station.distance.split(' ')[0]);
        return distanceValue <= filters.maxDistance;
      });
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter(station => station.rating >= filters.minRating);
    }

    setFilteredStations(results);
  };

  const handleReserve = async (stationId: number) => {
    const station = stationData.find(s => s.id === stationId);
    if (station?.available === 0) {
      toast({
        title: "Station Unavailable",
        description: "This station is currently full. Please try another station.",
        variant: "destructive"
      });
      return;
    }
  
    try {
      const response = await fetch("/api/reserve/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Reservation Successful",
          description: `Reserved a slot. ${data.available} slots remaining.`,
        });
  
        // Optional: refresh station data or update state
      } else {
        toast({
          title: "Failed to Reserve",
          description: data.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Reserve Error:", error);
      toast({
        title: "Network Error",
        description: "Unable to reserve. Try again later.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (stationId: number) => {
    const station = filteredStations.find(s => s.id === stationId);
    setSelectedStation(station || null);
    setIsDetailsOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(stationData, query, filterOptions);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    applyFiltersAndSearch(stationData, searchQuery, newFilters);
  };

  const toggleFavorite = async (stationId: number) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites.",
        variant: "destructive"
      });
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      
      if (favorites.includes(stationId)) {
        // Remove from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(stationId)
        });
        setFavorites(favorites.filter(id => id !== stationId));
        toast({
          title: "Removed from Favorites",
          description: "Station removed from your favorites."
        });
      } else {
        // Add to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(stationId)
        });
        setFavorites([...favorites, stationId]);
        toast({
          title: "Added to Favorites",
          description: "Station added to your favorites."
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (station?: Station) => {
    if (!station) return "destructive";
    return station.available > 0 ? "success" : "destructive";
  };

  return (
    <section id="stations" className="py-20 bg-gray-50 scroll-mt-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
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
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <StationFilters 
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            types={Array.from(new Set(stationData.map(station => station.type)))}
          />
        )}

        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              className="rounded-l-md rounded-r-none"
              onClick={() => setViewMode('map')}
            >
              Map View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className="rounded-r-md rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'map' && (
              <EVStationMap 
                stations={filteredStations} 
                onStationSelect={handleViewDetails}
                favorites={favorites}
              />
            )}

            {viewMode === 'list' && filteredStations.length > 0 ? (
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
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8"
                          onClick={() => toggleFavorite(station.id)}
                        >
                          {favorites.includes(station.id) ? (
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          ) : (
                            <Heart className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-16" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{station.name}</h3>
                        <Badge variant={getStatusColor(station)}>
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
            ) : viewMode === 'list' && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-600">No stations match your search criteria</h3>
                <p className="text-gray-500 mt-2">Try changing your filters or search query</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setFilterOptions({
                      type: [],
                      minAvailability: 0,
                      maxDistance: 100,
                      minRating: 0
                    });
                    applyFiltersAndSearch(stationData, "", {
                      type: [],
                      minAvailability: 0,
                      maxDistance: 100,
                      minRating: 0
                    });
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {selectedStation && (
        <StationDetailsDialog
          station={selectedStation}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          isFavorite={favorites.includes(selectedStation.id)}
          onToggleFavorite={() => toggleFavorite(selectedStation.id)}
          onReserve={() => handleReserve(selectedStation.id)}
        />
      )}
    </section>
  );
};

export default StationsSection;
