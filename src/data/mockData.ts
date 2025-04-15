
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  cuisineType: string;
  costRating: number; // 1-4, representing $ to $$$$
  rating: number; // 1-5 stars
  reviewCount: number;
  images: string[];
  bookedToday: number;
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  availableTables: {
    [date: string]: {
      [time: string]: {
        twoSeater: number;
        fourSeater: number;
        largeGroup: number;
      };
    };
  };
  managerId: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'restaurantManager' | 'admin';
  restaurantId?: string; // Only applicable for restaurant managers
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

// Mock Restaurants
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "The Burgundy Bistro",
    description: "An elegant French bistro with a cozy ambiance, serving authentic French cuisine with a modern twist. Our chef's specials include Coq au Vin and Beef Bourguignon, perfectly paired with our extensive wine selection.",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    cuisineType: "French",
    costRating: 3,
    rating: 4.7,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    bookedToday: 24,
    hours: {
      monday: { open: "17:00", close: "22:00" },
      tuesday: { open: "17:00", close: "22:00" },
      wednesday: { open: "17:00", close: "22:00" },
      thursday: { open: "17:00", close: "22:00" },
      friday: { open: "17:00", close: "23:00" },
      saturday: { open: "17:00", close: "23:00" },
      sunday: { open: "17:00", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "17:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "17:30": { twoSeater: 2, fourSeater: 1, largeGroup: 1 },
        "18:00": { twoSeater: 0, fourSeater: 2, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 1 },
        "19:00": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "20:30": { twoSeater: 4, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 }
      },
      "2025-04-16": {
        "17:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 },
        "17:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "18:30": { twoSeater: 1, fourSeater: 1, largeGroup: 1 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 0, fourSeater: 1, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "20:30": { twoSeater: 4, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 }
      }
    },
    managerId: "manager1"
  },
  {
    id: "2",
    name: "Sakura Sushi",
    description: "Experience authentic Japanese cuisine with our expertly crafted sushi and sashimi. Our chefs use only the freshest ingredients, flown in daily from Japan. Enjoy your meal in our tranquil Japanese garden-inspired setting.",
    address: {
      street: "456 Market St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      coordinates: {
        lat: 37.7895,
        lng: -122.3999
      }
    },
    cuisineType: "Japanese",
    costRating: 4,
    rating: 4.9,
    reviewCount: 256,
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    bookedToday: 42,
    hours: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "12:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "12:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "18:00": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 1, largeGroup: 1 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      },
      "2025-04-16": {
        "12:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 },
        "12:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "18:30": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "19:00": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 1, fourSeater: 1, largeGroup: 0 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      }
    },
    managerId: "manager2"
  },
  {
    id: "3",
    name: "Trattoria Italiana",
    description: "A family-owned Italian restaurant serving homemade pasta and wood-fired pizzas. Our recipes have been passed down through generations, offering an authentic taste of Italy in the heart of the city.",
    address: {
      street: "789 Mission St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      coordinates: {
        lat: 37.7847,
        lng: -122.4060
      }
    },
    cuisineType: "Italian",
    costRating: 2,
    rating: 4.5,
    reviewCount: 189,
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    bookedToday: 18,
    hours: {
      monday: { open: "11:30", close: "22:00" },
      tuesday: { open: "11:30", close: "22:00" },
      wednesday: { open: "11:30", close: "22:00" },
      thursday: { open: "11:30", close: "22:00" },
      friday: { open: "11:30", close: "23:00" },
      saturday: { open: "11:30", close: "23:00" },
      sunday: { open: "11:30", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "11:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "12:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "18:00": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "18:30": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      },
      "2025-04-16": {
        "11:30": { twoSeater: 5, fourSeater: 3, largeGroup: 1 },
        "12:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "18:30": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      }
    },
    managerId: "manager3"
  },
  {
    id: "4",
    name: "Spice Kingdom",
    description: "Experience the rich flavors of authentic Indian cuisine at Spice Kingdom. Our menu features traditional dishes from across India, each prepared with our signature blend of spices. Join us for a culinary journey through the diverse tastes of India.",
    address: {
      street: "321 Howard St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      coordinates: {
        lat: 37.7914,
        lng: -122.3944
      }
    },
    cuisineType: "Indian",
    costRating: 2,
    rating: 4.6,
    reviewCount: 165,
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
    ],
    bookedToday: 21,
    hours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "11:00", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "11:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "11:30": { twoSeater: 3, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "20:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "21:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 }
      },
      "2025-04-16": {
        "11:00": { twoSeater: 5, fourSeater: 3, largeGroup: 1 },
        "11:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 1, fourSeater: 1, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 1, fourSeater: 1, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      }
    },
    managerId: "manager4"
  },
  {
    id: "5",
    name: "The Smokehouse Grill",
    description: "Southern barbecue at its finest. Our slow-smoked meats are cooked to perfection in our custom-built smokehouse. Enjoy fall-off-the-bone ribs, tender brisket, and our famous pulled pork with a selection of homemade sauces and sides.",
    address: {
      street: "555 Folsom St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      coordinates: {
        lat: 37.7854,
        lng: -122.3956
      }
    },
    cuisineType: "American BBQ",
    costRating: 2,
    rating: 4.4,
    reviewCount: 203,
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80"
    ],
    bookedToday: 32,
    hours: {
      monday: { open: "11:30", close: "21:00" },
      tuesday: { open: "11:30", close: "21:00" },
      wednesday: { open: "11:30", close: "21:00" },
      thursday: { open: "11:30", close: "21:00" },
      friday: { open: "11:30", close: "22:00" },
      saturday: { open: "11:30", close: "22:00" },
      sunday: { open: "11:30", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "11:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "12:00": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "18:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "20:30": { twoSeater: 4, fourSeater: 2, largeGroup: 1 }
      },
      "2025-04-16": {
        "11:30": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "12:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "18:00": { twoSeater: 1, fourSeater: 1, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 1, largeGroup: 1 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 }
      }
    },
    managerId: "manager5"
  },
  {
    id: "6",
    name: "Coastal Seafood Co.",
    description: "Fresh seafood sourced daily from local fishermen. Our sustainable approach to seafood ensures the highest quality dishes while supporting the local fishing community. Enjoy spectacular ocean views while dining on our award-winning seafood platters.",
    address: {
      street: "888 Embarcadero",
      city: "San Francisco",
      state: "CA",
      zipCode: "94111",
      coordinates: {
        lat: 37.8002,
        lng: -122.4001
      }
    },
    cuisineType: "Seafood",
    costRating: 3,
    rating: 4.8,
    reviewCount: 284,
    images: [
      "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
    ],
    bookedToday: 38,
    hours: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    availableTables: {
      "2025-04-15": {
        "12:00": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "12:30": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "18:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 1, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 2, fourSeater: 1, largeGroup: 0 },
        "20:30": { twoSeater: 3, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 }
      },
      "2025-04-16": {
        "12:00": { twoSeater: 4, fourSeater: 3, largeGroup: 1 },
        "12:30": { twoSeater: 3, fourSeater: 3, largeGroup: 1 },
        "18:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "18:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:00": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "19:30": { twoSeater: 0, fourSeater: 0, largeGroup: 0 },
        "20:00": { twoSeater: 1, fourSeater: 1, largeGroup: 0 },
        "20:30": { twoSeater: 2, fourSeater: 2, largeGroup: 1 },
        "21:00": { twoSeater: 3, fourSeater: 3, largeGroup: 1 }
      }
    },
    managerId: "manager6"
  }
];

