
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Share2, Ticket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Exhibition interface
interface Exhibition {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: 'current' | 'upcoming' | 'past';
  duration: string;
  location: string;
}

const Exhibitions: React.FC = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  // Mock exhibitions data
  const exhibitions: Exhibition[] = [
    {
      id: 'modern-masters',
      title: 'Modern Masterpieces',
      description: 'Discover iconic works from the most influential artists of the modern era, showcasing revolutionary techniques and groundbreaking artistic movements that shaped the 20th century.',
      date: 'April 15 - August 30, 2023',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080',
      category: 'current',
      duration: '9:00 AM - 6:00 PM',
      location: 'East Wing, Floor 2',
    },
    {
      id: 'ancient-civilizations',
      title: 'Ancient Civilizations',
      description: 'Journey through time to explore the artifacts, art, and architecture of the world\'s great ancient civilizations, from Egypt and Mesopotamia to Greece, Rome, and beyond.',
      date: 'May 10 - October 15, 2023',
      image: 'https://images.unsplash.com/photo-1564399579883-451a5cb0507e?q=80&w=2071',
      category: 'current',
      duration: '10:00 AM - 5:00 PM',
      location: 'North Wing, Floor 1',
    },
    {
      id: 'natural-wonders',
      title: 'Natural Wonders',
      description: 'Experience the beauty and complexity of our natural world through stunning photography, interactive displays, and scientific specimens that reveal Earth\'s extraordinary biodiversity.',
      date: 'June 5 - September 20, 2023',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2069',
      category: 'current',
      duration: '9:00 AM - 7:00 PM',
      location: 'West Wing, Floor 3',
    },
    {
      id: 'digital-revolution',
      title: 'Digital Art Revolution',
      description: 'Explore the cutting-edge of artistic expression with immersive installations, digital sculptures, and interactive media created by renowned digital artists pushing the boundaries of technology.',
      date: 'November 10, 2023 - February 15, 2024',
      image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2064',
      category: 'upcoming',
      duration: '10:00 AM - 8:00 PM',
      location: 'South Wing, Floor 2',
    },
    {
      id: 'indigenous-cultures',
      title: 'Indigenous Cultures',
      description: 'Celebrate the rich heritage and contemporary expressions of indigenous peoples from around the world through traditional artifacts, contemporary art, and multimedia presentations.',
      date: 'December 5, 2023 - March 30, 2024',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1974',
      category: 'upcoming',
      duration: '9:00 AM - 6:00 PM',
      location: 'East Wing, Floor 1',
    },
    {
      id: 'renaissance-masters',
      title: 'Renaissance Masters',
      description: 'Rediscover the genius of the Renaissance through an extraordinary collection of paintings, sculptures, and drawings that defined one of history\'s most influential artistic periods.',
      date: 'January 15 - May 10, 2023',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?q=80&w=2070',
      category: 'past',
      duration: '10:00 AM - 5:00 PM',
      location: 'North Wing, Floor 2',
    },
    {
      id: 'abstract-expressions',
      title: 'Abstract Expressions',
      description: 'Experience the power of abstract art through a stunning selection of works that communicate emotion, ideas, and concepts beyond representation, from early pioneers to contemporary innovators.',
      date: 'February 20 - June 15, 2023',
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2066',
      category: 'past',
      duration: '9:00 AM - 6:00 PM',
      location: 'West Wing, Floor 1',
    },
  ];
  
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
          
          {/* Current Exhibitions */}
          <TabsContent value="current" className="space-y-8">
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
          </TabsContent>
          
          {/* Upcoming Exhibitions */}
          <TabsContent value="upcoming" className="space-y-8">
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
          </TabsContent>
          
          {/* Past Exhibitions */}
          <TabsContent value="past" className="space-y-8">
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
          </TabsContent>
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
