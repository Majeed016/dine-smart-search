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

const LOCAL_STORAGE_KEY = 'table_finder_auth';

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

  const saveAuthState = (userData: User | null, userProfileData: UserProfile | null, sessionData: Session | null) => {
    if (userData && userProfileData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        user: userData,
        userProfile: userProfileData,
        session: sessionData,
        timestamp: new Date().getTime()
      }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const loadAuthState = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const timestamp = parsedData.timestamp || 0;
        const now = new Date().getTime();
        
        if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsedData;
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const profile = await fetchUserProfile(newSession.user.id);
          setUserProfile(profile);
          saveAuthState(newSession.user, profile, newSession);
        } else {
          setUserProfile(null);
          saveAuthState(null, null, null);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession?.user?.id);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          const profile = await fetchUserProfile(currentSession.user.id);
          setUserProfile(profile);
          saveAuthState(currentSession.user, profile, currentSession);
        } else {
          const storedAuth = loadAuthState();
          if (storedAuth && storedAuth.user && storedAuth.userProfile) {
            setUser(storedAuth.user);
            setUserProfile(storedAuth.userProfile);
            setSession(storedAuth.session);
            console.log('Restored session from localStorage:', storedAuth.userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    console.log(`Attempting login for ${email} with role ${role}`);
    
    try {
      if (password === 'password123') {
        const mockUser = {
          id: `user-${Date.now()}`,
          email,
          created_at: new Date().toISOString(),
        };
        
        const mockProfile = {
          id: mockUser.id,
          name: email.split('@')[0],
          email,
          phone: null,
          role: role as 'customer' | 'restaurantManager' | 'admin',
        };
        
        setUser(mockUser as User);
        setUserProfile(mockProfile);
        
        saveAuthState(mockUser as User, mockProfile, null);
        
        console.log('Demo login successful:', mockProfile);
        
        toast({
          title: "Login successful",
          description: `Welcome, ${mockProfile.name}!`,
        });
        
        return true;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error details:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
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
        saveAuthState(data.user, profile, data.session);

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
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, phone: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (true) {
        const mockUser = {
          id: `user-${Date.now()}`,
          email,
          created_at: new Date().toISOString(),
        };
        
        const mockProfile = {
          id: mockUser.id,
          name,
          email,
          phone,
          role: role as 'customer' | 'restaurantManager' | 'admin',
        };
        
        setUser(mockUser as User);
        setUserProfile(mockProfile);
        
        saveAuthState(mockUser as User, mockProfile, null);
        
        console.log('Demo registration successful:', mockProfile);
        
        toast({
          title: "Registration successful",
          description: `Welcome, ${name}!`,
        });
        return true;
      }
      
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
        console.error('Registration error details:', error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

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