export const reviews: Review[] = [
  {
    id: "1",
    restaurantId: "1",
    userId: "user1",
    userName: "John Doe",
    rating: 5,
    comment: "Absolutely fantastic dining experience! The coq au vin was flawless and the wine pairing recommendation was perfect. Service was attentive without being intrusive. Will definitely be back!",
    date: "2025-04-10"
  },
  {
    id: "2",
    restaurantId: "1",
    userId: "user2",
    userName: "Emma Johnson",
    rating: 4,
    comment: "Great ambiance and delicious food. The duck confit was tender and flavorful. Only giving 4 stars because we had to wait a bit longer than expected for our reservation.",
    date: "2025-04-05"
  },
  {
    id: "3",
    restaurantId: "2",
    userId: "user3",
    userName: "Michael Chen",
    rating: 5,
    comment: "The best sushi I've had outside of Japan! Every piece was expertly crafted and the fish was incredibly fresh. Chef's omakase is a must-try for sushi enthusiasts.",
    date: "2025-04-12"
  },
  {
    id: "4",
    restaurantId: "2",
    userId: "user4",
    userName: "Sophie Martinez",
    rating: 5,
    comment: "Amazing sushi experience! The attention to detail is incredible, from the beautiful presentation to the perfect rice temperature. Worth every penny.",
    date: "2025-04-08"
  },
  {
    id: "5",
    restaurantId: "3",
    userId: "user5",
    userName: "David Williams",
    rating: 4,
    comment: "Genuine Italian flavors in a cozy setting. The homemade pasta was exceptional, especially the pappardelle with wild boar ragu. Great value for the quality!",
    date: "2025-04-11"
  },
  {
    id: "6",
    restaurantId: "3",
    userId: "user6",
    userName: "Isabella Garcia",
    rating: 5,
    comment: "This is authentic Italian food at its best! The wood-fired pizza reminded me of Naples, and the tiramisu was heavenly. Family atmosphere makes it even more special.",
    date: "2025-04-07"
  }
];

