
import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '@/data/mockData';
import CostRating from '@/components/restaurant/CostRating';
import RestaurantRating from '@/components/restaurant/RestaurantRating';
import BookedToday from '@/components/restaurant/BookedToday';
import TimeSlotSelector from '@/components/restaurant/TimeSlotSelector';

interface RestaurantCardProps {
  restaurant: Restaurant;
  availableTimes?: string[];
  partySize?: number;
  date?: string;
  onSelectTime?: (time: string) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  availableTimes = [], 
  partySize, 
  date,
  onSelectTime,
  className = '' 
}) => {
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
          <CostRating rating={restaurant.costRating} />
        </div>
        
        <RestaurantRating 
          rating={restaurant.rating}
          reviewCount={restaurant.reviewCount}
          cuisineType={restaurant.cuisineType}
        />
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {restaurant.description}
        </p>
        
        <BookedToday count={restaurant.bookedToday} />
        
        <TimeSlotSelector
          availableTimes={availableTimes}
          partySize={partySize}
          date={date}
          onSelectTime={onSelectTime}
        />
      </div>
    </div>
  );
};

export default RestaurantCard;
