import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Share2, Ticket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn, OPENING_HOURS } from '@/lib/utils';
import axios from 'axios';

// Backend Exhibition interface
interface ApiExhibition {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Frontend Exhibition display interface
interface Exhibition {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: 'current' | 'upcoming' | 'past';
  duration: string;
  location: string;
  price: number;
}

const Exhibitions = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get('/api/exhibitions');
        const apiExhibitions: ApiExhibition[] = response.data.exhibitions;
        
        // Transform API data to match our display format
        const transformedExhibitions = apiExhibitions.map((exhibition: ApiExhibition) => {
          const today = new Date();
          const startDate = new Date(exhibition.startDate);
          const endDate = new Date(exhibition.endDate);
          
          let category: 'current' | 'upcoming' | 'past';
          if (today > endDate) {
            category = 'past';
          } else if (today >= startDate && today <= endDate) {
            category = 'current';
          } else {
            category = 'upcoming';
          }
          
          // Format dates for display: "Month DD - Month DD, YYYY"
          const formatDate = (start: Date, end: Date) => {
            const startMonth = start.toLocaleString('default', { month: 'long' });
            const endMonth = end.toLocaleString('default', { month: 'long' });
            const startDay = start.getDate();
            const endDay = end.getDate();
            const endYear = end.getFullYear();
            
            if (startMonth === endMonth) {
              return `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
            } else {
              return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
            }
          };
          
          return {
            id: exhibition._id,
            title: exhibition.name,
            description: exhibition.description,
            date: formatDate(startDate, endDate),
            image: exhibition.imageUrl,
            category: category,
            duration: 'See opening hours below',  // Updated to reference opening hours
            location: 'Main Exhibition Hall',  // Default location
            price: exhibition.price
          };
        });
        
        setExhibitions(transformedExhibitions);
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load exhibitions. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    fetchExhibitions();
  }, []);
  
  // Filter exhibitions by category
  const currentExhibitions = exhibitions.filter(exhibition => exhibition.category === 'current');
  const upcomingExhibitions = exhibitions.filter(exhibition => exhibition.category === 'upcoming');
  const pastExhibitions = exhibitions.filter(exhibition => exhibition.category === 'past');
  
  // Handle share button click
  const handleShare = (exhibition: Exhibition) => {
    // In a real app, would use Web Share API if available
    navigator.clipboard.writeText(`Check out the "${exhibition.title}" exhibition at our museum! ${window.location.origin}/exhibitions`);
    
    toast({
      title: 'Link Copied!',
      description: 'Exhibition link copied to clipboard.',
    });
  };
  
  return (
    <div className="container max-w-6xl py-20">
      <div className="space-y-10">
        {/* Page Title */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
            Exhibitions
          </h1>
          <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
            Explore our current, upcoming, and past exhibitions showcasing art, history, and culture from around the world.
          </p>
        </div>
        
        {/* Opening Hours Information */}
        <div className="bg-museum-50 dark:bg-museum-800 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="font-display text-xl font-bold text-museum-900 dark:text-white mb-3">Opening Hours</h2>
          <ul className="space-y-1 text-museum-700 dark:text-museum-300">
            <li className="flex justify-between"><span>Monday:</span> <span>{OPENING_HOURS.monday}</span></li>
            <li className="flex justify-between"><span>Tuesday - Friday:</span> <span>{OPENING_HOURS.tuesdayToFriday}</span></li>
            <li className="flex justify-between"><span>Saturday - Sunday:</span> <span>{OPENING_HOURS.weekends}</span></li>
            <li className="flex justify-between"><span>Public Holidays:</span> <span>{OPENING_HOURS.publicHolidays}</span></li>
          </ul>
          <p className="mt-3 text-sm text-museum-600 dark:text-museum-400">Last admission is 1 hour before closing.</p>
        </div>
        
        {/* Exhibition Tabs */}
        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-museum-100 dark:bg-museum-800">
              <TabsTrigger value="current" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                Current
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                Past
              </TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-700"></div>
            </div>
          ) : (
            <>
              {/* Current Exhibitions */}
              <TabsContent value="current" className="space-y-8">
                {currentExhibitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentExhibitions.map((exhibition, index) => (
                      <ExhibitionCard 
                        key={exhibition.id} 
                        exhibition={exhibition} 
                        onShare={handleShare}
                        isLoaded={loaded}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-museum-500">No current exhibitions available.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Upcoming Exhibitions */}
              <TabsContent value="upcoming" className="space-y-8">
                {upcomingExhibitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingExhibitions.map((exhibition, index) => (
                      <ExhibitionCard 
                        key={exhibition.id} 
                        exhibition={exhibition} 
                        onShare={handleShare}
                        isLoaded={loaded}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-museum-500">No upcoming exhibitions yet.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Past Exhibitions */}
              <TabsContent value="past" className="space-y-8">
                {pastExhibitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastExhibitions.map((exhibition, index) => (
                      <ExhibitionCard 
                        key={exhibition.id} 
                        exhibition={exhibition} 
                        onShare={handleShare}
                        isLoaded={loaded}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-museum-500">No past exhibitions to display.</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

// Exhibition Card Component
const ExhibitionCard: React.FC<{
  exhibition: Exhibition;
  onShare: (exhibition: Exhibition) => void;
  isLoaded: boolean;
  index: number;
}> = ({ exhibition, onShare, isLoaded, index }) => {
  const isPast = exhibition.category === 'past';
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-museum-200 dark:border-museum-700 transition-all duration-500",
        isPast ? "opacity-80" : "hover-scale",
        isLoaded && "animate-scale-in"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={exhibition.image} 
          alt={exhibition.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className={cn(
            "text-xs py-1",
            exhibition.category === 'current' ? "bg-green-500" : 
            exhibition.category === 'upcoming' ? "bg-blue-500" : 
            "bg-museum-500"
          )}>
            {exhibition.category.charAt(0).toUpperCase() + exhibition.category.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{exhibition.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 text-museum-500 dark:text-museum-400">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-sm">{exhibition.date}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-museum-600 dark:text-museum-300 line-clamp-3">
          {exhibition.description}
        </p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 text-museum-500 dark:text-museum-400 mt-0.5" />
            <span className="text-museum-700 dark:text-museum-300">{exhibition.duration}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-museum-500 dark:text-museum-400 mt-0.5">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-museum-700 dark:text-museum-300">{exhibition.location}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-museum-500 dark:text-museum-400 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-museum-700 dark:text-museum-300">${exhibition.price}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onShare(exhibition)}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Link to="/tickets" className="flex-1">
          <Button 
            size="sm" 
            className="w-full bg-accent-700 hover:bg-accent-800 text-white"
            disabled={isPast}
          >
            <Ticket className="h-4 w-4 mr-2" />
            {isPast ? 'Ended' : 'Get Tickets'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Exhibitions;
