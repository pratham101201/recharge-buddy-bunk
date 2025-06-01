
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import TripPlannerModal from '@/components/TripPlannerModal';
import TripHistory from '@/components/TripHistory';
import { 
  User, 
  MapPin, 
  Battery, 
  Clock, 
  Car,
  Route,
  Activity,
  CreditCard
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);

  // Mock user data - in a real app, this would come from your backend
  const userData = {
    name: currentUser?.displayName || 'John Doe',
    email: currentUser?.email || 'john@example.com',
    memberSince: 'January 2024',
    vehicle: 'Tesla Model 3',
    totalSessions: 42,
    totalEnergy: 1250,
    favoriteStation: 'Downtown Charging Hub'
  };

  const recentSessions = [
    {
      id: 1,
      station: 'Downtown Station',
      date: '2024-01-15',
      duration: '45 min',
      energy: '35 kWh',
      cost: '$12.50'
    },
    {
      id: 2,
      station: 'Mall Station', 
      date: '2024-01-12',
      duration: '32 min',
      energy: '28 kWh',
      cost: '$9.80'
    },
    {
      id: 3,
      station: 'Highway Rest Stop',
      date: '2024-01-10',
      duration: '55 min',
      energy: '42 kWh',
      cost: '$15.20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-gray-600">
            Manage your EV charging sessions and plan new trips.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trips">Trip History</TabsTrigger>
            <TabsTrigger value="sessions">Charging Sessions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => setIsTripPlannerOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Route className="h-4 w-4" />
                    Plan New Trip
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Find Nearby Stations
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Battery className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Energy</p>
                      <p className="text-2xl font-bold">{userData.totalEnergy} kWh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold">{userData.totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Car className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="text-lg font-bold">{userData.vehicle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Charging Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{session.station}</h4>
                        <p className="text-sm text-gray-600">{session.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.energy}</p>
                        <p className="text-sm text-gray-600">{session.duration} • {session.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips">
            <TripHistory />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Charging Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Battery className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{session.station}</h4>
                          <p className="text-sm text-gray-600">{session.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.energy}</p>
                        <p className="text-sm text-gray-600">{session.duration} • {session.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{userData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900">{userData.memberSince}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Vehicle
                    </label>
                    <p className="text-gray-900">{userData.vehicle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TripPlannerModal 
        open={isTripPlannerOpen} 
        onOpenChange={setIsTripPlannerOpen} 
      />
    </div>
  );
};

export default Dashboard;
