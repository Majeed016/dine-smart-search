
import React from 'react';
import { Star } from 'lucide-react';

interface RestaurantRatingProps {
  rating: number;
  reviewCount: number;
  cuisineType: string;
}

const RestaurantRating: React.FC<RestaurantRatingProps> = ({ 
  rating, 
  reviewCount, 
  cuisineType 
}) => {
  return (
    <div className="flex items-center mb-2 text-sm">
      <span className="flex items-center">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
        {rating}
      </span>
      <span className="mx-2">•</span>
      <span>{reviewCount} reviews</span>
      <span className="mx-2">•</span>
      <span>{cuisineType}</span>
    </div>
  );
};

export default RestaurantRating;
