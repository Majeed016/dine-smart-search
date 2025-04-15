
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Star, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getRestaurantById, getReviewsByRestaurantId, getAvailableTimeSlots, Restaurant } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TimeSlots from '@/components/TimeSlots';
import ReviewsList from '@/components/ReviewsList';
import RestaurantMap from '@/components/RestaurantMap';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const partySizeParam = searchParams.get('partySize');
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(dateParam ? 
    parse(dateParam, 'yyyy-MM-dd', new Date()) : 
    new Date());
  const [partySize, setPartySize] = useState(partySizeParam ? parseInt(partySizeParam, 10) : 2);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(timeParam);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      if (id) {
        const restaurantData = getRestaurantById(id);
        if (restaurantData) {
          setRestaurant(restaurantData);
          
          // Get available times
          const formattedDate = format(date, 'yyyy-MM-dd');
          const times = getAvailableTimeSlots(restaurantData, formattedDate, partySize);
          setAvailableTimes(times);
          
          // Update search params
          setSearchParams({
            date: formattedDate,
            partySize: partySize.toString(),
            ...(selectedTime ? { time: selectedTime } : {})
          });
        }
      }
      setLoading(false);
    }, 500);
  }, [id, date, partySize, selectedTime]);
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setSelectedTime(null);
    }
  };
  
  const handlePartySizeChange = (value: string) => {
    setPartySize(parseInt(value, 10));
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Update the URL params
    setSearchParams({
      date: format(date, 'yyyy-MM-dd'),
      partySize: partySize.toString(),
      time: time
    });
  };
  
  const handleReserveClick = () => {
    if (selectedTime) {
      navigate(`/restaurants/${id}/reserve?date=${format(date, 'yyyy-MM-dd')}&time=${selectedTime}&partySize=${partySize}`);
    }
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
  
  // Format hours for display
  const formatHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return days.map(day => {
      const hours = restaurant.hours[day];
      return (
        <div key={day} className="grid grid-cols-2 gap-2 mb-1">
          <span className="capitalize">{day}</span>
          <span>{hours ? `${hours.open} - ${hours.close}` : 'Closed'}</span>
        </div>
      );
    });
  };
  
  // Get restaurant reviews
  const reviews = getReviewsByRestaurantId(restaurant.id);
  
  // Display cost rating
  const renderCostRating = () => {
    const dollarSigns = [];
    for (let i = 1; i <= 4; i++) {
      dollarSigns.push(
        <span 
          key={i} 
          className={`${i <= restaurant.costRating ? '' : 'cost-rating-inactive'}`}
        >
          $
        </span>
      );
    }
    return <div className="cost-rating inline-flex">{dollarSigns}</div>;
  };
  
  // Current day of week
  const currentDay = format(new Date(), 'EEEE').toLowerCase();
  const todayHours = restaurant.hours[currentDay as keyof typeof restaurant.hours];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Restaurant Gallery */}
        <div className="mb-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl mb-2">
            <img 
              src={restaurant.images[activeImageIndex]} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {restaurant.images.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer rounded overflow-hidden w-24 h-16 flex-shrink-0 ${
                  index === activeImageIndex ? 'ring-2 ring-burgundy-800' : 'opacity-70'
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${restaurant.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="ml-1 text-gray-600">({restaurant.reviewCount} reviews)</span>
              </div>
              
              <div>
                <span className="font-medium">{restaurant.cuisineType}</span>
              </div>
              
              <div>
                {renderCostRating()}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              {restaurant.description}
            </p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start mb-3">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-burgundy-800" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{restaurant.address.street}</p>
                      <p>{restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <Phone className="h-5 w-5 mr-2 mt-0.5 text-burgundy-800" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 mt-0.5 text-burgundy-800" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href="#" 
                        className="text-burgundy-800 hover:underline flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Hours</p>
                  <div className="text-sm">
                    {formatHours()}
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    Today: {todayHours ? `${todayHours.open} - ${todayHours.close}` : 'Closed'}
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="map">Map & Directions</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="py-4">
                <ReviewsList reviews={reviews} />
              </TabsContent>
              <TabsContent value="map" className="py-4">
                <RestaurantMap restaurant={restaurant} />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Make a reservation</h2>
              
              <div className="space-y-4 mb-6">
                {/* Party Size */}
                <div>
                  <label className="block text-sm font-medium mb-1">Party Size</label>
                  <Select value={partySize.toString()} onValueChange={handlePartySizeChange}>
                    <SelectTrigger className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(20)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} {i === 0 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <TimeSlots
                    restaurant={restaurant}
                    date={format(date, 'yyyy-MM-dd')}
                    availableTimes={availableTimes}
                    selectedTime={selectedTime}
                    onSelectTime={handleTimeSelect}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full bg-burgundy-800 hover:bg-burgundy-900"
                disabled={!selectedTime}
                onClick={handleReserveClick}
              >
                {selectedTime ? `Reserve for ${selectedTime}` : 'Select a time'}
              </Button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                {restaurant.bookedToday} bookings today. 
                Reservation is free and takes less than 1 minute.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RestaurantDetails;
