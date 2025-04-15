
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit,
  CheckCircle,
  X,
  BarChart3, 
  Database,
  Settings
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRestaurantsByManagerId, getReservationsByRestaurantId, Restaurant, Reservation } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

const RestaurantManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'restaurantManager') {
      navigate('/');
      return;
    }
    
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      const managerRestaurants = getRestaurantsByManagerId(user.id);
      setRestaurants(managerRestaurants);
      
      if (managerRestaurants.length > 0) {
        setSelectedRestaurant(managerRestaurants[0]);
        const restaurantReservations = getReservationsByRestaurantId(managerRestaurants[0].id);
        setReservations(restaurantReservations);
      }
      
      setLoading(false);
    }, 500);
  }, [user, navigate]);
  
  const handleRestaurantChange = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      const restaurantReservations = getReservationsByRestaurantId(restaurant.id);
      setReservations(restaurantReservations);
    }
  };
  
  const groupReservations = () => {
    const upcoming = reservations.filter(
      res => res.status === 'confirmed' && new Date(`${res.date}T${res.time}`) >= new Date()
    );
    
    const past = reservations.filter(
      res => res.status === 'confirmed' && new Date(`${res.date}T${res.time}`) < new Date()
    );
    
    const cancelled = reservations.filter(res => res.status === 'cancelled');
    
    return { upcoming, past, cancelled };
  };
  
  const renderReservationCard = (reservation: Reservation) => {
    const reservationDate = parse(reservation.date, 'yyyy-MM-dd', new Date());
    
    return (
      <Card key={reservation.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reservation ID</h3>
              <p className="text-sm">{reservation.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              {reservation.status === 'confirmed' ? (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirmed
                </div>
              ) : (
                <div className="flex items-center text-gray-500 text-sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancelled
                </div>
              )}
            </div>
          </div>
            
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(reservationDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Table for {reservation.partySize}</span>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Booked on {format(parse(reservation.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date()), 'MMM d, yyyy')}
            </div>
            
            {reservation.status === 'confirmed' && (
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const { upcoming, past, cancelled } = groupReservations();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-burgundy-800"></div>
          </div>
        ) : (
          <>
            {restaurants.length === 0 ? (
              <div className="max-w-md mx-auto text-center py-12">
                <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Restaurants Found</h2>
                <p className="text-gray-600 mb-6">
                  You don't have any restaurants assigned to your account. Please contact the admin to add your restaurant.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="font-semibold">Manager Dashboard</h2>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Your Restaurants</h3>
                        <div className="space-y-2">
                          {restaurants.map(restaurant => (
                            <Button
                              key={restaurant.id}
                              variant={selectedRestaurant?.id === restaurant.id ? 'default' : 'outline'}
                              className="w-full justify-start"
                              onClick={() => handleRestaurantChange(restaurant.id)}
                            >
                              {restaurant.name}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="mt-8 space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate(`/restaurant/${selectedRestaurant?.id}/edit`)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Restaurant Settings
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {selectedRestaurant && (
                    <>
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h1>
                        <p className="text-gray-600">{selectedRestaurant.address.street}, {selectedRestaurant.address.city}, {selectedRestaurant.address.state} {selectedRestaurant.address.zipCode}</p>
                      </div>
                      
                      {/* Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Today's Reservations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {upcoming.filter(r => r.date === format(new Date(), 'yyyy-MM-dd')).length}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Reservations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {upcoming.length}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Booked Today</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {selectedRestaurant.bookedToday}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Add buttons */}
                      <div className="flex gap-4 mb-6">
                        <Button onClick={() => navigate('/restaurant-manager/add-reservation')}>
                          Add Reservation
                        </Button>
                        <Button variant="outline">
                          Manage Tables
                        </Button>
                      </div>
                      
                      {/* Reservations Tabs */}
                      <Tabs defaultValue="upcoming">
                        <TabsList className="mb-4">
                          <TabsTrigger value="upcoming">
                            Upcoming ({upcoming.length})
                          </TabsTrigger>
                          <TabsTrigger value="past">
                            Past ({past.length})
                          </TabsTrigger>
                          <TabsTrigger value="cancelled">
                            Cancelled ({cancelled.length})
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upcoming">
                          {upcoming.length === 0 ? (
                            <p className="text-center py-6 text-gray-500">No upcoming reservations</p>
                          ) : (
                            upcoming.map(renderReservationCard)
                          )}
                        </TabsContent>
                        
                        <TabsContent value="past">
                          {past.length === 0 ? (
                            <p className="text-center py-6 text-gray-500">No past reservations</p>
                          ) : (
                            past.map(renderReservationCard)
                          )}
                        </TabsContent>
                        
                        <TabsContent value="cancelled">
                          {cancelled.length === 0 ? (
                            <p className="text-center py-6 text-gray-500">No cancelled reservations</p>
                          ) : (
                            cancelled.map(renderReservationCard)
                          )}
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default RestaurantManager;
