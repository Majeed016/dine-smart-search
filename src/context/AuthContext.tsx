
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string, role: string) => Promise<boolean>;
  isLoading: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'customer' | 'restaurantManager' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const profile = await fetchUserProfile(newSession.user.id);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id);
        setUserProfile(profile);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        // Check if user has the specified role
        const profile = await fetchUserProfile(data.user.id);
        
        if (!profile) {
          toast({
            title: "Login failed",
            description: "Error retrieving user profile",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          return false;
        }

        if (profile.role !== role) {
          toast({
            title: "Login failed",
            description: `You don't have ${role} access. Please select the correct role.`,
            variant: "destructive"
          });
          await supabase.auth.signOut();
          return false;
        }

        setUserProfile(profile);

        toast({
          title: "Login successful",
          description: `Welcome back, ${profile.name}!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };
  
  const register = async (name: string, email: string, phone: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      // The profile should be created by the database trigger
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setUserProfile(profile);
      }

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, session, userProfile, login, logout, register, isLoading }}>
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
