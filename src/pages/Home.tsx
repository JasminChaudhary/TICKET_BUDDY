import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Share2, Ticket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

const Home = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
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
            duration: '10:00 AM - 6:00 PM',  // Default hours
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
  
  // Handle share button click
  const handleShare = (exhibition: Exhibition) => {
    navigator.clipboard.writeText(`Check out the "${exhibition.title}" exhibition at our museum! ${window.location.origin}/exhibitions`);
    
    toast({
      title: 'Link Copied!',
      description: 'Exhibition link copied to clipboard.',
    });
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080" 
            alt="Museum Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-8">
          <h1 className="font-display heading-responsive font-bold mb-4 md:mb-6">
            Welcome to Our Museum
          </h1>
          <p className="text-responsive mb-6 md:mb-8 max-w-2xl mx-auto">
            Discover the wonders of art, history, and culture through our diverse exhibitions and collections.
          </p>
          <Link to="/exhibitions">
            <Button size="lg" className="bg-accent-700 hover:bg-accent-800 text-white touch-target">
              Explore Exhibitions
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Current Exhibitions Section */}
      <section className="py-responsive bg-museum-50 dark:bg-museum-900">
        <div className="container-responsive">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display subheading-responsive font-bold text-museum-900 dark:text-white mb-4">
              Current Exhibitions
            </h2>
            <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
              Experience our current exhibitions showcasing diverse perspectives and artistic expressions.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-700"></div>
            </div>
          ) : currentExhibitions.length > 0 ? (
            <div className="card-grid">
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
        </div>
      </section>
      
      {/* Upcoming Exhibitions Section */}
      <section className="py-responsive">
        <div className="container-responsive">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display subheading-responsive font-bold text-museum-900 dark:text-white mb-4">
              Upcoming Exhibitions
            </h2>
            <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
              Get ready for our upcoming exhibitions that will inspire and captivate.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-700"></div>
            </div>
          ) : upcomingExhibitions.length > 0 ? (
            <div className="card-grid">
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
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-responsive bg-museum-50 dark:bg-museum-900">
        <div className="container-responsive">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display subheading-responsive font-bold text-museum-900 dark:text-white mb-4">
              Why Visit Our Museum?
            </h2>
            <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
              Discover what makes our museum a unique destination for art and culture enthusiasts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              title="Diverse Collections"
              description="Explore our extensive collection of art, artifacts, and historical pieces from around the world."
              icon="🎨"
            />
            <FeatureCard
              title="Interactive Exhibits"
              description="Engage with our interactive displays and immersive experiences that bring history to life."
              icon="🖼️"
            />
            <FeatureCard
              title="Expert Guided Tours"
              description="Learn from our knowledgeable guides who provide insights into our collections and exhibitions."
              icon="👥"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-museum-600 dark:text-museum-300 mb-8">
            Plan your visit today and immerse yourself in the world of art and culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tickets">
              <Button size="lg" className="bg-accent-700 hover:bg-accent-800 text-white">
                Get Tickets
              </Button>
            </Link>
            <Link to="/exhibitions">
              <Button size="lg" variant="outline">
                View All Exhibitions
              </Button>
            </Link>
          </div>
        </div>
      </section>
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
  // Staggered animation delay based on index
  const animationDelay = `${index * 100}ms`;
  
  return (
    <Card className={cn(
      "overflow-hidden hover-scale h-full flex flex-col",
      isLoaded ? "opacity-100" : "opacity-0",
    )}
    style={{ transitionDelay: animationDelay }}>
      <div className="relative aspect-[3/2] overflow-hidden">
        <img 
          src={exhibition.image || "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071"} 
          alt={exhibition.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
          <Badge variant="outline" className="bg-white/90 text-foreground text-xs">
            {exhibition.category === 'current' ? 'Now Showing' : 'Opening Soon'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
        <CardTitle className="text-xl sm:text-2xl leading-tight">{exhibition.title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1 sm:mt-2">
          {exhibition.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 pt-0 space-y-2 sm:space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{exhibition.date}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{exhibition.duration}</span>
        </div>
        <div className="font-medium mt-2 sm:mt-3">
          ${exhibition.price.toFixed(2)} per person
        </div>
      </CardContent>
      
      <CardFooter className="p-4 sm:p-5 pt-2 sm:pt-3 flex gap-2 mt-auto">
        <Link to={`/exhibitions`} className="flex-1">
          <Button variant="default" className="w-full">
            <Ticket className="h-4 w-4 mr-2" />
            <span>Details</span>
          </Button>
        </Link>
        <Button variant="outline" size="icon" onClick={() => onShare(exhibition)} className="touch-target">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => (
  <Card className="p-6 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-museum-600 dark:text-museum-300">{description}</p>
  </Card>
);

export default Home;
