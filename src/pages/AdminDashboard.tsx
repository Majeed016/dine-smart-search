
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  Users, 
  Utensils,
  Calendar,
  CheckCircle, 
  X,
  BarChart3,
  PieChart,
  LineChart,
  ShieldAlert
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { restaurants, reservations, Restaurant } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      // For demo purposes, just use a subset of restaurants as "pending"
      setPendingRestaurants(restaurants.slice(0, 2));
      setLoading(false);
    }, 500);
  }, [user, navigate]);
  
  // Prepare data for analytics
  const prepareReservationsByDay = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const count = reservations.filter(r => r.date === dayString).length;
      
      return {
        day: format(day, 'dd'),
        count
      };
    });
  };
  
  const prepareReservationsByStatus = () => {
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    return [
      { name: 'Confirmed', value: confirmed },
      { name: 'Cancelled', value: cancelled }
    ];
  };
  
  const prepareRestaurantsByType = () => {
    const cuisineTypes = restaurants.reduce((acc: Record<string, number>, restaurant) => {
      const type = restaurant.cuisineType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(cuisineTypes).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const COLORS = ['#800020', '#FF7676', '#FFB97B', '#CBEFB6', '#6096FD'];
  
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage restaurants and view analytics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-3 lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold">Admin</h2>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Management</h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Utensils className="mr-2 h-4 w-4" />
                        Restaurants
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Users
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Reservations
                      </Button>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mt-6 mb-2">Analytics</h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        Reports
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <LineChart className="mr-2 h-4 w-4" />
                        Trends
                      </Button>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mt-6 mb-2">System</h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-9 lg:col-span-10">
                
                {/* Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Restaurants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{restaurants.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingRestaurants.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reservations.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Active Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {reservations.filter(r => r.status === 'confirmed').length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="analytics">
                  <TabsList className="mb-6">
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="pending">Pending Restaurants</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analytics">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Reservations By Day Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Reservations by Day (Current Month)</CardTitle>
                          <CardDescription>Daily reservation volume for {format(new Date(), 'MMMM yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={prepareReservationsByDay()}
                              margin={{
                                top: 5,
                                right: 20,
                                left: 0,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#800020" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      {/* Reservation Status Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Reservation Status</CardTitle>
                          <CardDescription>Distribution of confirmed vs cancelled reservations</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                              <Pie
                                data={prepareReservationsByStatus()}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {prepareReservationsByStatus().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPie>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      {/* Restaurant Types Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Restaurant Types</CardTitle>
                          <CardDescription>Distribution of restaurants by cuisine type</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                              <Pie
                                data={prepareRestaurantsByType()}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {prepareRestaurantsByType().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPie>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                      
                      {/* Recent Activity */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>Latest reservations and restaurant updates</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-64">
                            <div className="space-y-4">
                              {reservations.slice(0, 5).map(reservation => (
                                <div key={reservation.id} className="border-b border-gray-100 pb-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">New Reservation</p>
                                      <p className="text-sm text-gray-600">
                                        Restaurant: {restaurants.find(r => r.id === reservation.restaurantId)?.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Date: {format(parse(reservation.date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy')} at {reservation.time}
                                      </p>
                                    </div>
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
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending">
                    <h2 className="text-xl font-semibold mb-4">Restaurants Awaiting Approval</h2>
                    
                    {pendingRestaurants.length === 0 ? (
                      <p className="text-center py-6 text-gray-500">No restaurants pending approval</p>
                    ) : (
                      <div className="space-y-4">
                        {pendingRestaurants.map(restaurant => (
                          <Card key={restaurant.id}>
                            <CardContent className="pt-6">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                                  <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
                                  <p className="text-sm text-gray-600">
                                    {restaurant.address.city}, {restaurant.address.state}
                                  </p>
                                </div>
                                
                                <div className="flex gap-3">
                                  <Button variant="outline" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                                    Reject
                                  </Button>
                                  <Button className="bg-burgundy-800 hover:bg-burgundy-900">
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
