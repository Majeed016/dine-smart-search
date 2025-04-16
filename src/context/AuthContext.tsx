
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, users } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string, role: string) => Promise<boolean>;
  isLoading: boolean;
}

// Add an interface to track passwords since they're not stored in the mock data
interface UserCredentials {
  userId: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Store user credentials in memory (in a real app, this would be handled by a proper backend)
  const [userCredentials, setUserCredentials] = useState<UserCredentials[]>([]);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('bookTableUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for saved credentials in localStorage
    const savedCredentials = localStorage.getItem('userCredentials');
    if (savedCredentials) {
      setUserCredentials(JSON.parse(savedCredentials));
    } else {
      // Initialize with default credentials for mock users
      // In a real app, this would not be necessary as passwords would be stored securely in a database
      const initialCredentials = users.map(u => ({
        userId: u.id,
        password: 'password123' // Default password for all mock users
      }));
      setUserCredentials(initialCredentials);
      localStorage.setItem('userCredentials', JSON.stringify(initialCredentials));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email and role
    const foundUser = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.role === role
    );
    
    if (foundUser) {
      // Verify password using stored credentials
      const userCred = userCredentials.find(cred => cred.userId === foundUser.id);
      
      if (userCred && userCred.password === password) {
        setUser(foundUser);
        localStorage.setItem('bookTableUser', JSON.stringify(foundUser));
        setIsLoading(false);
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      }
    }
    
    setIsLoading(false);
    toast({
      title: "Login failed",
      description: "Invalid email, password, or role",
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
  
  const register = async (name: string, email: string, phone: string, password: string, role: string): Promise<boolean> => {
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
      role: role as 'customer' | 'restaurantManager' | 'admin'
    };
    
    // Store the user
    users.push(newUser);
    setUser(newUser);
    localStorage.setItem('bookTableUser', JSON.stringify(newUser));
    
    // Store the credentials
    const newCredentials = [...userCredentials, { userId: newUser.id, password }];
    setUserCredentials(newCredentials);
    localStorage.setItem('userCredentials', JSON.stringify(newCredentials));
    
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
