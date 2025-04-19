// This file is automatically generated. Do not edit it directly.
import { faker } from '@faker-js/faker';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  imageUrl: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  costRating: number;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  bookedToday: number;
  latitude: number;
  longitude: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

// Set seed for reproducible data
faker.seed(123);

// Generate a list of restaurants
const generateRestaurants = (): Restaurant[] => {
  const cuisineTypes = [
    'Italian',
    'Japanese',
    'Chinese',
    'Mexican',
    'French',
    'Indian',
    'Thai',
    'American',
    'Mediterranean',
    'Greek',
    'Spanish',
    'Lebanese',
    'Korean',
    'Vietnamese',
    'Brazilian',
    'German',
    'British'
  ];

  return Array.from({ length: 20 }, (_, index) => {
    const latitude = 34.05 + (Math.random() - 0.5) * 0.1;
    const longitude = -118.25 + (Math.random() - 0.5) * 0.1;
    const cuisineType = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
    
    // Use cuisine-specific images that are more reliable
    let mainImage: string;
    
    // Define reliable images for specific cuisines
    const cuisineImages: Record<string, string> = {
      'Italian': 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b',
      'Japanese': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10',
      'Chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
      'Mexican': 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85',
      'American': 'https://images.unsplash.com/photo-1550547660-d9450f859349',
      'French': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      'Indian': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'Thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
    };
    
    if (cuisineImages[cuisineType]) {
      mainImage = `${cuisineImages[cuisineType]}?w=800&h=600&auto=format&fit=crop&q=80`;
    } else {
      mainImage = `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&auto=format&fit=crop&q=80&sig=${index}`;
    }
    
    const otherImages = [
      `https://images.unsplash.com/photo-1484659619207-9165d119dafe?w=800&h=600&auto=format&fit=crop&q=80&sig=${index}-1`,
      `https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&auto=format&fit=crop&q=80&sig=${index}-2`,
    ];
    
    const hours = {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' },
    };
    
    return {
      id: `rest-${index + 1}`,
      name: index < 5 
        ? ['La Bella Italia', 'Sakura Sushi', 'El Mariachi', 'Le Petit Bistro', 'Taj Mahal'][index] 
        : faker.company.name() + ' ' + (Math.random() > 0.5 ? 'Restaurant' : 'Bistro'),
      description: faker.lorem.paragraph(),
      cuisineType,
      imageUrl: mainImage,
      images: [mainImage, ...otherImages],
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      },
      phone: faker.phone.number(),
      website: 'https://www.' + faker.internet.domainName(),
      rating: Number((3 + Math.random() * 2).toFixed(1)),
      reviewCount: Math.floor(10 + Math.random() * 490),
      costRating: Math.floor(1 + Math.random() * 4),
      openingHours: hours,
      hours: hours,
      bookedToday: Math.floor(Math.random() * 20),
      latitude,
      longitude,
    };
  });
};

const generateReviews = (restaurants: Restaurant[]): Review[] => {
  const reviews: Review[] = [];
  
  restaurants.forEach(restaurant => {
    const reviewCount = Math.floor(5 + Math.random() * 15);
    
    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        id: `review-${restaurant.id}-${i}`,
        restaurantId: restaurant.id,
        userName: faker.person.fullName(),
        rating: Math.floor(1 + Math.random() * 5),
        date: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
        comment: faker.lorem.paragraph(),
      });
    }
  });
  
  return reviews;
};

// Generate mock reservations
const generateReservations = (restaurants: Restaurant[]): Reservation[] => {
  const reservations: Reservation[] = [];
  
  // Generate some sample user IDs
  const userIds = Array.from({ length: 10 }, (_, i) => `user-${i + 1}`);
  
  restaurants.forEach(restaurant => {
    const reservationCount = Math.floor(5 + Math.random() * 20);
    
    for (let i = 0; i < reservationCount; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const daysFromNow = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      
      reservations.push({
        id: `res-${restaurant.id}-${i}`,
        restaurantId: restaurant.id,
        userId,
        date: date.toISOString().split('T')[0],
        time: ['11:30', '12:00', '13:00', '18:30', '19:00', '20:00'][Math.floor(Math.random() * 6)],
        partySize: Math.floor(1 + Math.random() * 6),
        status: Math.random() > 0.8 ? 'cancelled' : (daysFromNow < 0 ? 'completed' : 'confirmed'),
        createdAt: new Date(date.getTime() - 86400000 * Math.floor(Math.random() * 10)).toISOString()
      });
    }
  });
  
  return reservations;
};

