import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { format, parse } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  X,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { Reservation, getReservationsByUserId, cancelReservation, getRestaurantById } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      const userReservations = getReservationsByUserId(user.id);
      setReservations(userReservations);
      setLoading(false);
    }, 500);
  }, [user, navigate]);
  
  const handleCancelReservation = (reservationId: string) => {
    if (cancelReservation(reservationId)) {
      // Update the local state
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'cancelled' } 
            : res
        )
      );
      
      setReservationToCancel(null);
      
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been successfully cancelled.",
      });
    } else {
      toast({
        title: "Error",
        description: "There was a problem cancelling your reservation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getRestaurantName = (restaurantId: string) => {
    const restaurant = getRestaurantById(restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
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
    const restaurantName = getRestaurantName(reservation.restaurantId);
    const reservationDate = parse(reservation.date, 'yyyy-MM-dd', new Date());
    
    return (
      <Card key={reservation.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              <Link 
                to={`/restaurants/${reservation.restaurantId}`}
                className="hover:text-burgundy-800"
              >
                {restaurantName}
              </Link>
            </CardTitle>
            {reservation.status === 'confirmed' && new Date(`${reservation.date}T${reservation.time}`) >= new Date() && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={() => setReservationToCancel(reservation)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
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
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Booked on {format(parseISO(reservation.createdAt), 'MMM d, yyyy')}
            </div>
            {reservation.status === 'confirmed' ? (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirmed
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Cancelled</div>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {user && (
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            )}
          </div>
          
          {user && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-4">My Reservations</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-burgundy-800"></div>
              </div>
            ) : (
              <>
                {reservations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-2">No reservations yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't made any reservations. Start exploring restaurants to book your table.
                    </p>
                    <Button 
                      onClick={() => navigate('/search')}
                      className="bg-burgundy-800 hover:bg-burgundy-900"
                    >
                      Find a Restaurant
                    </Button>
                  </div>
                ) : (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancellation Dialog */}
      <Dialog 
        open={!!reservationToCancel} 
        onOpenChange={(open) => !open && setReservationToCancel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your reservation at{" "}
              {reservationToCancel ? getRestaurantName(reservationToCancel.restaurantId) : ""}?
            </DialogDescription>
          </DialogHeader>
          
          {reservationToCancel && (
            <div className="bg-gray-50 rounded p-4 my-2">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(parse(reservationToCancel.date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{reservationToCancel.time}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Table for {reservationToCancel.partySize}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                Keep Reservation
              </Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => reservationToCancel && handleCancelReservation(reservationToCancel.id)}
            >
              Cancel Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