export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    role: "customer"
  },
  {
    id: "user2",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "555-234-5678",
    role: "customer"
  },
  {
    id: "manager1",
    name: "Pierre Dubois",
    email: "pierre@burgundybistro.com",
    phone: "555-345-6789",
    role: "restaurantManager",
    restaurantId: "1"
  },
  {
    id: "manager2",
    name: "Hiroshi Tanaka",
    email: "hiroshi@sakurasushi.com",
    phone: "555-456-7890",
    role: "restaurantManager",
    restaurantId: "2"
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@booktable.com",
    phone: "555-789-0123",
    role: "admin"
  }
];

export const reservations: Reservation[] = [
  {
    id: "1",
    restaurantId: "1",
    userId: "user1",
    date: "2025-04-15",
    time: "19:00",
    partySize: 2,
    status: "confirmed",
    createdAt: "2025-04-10T14:30:00Z"
  },
  {
    id: "2",
    restaurantId: "2",
    userId: "user2",
    date: "2025-04-15",
    time: "18:30",
    partySize: 4,
    status: "confirmed",
    createdAt: "2025-04-09T10:15:00Z"
  },
  {
    id: "3",
    restaurantId: "3",
    userId: "user1",
    date: "2025-04-16",
    time: "19:00",
    partySize: 2,
    status: "confirmed",
    createdAt: "2025-04-11T09:45:00Z"
  }
];

// Helper functions for data access
export const getRestaurantsByAvailability = (date: string, time: string, partySize: number, location?: string) => {
  // Convert time to nearest 30 min slot
  const timeSlots = getAllTimeSlots();
  const timeIndex = timeSlots.findIndex(t => t === time);
  
  // Get +/- 30 min from requested time
  const startIndex = Math.max(0, timeIndex - 1);
  const endIndex = Math.min(timeSlots.length - 1, timeIndex + 1);
  const searchTimeSlots = timeSlots.slice(startIndex, endIndex + 1);
  
  return restaurants.filter(restaurant => {
    // Check location if provided
    if (location) {
      const matchesCity = restaurant.address.city.toLowerCase().includes(location.toLowerCase());
      const matchesZip = restaurant.address.zipCode.includes(location);
      const matchesState = restaurant.address.state.toLowerCase().includes(location.toLowerCase());
      
      if (!matchesCity && !matchesZip && !matchesState) {
        return false;
      }
    }
    
    // Check availability for the date and timeSlots
    if (!restaurant.availableTables[date]) {
      return false;
    }
    
    // Check if any of the time slots have availability
    return searchTimeSlots.some(timeSlot => {
      const availabilityAtTime = restaurant.availableTables[date][timeSlot];
      if (!availabilityAtTime) return false;
      
      // Check if there's a table available for the party size
      if (partySize <= 2 && availabilityAtTime.twoSeater > 0) return true;
      if (partySize <= 4 && availabilityAtTime.fourSeater > 0) return true;
      if (partySize > 4 && availabilityAtTime.largeGroup > 0) return true;
      
      return false;
    });
  });
};

export const getAvailableTimeSlots = (restaurant: Restaurant, date: string, partySize: number) => {
  const availableTimes: string[] = [];
  
  if (!restaurant.availableTables[date]) {
    return availableTimes;
  }
  
  Object.entries(restaurant.availableTables[date]).forEach(([time, tables]) => {
    if (
      (partySize <= 2 && tables.twoSeater > 0) ||
      (partySize <= 4 && tables.fourSeater > 0) ||
      (partySize > 4 && tables.largeGroup > 0)
    ) {
      availableTimes.push(time);
    }
  });
  
  return availableTimes;
};

export const getAllTimeSlots = () => {
  return [
    "11:00", "11:30", 
    "12:00", "12:30", 
    "13:00", "13:30", 
    "14:00", "14:30", 
    "15:00", "15:30", 
    "16:00", "16:30", 
    "17:00", "17:30", 
    "18:00", "18:30", 
    "19:00", "19:30", 
    "20:00", "20:30", 
    "21:00", "21:30"
  ];
};

export const getRestaurantById = (id: string) => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const getReviewsByRestaurantId = (restaurantId: string) => {
  return reviews.filter(review => review.restaurantId === restaurantId);
};

export const getRestaurantsByManagerId = (managerId: string) => {
  return restaurants.filter(restaurant => restaurant.managerId === managerId);
};

export const getReservationsByRestaurantId = (restaurantId: string) => {
  return reservations.filter(reservation => reservation.restaurantId === restaurantId);
};

export const getReservationsByUserId = (userId: string) => {
  return reservations.filter(reservation => reservation.userId === userId);
};

export const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
  const newReservation: Reservation = {
    ...reservation,
    id: `res-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  reservations.push(newReservation);
  return newReservation;
};

export const cancelReservation = (reservationId: string) => {
  const index = reservations.findIndex(r => r.id === reservationId);
  if (index !== -1) {
    reservations[index].status = 'cancelled';
    return true;
  }
  return false;
};

// Authentication helpers
export const getCurrentUser = () => {
  // In a real app, this would check for auth token/session
  // For demo, we'll return a customer user
  return users.find(user => user.role === 'customer');
};
