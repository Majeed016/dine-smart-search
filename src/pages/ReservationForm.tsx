
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Restaurant, getRestaurantById, getAllTimeSlots } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ReservationForm = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(searchParams.get('time') || '');
  const [partySize, setPartySize] = useState(searchParams.get('partySize') || '2');
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Restaurant ID is missing.",
        variant: "destructive",
      });
      return;
    }
    
    const restaurantData = getRestaurantById(id);
    if (!restaurantData) {
      toast({
        title: "Error",
        description: "Restaurant not found.",
        variant: "destructive",
      });
      navigate('/search');
      return;
    }
    
    setRestaurant(restaurantData);
    
    // Set default values from query params
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
      setDate(parsedDate);
    }
  }, [id, navigate, toast, searchParams]);
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!date || !time || !partySize) {
      toast({
        title: "Error",
        description: "Please fill in all the fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make a reservation.",
      });
      navigate('/login');
      return;
    }
    
    setShowDialog(true);
  };
  
  const confirmReservation = async () => {
    if (!restaurant || !date || !time || !partySize || !userProfile) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to create the reservation
      // For now, we'll simulate a success after a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowDialog(false);
      setIsLoading(false);
      
      toast({
        title: "Reservation Confirmed",
        description: `Your reservation at ${restaurant.name} on ${format(date as Date, 'MMMM d, yyyy')} at ${time} for ${partySize} people has been confirmed.`,
      });
      
      navigate('/profile');
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format address as a string
  const formatAddress = (restaurant: Restaurant) => {
    if (!restaurant || !restaurant.address) return '';
    const { street, city, state } = restaurant.address;
    return `${street}, ${city}, ${state}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {restaurant ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Reserve a Table at {restaurant.name}</h1>
            <p className="text-gray-600 mb-6">
              {restaurant.cuisineType} • {formatAddress(restaurant)}
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate)}
                    disabled={(date) => date < new Date()}
                    className="mx-auto"
                  />
                </div>
                {date && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected Date: {format(date, 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllTimeSlots().map(timeSlot => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party Size
                </label>
                <Select value={partySize} onValueChange={setPartySize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select party size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? 'person' : 'people'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-burgundy-800 hover:bg-burgundy-900 text-white font-medium py-2 rounded-md"
              >
                Make Reservation
              </Button>
            </form>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Reservation</DialogTitle>
                  <DialogDescription>
                    Please confirm your reservation details:
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Restaurant:</span>
                    <span>{restaurant.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>{date ? format(date, 'MMMM d, yyyy') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{partySize} people</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmReservation}
                    disabled={isLoading}
                    className="bg-burgundy-800 hover:bg-burgundy-900"
                  >
                    {isLoading ? 'Processing...' : 'Confirm Reservation'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-800"></div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ReservationForm;