// Create the restaurants and reviews data
export const restaurants = generateRestaurants();
export const reviews = generateReviews(restaurants);
export const reservations = generateReservations(restaurants);

// Get restaurant by ID
export const getRestaurantById = (id: string): Restaurant | null => {
  return restaurants.find(restaurant => restaurant.id === id) || null;
};

// Get reviews for a restaurant
export const getReviewsForRestaurant = (restaurantId: string): Review[] => {
  return reviews.filter(review => review.restaurantId === restaurantId);
};

// Alias for compatibility
export const getReviewsByRestaurantId = getReviewsForRestaurant;

// Get restaurants by manager ID (mock function)
export const getRestaurantsByManagerId = (managerId: string): Restaurant[] => {
  // In a real app, we would filter by manager ID
  // For mock data, just return the first 3 restaurants
  return restaurants.slice(0, 3);
};

// Get reservations by restaurant ID
export const getReservationsByRestaurantId = (restaurantId: string): Reservation[] => {
  return reservations.filter(reservation => reservation.restaurantId === restaurantId);
};

// Get reservations by user ID
export const getReservationsByUserId = (userId: string): Reservation[] => {
  return reservations.filter(reservation => reservation.userId === userId);
};

// Cancel a reservation
export const cancelReservation = (reservationId: string): boolean => {
  const index = reservations.findIndex(res => res.id === reservationId);
  if (index !== -1) {
    reservations[index].status = 'cancelled';
    return true;
  }
  return false;
};

// Get restaurants by search criteria
export const getRestaurantsByAvailability = (
  date: string,
  time: string,
  partySize: number,
  location: string = ''
): Restaurant[] => {
  // Filter restaurants by location if provided
  let filteredRestaurants = restaurants;
  
  if (location && location.trim() !== '') {
    const locationLower = location.toLowerCase();
    filteredRestaurants = restaurants.filter(restaurant => 
      restaurant.address.city.toLowerCase().includes(locationLower) ||
      restaurant.address.state.toLowerCase().includes(locationLower) ||
      restaurant.name.toLowerCase().includes(locationLower) ||
      restaurant.cuisineType.toLowerCase().includes(locationLower)
    );
  }
  
  // In a real application, we would check for actual availability based on reservations
  // For now, we'll just return the filtered restaurants
  return filteredRestaurants;
};

// Get all time slots for the reservation form
export const getAllTimeSlots = (): string[] => {
  return [
    '11:00', '11:30', 
    '12:00', '12:30', 
    '13:00', '13:30', 
    '14:00', '14:30',
    '17:00', '17:30',
    '18:00', '18:30', 
    '19:00', '19:30', 
    '20:00', '20:30',
    '21:00', '21:30'
  ];
};

// Get available time slots for a specific restaurant, date, and party size
export const getAvailableTimeSlots = (
  restaurant: Restaurant,
  date: string,
  partySize: number
): string[] => {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const hours = restaurant.openingHours[dayOfWeek];
  
  if (!hours) return [];
  
  const startTime = parseInt(hours.open.split(':')[0]);
  const endTime = parseInt(hours.close.split(':')[0]);
  
  // Generate all half-hour slots between opening and closing times
  const allTimeSlots = [];
  for (let hour = startTime; hour < endTime; hour++) {
    allTimeSlots.push(`${hour}:00`);
    if (hour + 0.5 < endTime) {
      allTimeSlots.push(`${hour}:30`);
    }
  }
  
  // In a real application, we would filter out already booked slots
  // For this mock, we'll randomly filter out some slots
  return allTimeSlots.filter(() => Math.random() > 0.3);
};
