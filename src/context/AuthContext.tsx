
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, users } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('bookTableUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would make an API call to verify credentials
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('bookTableUser', JSON.stringify(foundUser));
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    }
    
    setIsLoading(false);
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive"
    });
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookTableUser');
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };
  
  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive"
      });
      return false;
    }
    
    // Create new user (in a real app, this would make an API call)
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer'
    };
    
    users.push(newUser);
    setUser(newUser);
    localStorage.setItem('bookTableUser', JSON.stringify(newUser));
    
    setIsLoading(false);
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
    return true;
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
