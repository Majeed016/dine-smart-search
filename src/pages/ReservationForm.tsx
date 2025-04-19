import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Restaurant, getRestaurantById } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ReservationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  
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
  }, [id, navigate, toast]);
  
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
  
  const confirmReservation = () => {
    setShowDialog(false);
    
    toast({
      title: "Reservation Confirmed",
      description: `Your reservation at ${restaurant?.name} on ${format(date as Date, 'MMMM d, yyyy')} at ${time} for ${partySize} people has been confirmed.`,
    });
    
    navigate('/profile');
  };
  
  const name = userProfile?.name || '';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {restaurant ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Reserve a Table at {restaurant.name}</h1>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 pl-10"
                  />
                </div>
                {date && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected Date: {format(date, 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <Label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </Label>
                <Select onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="12:30">12:30 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="13:30">1:30 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="18:30">6:30 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="19:30">7:30 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="20:30">8:30 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="partySize" className="block text-sm font-medium text-gray-700">
                  Party Size
                </Label>
                <Select onValueChange={setPartySize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select party size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 person</SelectItem>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3">3 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="5">5 people</SelectItem>
                    <SelectItem value="6">6 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="bg-burgundy-800 hover:bg-burgundy-900">
                Make Reservation
              </Button>
            </form>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Reservation</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to make a reservation at {restaurant.name} on {date ? format(date, 'MMMM d, yyyy') : 'N/A'} at {time} for {partySize} people?
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
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
                  <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={confirmReservation}>
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p>Loading restaurant details...</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ReservationForm;
