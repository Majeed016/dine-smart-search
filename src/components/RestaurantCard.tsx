
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';
import { Restaurant } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
  availableTimes?: string[];
  partySize?: number;
  date?: string;
  onSelectTime?: (time: string) => void;
  className?: string; // Add this to fix the TypeScript error
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  availableTimes = [], 
  partySize, 
  date,
  onSelectTime,
  className = '' 
}) => {
  // Cost rating display
  const renderCostRating = () => {
    const dollarSigns = [];
    for (let i = 1; i <= 4; i++) {
      dollarSigns.push(
        <span 
          key={i} 
          className={`${i <= restaurant.costRating ? 'text-gray-900' : 'cost-rating-inactive'}`}
        >
          $
        </span>
      );
    }
    return <div className="cost-rating flex">{dollarSigns}</div>;
  };

  return (
    <div className={`restaurant-card overflow-hidden h-full flex flex-col ${className}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={restaurant.images[0]} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/restaurants/${restaurant.id}`} className="hover:text-burgundy-800">
            <h3 className="font-bold text-lg truncate">{restaurant.name}</h3>
          </Link>
          {renderCostRating()}
        </div>
        
        <div className="flex items-center mb-2 text-sm">
          <span className="flex items-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            {restaurant.rating}
          </span>
          <span className="mx-2">•</span>
          <span>{restaurant.reviewCount} reviews</span>
          <span className="mx-2">•</span>
          <span>{restaurant.cuisineType}</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {restaurant.description}
        </p>
        
        {/* Booked today count */}
        <div className="flex items-center text-xs text-gray-500 mt-auto mb-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>Booked {restaurant.bookedToday} times today</span>
        </div>
        
        {/* Available time slots */}
        {availableTimes.length > 0 && (
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-700 mb-2">
              <Users className="h-4 w-4 mr-2 text-burgundy-800" />
              <span className="font-medium">Table for {partySize} on {date}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTimes.map(time => (
                <button
                  key={time}
                  className="time-slot-button time-slot-button-available"
                  onClick={() => onSelectTime && onSelectTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
