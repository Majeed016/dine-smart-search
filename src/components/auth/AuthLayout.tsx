
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          </div>
          
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;
