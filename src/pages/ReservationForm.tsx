
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { getRestaurantById, addReservation } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions.",
  }),
});

const ReservationForm = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const partySizeParam = searchParams.get('partySize');
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Parse parameters
  const date = dateParam || format(new Date(), 'yyyy-MM-dd');
  const time = timeParam || '19:00';
  const partySize = parseInt(partySizeParam || '2', 10);
  
  // Format date for display
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  
  useEffect(() => {
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      if (id) {
        const restaurantData = getRestaurantById(id);
        if (restaurantData) {
          setRestaurant(restaurantData);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user ? user.name : "",
      email: user ? user.email : "",
      phone: user ? user.phone : "",
      specialRequests: "",
      termsAccepted: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    
    setSubmitting(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      try {
        // Add reservation
        addReservation({
          restaurantId: id,
          userId: user ? user.id : 'guest',
          date,
          time,
          partySize,
          status: 'confirmed',
        });
        
        setSubmitting(false);
        setSuccess(true);
        
        toast({
          title: "Reservation Confirmed!",
          description: `Your table at ${restaurant?.name} has been booked.`,
        });
        
        // In a real app, this would send confirmation email or SMS
        console.log(`Reservation confirmation email would be sent to ${values.email}`);
        console.log(`Reservation confirmation SMS would be sent to ${values.phone}`);
        
      } catch (error) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: "There was a problem confirming your reservation. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-800"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Render not found state
  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="mb-8">The restaurant you're looking for doesn't seem to exist.</p>
          <Button onClick={() => navigate('/search')}>
            Search for Restaurants
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Render success state
  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 max-w-lg mx-auto text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Reservation Confirmed!</h1>
              <p className="text-gray-600">
                Your table at {restaurant.name} has been booked.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded p-4 mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Restaurant:</div>
                <div>{restaurant.name}</div>
                
                <div className="font-medium">Date:</div>
                <div>{formattedDate}</div>
                
                <div className="font-medium">Time:</div>
                <div>{time}</div>
                
                <div className="font-medium">Party Size:</div>
                <div>{partySize} {partySize === 1 ? 'person' : 'people'}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              A confirmation email has been sent with all the details of your reservation. 
              You can manage or cancel your reservation from your account.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                onClick={() => navigate(`/restaurants/${id}`)}
                variant="outline"
              >
                Back to Restaurant
              </Button>
              <Button
                className="flex-1 bg-burgundy-800 hover:bg-burgundy-900"
                onClick={() => navigate('/profile')}
              >
                View My Reservations
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            Complete your reservation
          </h1>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2">{restaurant.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{time}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{partySize} {partySize === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or preferences"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree with the{" "}
                        <a href="#" className="text-burgundy-800 hover:underline">
                          terms and conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  By clicking "Confirm Reservation", you agree to the BookTable Terms of Use and Privacy Policy. 
                  Standard text message rates may apply. You may opt out of receiving text messages at any time.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-burgundy-800 hover:bg-burgundy-900"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReservationForm;
