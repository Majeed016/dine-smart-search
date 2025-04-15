
import React, { useRef, useEffect } from 'react';
import { Restaurant } from '@/data/mockData';
import { MapPin } from 'lucide-react';

interface RestaurantMapProps {
  restaurant: Restaurant;
  height?: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurant, height = "400px" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // In a real application, we would integrate with a map provider like Google Maps, Mapbox, etc.
  // For this demo, we'll just create a styled container with coordinates
  
  useEffect(() => {
    if (mapRef.current) {
      // In a real app, we would initialize the map here
      console.log("Map would be initialized with coordinates:", restaurant.address.coordinates);
    }
  }, [restaurant.address.coordinates]);
  
  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-200 flex items-center justify-center relative"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={40} className="mx-auto text-burgundy-800" />
            <div className="mt-2 text-sm">
              <p className="font-semibold">{restaurant.name}</p>
              <p>{restaurant.address.street}</p>
              <p>{restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}</p>
              <p className="text-xs mt-2 text-gray-600">
                Lat: {restaurant.address.coordinates.lat}, Lng: {restaurant.address.coordinates.lng}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;
