
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';
import { getRestaurantsByAvailability, getAvailableTimeSlots } from '@/data/mockData';
import { Restaurant } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar, Users, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const partySizeParam = searchParams.get('partySize');
  const locationParam = searchParams.get('location');
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('recommended');
  
  // Parse parameters
  const date = dateParam || format(new Date(), 'yyyy-MM-dd');
  const time = timeParam || '19:00';
  const partySize = parseInt(partySizeParam || '2', 10);
  const location = locationParam || '';
  
  // Format date for display
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  
  useEffect(() => {
    setLoading(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      const results = getRestaurantsByAvailability(date, time, partySize, location);
      setRestaurants(results);
      setLoading(false);
    }, 500);
  }, [date, time, partySize, location]);
  
  // Sort restaurants
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'price-low':
        return a.costRating - b.costRating;
      case 'price-high':
        return b.costRating - a.costRating;
      default:
        // For recommended sorting, use a combination of rating and bookings
        return (b.rating * 10 + b.bookedToday / 10) - (a.rating * 10 + a.bookedToday / 10);
    }
  });

  const handleSelectTime = (restaurantId: string, time: string) => {
    navigate(`/restaurants/${restaurantId}/reserve?date=${date}&time=${time}&partySize=${partySize}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <SearchForm />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Search summary */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {loading ? 'Searching for restaurants...' : 
              restaurants.length > 0 ? 
                `${restaurants.length} restaurants available` :
                'No restaurants available'}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600 gap-2 md:gap-4">
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
              <span>Table for {partySize}</span>
            </div>
            {location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Sorting options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span className="mr-2 text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-800"></div>
          </div>
        ) : (
          <>
            {/* No results */}
            {restaurants.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No restaurants available</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or selecting a different date/time.
                </p>
              </div>
            ) : (
              /* Restaurant grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRestaurants.map(restaurant => {
                  const availableTimes = getAvailableTimeSlots(restaurant, date, partySize);
                  return (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      availableTimes={availableTimes}
                      partySize={partySize}
                      date={formattedDate}
                      onSelectTime={(time) => handleSelectTime(restaurant.id, time)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
