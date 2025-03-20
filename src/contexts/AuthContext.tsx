import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: User, token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if token is valid
  const validateToken = async (token: string) => {
    try {
      // Make a request to an authenticated endpoint to verify token validity
      await axios.get('/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        // Set up axios header first
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          // Check if token is still valid
          const isValid = await validateToken(storedToken);
          
          if (isValid) {
            // If token is valid, set the user and token
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            console.log('Auth loaded from storage successfully');
          } else {
            // If token is invalid, clear storage and state
            console.log('Stored token is invalid, logging out');
            logout();
            toast({
              title: 'Session expired',
              description: 'Please login again',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error validating token:', error);
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      }
    };
    
    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const { user, token } = response.data;
      
      // Save to state
      setUser(user);
      setToken(token);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set axios default header for authentication
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (user: User, token: string) => {
    // Save to state
    setUser(user);
    setToken(token);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    // Set axios default header for authentication
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Signup successful');
  };

  const logout = () => {
    console.log('Logging out, clearing auth state');
    
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 