
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Utensils, CalendarCheck, Search } from 'lucide-react';
import { restaurants } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';

const Index = () => {
  // Get a few featured restaurants
  const featuredRestaurants = restaurants.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find your table for any occasion
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Book the perfect dining experience at over 1,000 restaurants in your area
          </p>
          
          <div className="max-w-4xl">
            <SearchForm variant="hero" />
          </div>
        </div>
      </div>
      
      {/* Featured Restaurants */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <RestaurantCard 
                restaurant={restaurant} 
                className="p-4 h-full flex flex-col justify-between" 
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            to="/search" 
            className="inline-flex items-center rounded-md bg-burgundy-800 px-5 py-2.5 text-white hover:bg-burgundy-700 transition-colors"
          >
            <Search className="mr-2 h-4 w-4" />
            View All Restaurants
          </Link>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-burgundy-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Find available restaurants by date, time, party size, and location
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-burgundy-100 p-4 rounded-full mb-4">
                <Utensils className="h-8 w-8 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose</h3>
              <p className="text-gray-600">
                Browse menus, read reviews, and select your perfect dining spot
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-burgundy-100 p-4 rounded-full mb-4">
                <CalendarCheck className="h-8 w-8 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Instantly confirm your table with just a few clicks
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">What People Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-gray-700 italic mb-4">
              "BookTable made finding and reserving a table for our anniversary so easy. We got a perfect table at our favorite restaurant without any hassle."
            </p>
            <p className="font-semibold">- Sarah Johnson</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-gray-700 italic mb-4">
              "I love how I can see all available restaurants at a glance. The reviews and ratings have helped me discover amazing new places I wouldn't have found otherwise."
            </p>
            <p className="font-semibold">- Michael Chang</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400 mr-1" />
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-gray-700 italic mb-4">
              "As a restaurant owner, BookTable has significantly increased our bookings and helped us manage reservations more efficiently. The platform is intuitive for both diners and restaurants."
            </p>
            <p className="font-semibold">- Chef Antonio, Trattoria Italiana</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
