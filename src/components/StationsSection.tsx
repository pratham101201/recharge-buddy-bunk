
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, MapPin, Info, Battery, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import StationDetailsDialog from './StationDetailsDialog';
import { Progress } from '@/components/ui/progress';

// Mock data in case Firestore fails
const mockStations = [
  {
    id: '1',
    name: 'Downtown Fast Charging Hub',
    location: '123 Main St, Downtown',
    type: 'DC Fast Charging',
    power: '150 kW',
    status: 'Available',
    pricePerKwh: '$0.40',
    connectorTypes: ['CCS', 'CHAdeMO', 'Tesla'],
    coordinates: { lat: 40.7128, lng: -74.006 },
    amenities: ['Restrooms', 'WiFi', 'Cafe']
  },
  {
    id: '2',
    name: 'Westside Shopping Center',
    location: '456 Market Ave, Westside',
    type: 'Level 2',
    power: '22 kW',
    status: 'In Use',
    pricePerKwh: '$0.30',
    connectorTypes: ['Type 2', 'J1772'],
    coordinates: { lat: 40.7138, lng: -74.016 },
    amenities: ['Shopping', 'Restaurants', 'WiFi']
  },
  {
    id: '3',
    name: 'Eastside Park & Charge',
    location: '789 Park Lane, Eastside',
    type: 'DC Fast Charging',
    power: '50 kW',
    status: 'Available',
    pricePerKwh: '$0.35',
    connectorTypes: ['CCS', 'CHAdeMO'],
    coordinates: { lat: 40.7218, lng: -73.996 },
    amenities: ['Park', 'Restrooms']
  }
];

const StationsSection = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsCollection = collection(firestore, 'stations');
        const stationSnapshot = await getDocs(stationsCollection);
        
        if (stationSnapshot.empty) {
          console.log("No stations found in Firestore, using mock data");
          setStations(mockStations);
        } else {
          const stationList = stationSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setStations(stationList);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
        toast({
          title: "Error loading stations",
          description: "Using demo data instead",
          variant: "destructive",
        });
        setStations(mockStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [toast]);

  const handleStationClick = (station) => {
    setSelectedStation(station);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status) => {
    // Add null check to prevent calling toLowerCase on undefined
    if (!status) return 'bg-gray-500';
    
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-500';
      case 'in use': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <section id="stations" className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Charging Stations</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">Loading stations...</p>
            <div className="w-full max-w-md">
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stations" className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            <Zap className="inline-block h-4 w-4 mr-1" />
            EV Network
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Charging Stations</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Find the perfect charging station for your EV. Our network includes fast charging, standard options, and more.
          </p>
          <Separator className="my-8" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stations.map((station) => (
            <Card key={station.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge variant={station.status?.toLowerCase() === 'available' ? "default" : "secondary"} className="mb-2">
                    {station.status || 'Unknown'}
                  </Badge>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(station.status)}`}></div>
                </div>
                <CardTitle className="text-xl">{station.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {station.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-1 pl-0 font-medium"><Zap className="inline h-4 w-4 mr-1" /> Type</TableCell>
                      <TableCell className="py-1">{station.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 pl-0 font-medium"><Battery className="inline h-4 w-4 mr-1" /> Power</TableCell>
                      <TableCell className="py-1">{station.power}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 pl-0 font-medium"><Clock className="inline h-4 w-4 mr-1" /> Price</TableCell>
                      <TableCell className="py-1">{station.pricePerKwh}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleStationClick(station)} 
                  variant="outline" 
                  className="w-full group"
                >
                  <Info className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedStation && (
        <StationDetailsDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          station={selectedStation} 
        />
      )}
    </section>
  );
};

export default StationsSection;
