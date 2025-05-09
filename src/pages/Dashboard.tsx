
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryCharging, Star, MapPin, Clock, Heart, CalendarRange, CreditCard, Route } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import TripPlannerModal from '@/components/TripPlannerModal';

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

interface Reservation {
  id: string;
  stationId: number;
  station?: Station;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: string;
}

interface Review {
  id: string;
  stationId: number;
  stationName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favoriteStations, setFavoriteStations] = useState<Station[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  // Sample payment methods (in a real app, these would come from your payment processor)
  const samplePaymentMethods: PaymentMethod[] = [
    { id: '1', type: 'Visa', last4: '4242', expiry: '04/24', isDefault: true },
    { id: '2', type: 'Mastercard', last4: '5555', expiry: '05/25', isDefault: false },
  ];

  // Sample reviews
  const sampleReviews: Review[] = [
    { 
      id: '1', 
      stationId: 1, 
      stationName: 'Downtown EV Station',
      rating: 4, 
      comment: 'Great location and fast charging, but limited amenities.',
      date: '2023-11-15'
    },
    {
      id: '2',
      stationId: 3,
      stationName: 'Riverside Charging Hub',
      rating: 5,
      comment: 'Excellent service! Clean facilities and friendly staff.',
      date: '2023-12-02'
    }
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch favorite stations
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().favorites) {
          const favoriteIds = userSnap.data().favorites;
          const stationsData: Station[] = [];
          
          // Fetch each favorite station
          for (const id of favoriteIds) {
            const stationRef = doc(db, "stations", id.toString());
            const stationSnap = await getDoc(stationRef);
            if (stationSnap.exists()) {
              stationsData.push({
                id,
                ...(stationSnap.data() as Omit<Station, "id">)
              });
            }
          }
          setFavoriteStations(stationsData);
        }
        
        // In a real app, fetch these from your backend
        // For now, using sample data
        setReservations([
          {
            id: '1',
            stationId: 1,
            date: '2023-12-15T14:00:00',
            status: 'upcoming',
            price: '$12.99'
          },
          {
            id: '2',
            stationId: 2,
            date: '2023-11-28T10:30:00',
            status: 'completed',
            price: '$15.50'
          }
        ]);
        
        setReviews(sampleReviews);
        setPaymentMethods(samplePaymentMethods);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  // Function to format date strings
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      <main className="flex-grow min-h-screen bg-gray-50 pt-16">
        <div className="container px-4 md:px-6 py-8">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-60 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || 'User'} />
                    <AvatarFallback>{currentUser?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold">Welcome, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</h1>
                    <p className="text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
                <Button onClick={() => setIsPlannerOpen(true)} className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Plan a Trip
                </Button>
              </div>

              <Tabs defaultValue="favorites">
                <TabsList className="mb-8">
                  <TabsTrigger value="favorites" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Favorite Stations
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="gap-2">
                    <CalendarRange className="h-4 w-4" />
                    My Reservations
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="gap-2">
                    <Star className="h-4 w-4" />
                    My Reviews
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Methods
                  </TabsTrigger>
                </TabsList>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  {favoriteStations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteStations.map((station) => (
                        <Card key={station.id}>
                          <CardHeader className="pb-2">
                            <CardTitle>{station.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {station.address}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-sm font-medium">{station.rating}</span>
                                <span className="ml-1 text-sm text-gray-500">({station.reviews})</span>
                              </div>
                              <Badge variant={station.available > 0 ? "success" : "destructive"}>
                                {station.available > 0 ? `${station.available}/${station.total} Available` : 'Full'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">{station.type} · {station.price}</div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              className="w-full"
                              onClick={() => navigate('/#stations')}
                              variant="outline"
                            >
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Heart className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="font-semibold text-lg mt-4">No Favorite Stations Yet</h3>
                      <p className="text-gray-500">Save your favorite stations for quick access</p>
                      <Button 
                        onClick={() => navigate('/#stations')} 
                        variant="outline"
                        className="mt-4"
                      >
                        Browse Stations
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Reservations Tab */}
                <TabsContent value="reservations">
                  {reservations.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="font-semibold text-lg">Upcoming Reservations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reservations
                          .filter(res => res.status === 'upcoming')
                          .map((reservation) => (
                            <Card key={reservation.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle>Station #{reservation.stationId}</CardTitle>
                                  <Badge>{reservation.status}</Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(reservation.date)}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="font-semibold">{reservation.price}</p>
                              </CardContent>
                              <CardFooter className="pt-0 justify-between">
                                <Button variant="outline" size="sm">Modify</Button>
                                <Button variant="destructive" size="sm">Cancel</Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>

                      <h3 className="font-semibold text-lg mt-8">Past Reservations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reservations
                          .filter(res => res.status === 'completed')
                          .map((reservation) => (
                            <Card key={reservation.id}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle>Station #{reservation.stationId}</CardTitle>
                                  <Badge variant="outline">{reservation.status}</Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(reservation.date)}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="font-semibold">{reservation.price}</p>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <Button variant="outline" size="sm" className="w-full">
                                  Leave Review
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <CalendarRange className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="font-semibold text-lg mt-4">No Reservations Found</h3>
                      <p className="text-gray-500">Book a charging station to see your reservations here</p>
                      <Button 
                        onClick={() => navigate('/#stations')} 
                        variant="outline"
                        className="mt-4"
                      >
                        Book Now
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle>{review.stationName}</CardTitle>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <CardDescription>{review.date}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{review.comment}</p>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Star className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="font-semibold text-lg mt-4">No Reviews Yet</h3>
                      <p className="text-gray-500">Your reviews will appear here after you've rated stations</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Payment Methods Tab */}
                <TabsContent value="payment">
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-6 flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Your Payment Methods</h3>
                      <Button>Add New Card</Button>
                    </div>
                    
                    {paymentMethods.map((method) => (
                      <Card key={method.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${
                                method.type === 'Visa' ? 'bg-blue-50' : 
                                method.type === 'Mastercard' ? 'bg-red-50' : 'bg-gray-50'
                              }`}>
                                <CreditCard className={`h-5 w-5 ${
                                  method.type === 'Visa' ? 'text-blue-500' : 
                                  method.type === 'Mastercard' ? 'text-red-500' : 'text-gray-500'
                                }`} />
                              </div>
                              <CardTitle className="text-lg">{method.type} •••• {method.last4}</CardTitle>
                            </div>
                            {method.isDefault && <Badge variant="outline">Default</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-500">Expires: {method.expiry}</p>
                        </CardContent>
                        <CardFooter className="pt-0 justify-end gap-2">
                          {!method.isDefault && <Button variant="ghost" size="sm">Set as Default</Button>}
                          <Button variant="outline" size="sm">Remove</Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-10">
                          <p className="text-gray-500">No billing history available</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
      
      <TripPlannerModal 
        open={isPlannerOpen}
        onOpenChange={setIsPlannerOpen}
      />
    </>
  );
};

export default Dashboard;
