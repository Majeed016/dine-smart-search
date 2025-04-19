
import React, { useState } from 'react';
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
  // Fallback image URLs for different scenarios
  const fallbackImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  const cuisineFallbackImages = {
    'Italian': "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    'Japanese': "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    'Chinese': "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    'Mexican': "https://images.unsplash.com/photo-1464219222984-216ebffaaf85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    'American': "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  };
  
  // State to track if image has loaded successfully
  const [imageError, setImageError] = useState(false);

  // Function to get appropriate fallback image based on restaurant cuisine
  const getFallbackImage = () => {
    if (restaurant.cuisineType && cuisineFallbackImages[restaurant.cuisineType as keyof typeof cuisineFallbackImages]) {
      return cuisineFallbackImages[restaurant.cuisineType as keyof typeof cuisineFallbackImages];
    }
    return fallbackImage;
  };

  // Determine which image source to use
  const getImageSource = () => {
    if (imageError) {
      return getFallbackImage();
    }
    if (restaurant.images && restaurant.images.length > 0) {
      return restaurant.images[0];
    }
    if (restaurant.imageUrl) {
      return restaurant.imageUrl;
    }
    return getFallbackImage();
  };

  const handleImageError = () => {
    console.log('Image failed to load, using fallback for:', restaurant.name);
    setImageError(true);
  };
  
  return (
    <div className={`restaurant-card overflow-hidden h-full flex flex-col rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={getImageSource()} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
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
