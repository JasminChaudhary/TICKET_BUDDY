
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Users, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Exhibition data
  const exhibitions = [
    {
      id: 'modern-masters',
      title: 'Modern Masterpieces',
      date: 'Current - August 30, 2023',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080',
    },
    {
      id: 'ancient-civilizations',
      title: 'Ancient Civilizations',
      date: 'Current - October 15, 2023',
      image: 'https://images.unsplash.com/photo-1564399579883-451a5cb0507e?q=80&w=2071',
    },
    {
      id: 'natural-wonders',
      title: 'Natural Wonders',
      date: 'Current - September 20, 2023',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2069',
    },
  ];
  
  return (
    <div className="relative w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1566054757965-8c4085344c96?q=80&w=2073"
            alt="Museum interior"
            className={cn(
              "w-full h-full object-cover object-center transition-all duration-1000",
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            )}
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in">
          <h1 
            className={cn(
              "font-display text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight",
              loaded && "animate-text-focus-in"
            )}
          >
            {t('home.welcome')}
          </h1>
          <p 
            className={cn(
              "text-xl md:text-2xl text-white/90 mb-8",
              loaded && "animate-fade-in"
            )}
            style={{ animationDelay: '300ms' }}
          >
            {t('home.subtitle')}
          </p>
          <div 
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-4",
              loaded && "animate-fade-in"
            )}
            style={{ animationDelay: '600ms' }}
          >
            <Link to="/tickets">
              <Button size="lg" className="bg-accent-700 hover:bg-accent-800 text-white min-w-40">
                {t('home.getTickets')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/exhibitions">
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 min-w-40">
                {t('home.exploreExhibitions')}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className={cn(
            "absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center",
            scrolled ? "opacity-0" : "opacity-100",
            loaded && "animate-fade-in"
          )}
          style={{ animationDelay: '900ms', transition: 'opacity 300ms ease-out' }}
        >
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-float" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-museum-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-museum-900 dark:text-white mb-4">
              Experience Art Like Never Before
            </h2>
            <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
              Our museum offers a unique blend of historical artifacts and contemporary art pieces in an immersive environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-museum-50 dark:bg-museum-900 border border-museum-100 dark:border-museum-800 transition-all duration-300 hover-scale">
              <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-2">
                Special Exhibitions
              </h3>
              <p className="text-museum-600 dark:text-museum-400 text-sm">
                Experience our rotating exhibitions featuring renowned artists and historical artifacts from around the world.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-museum-50 dark:bg-museum-900 border border-museum-100 dark:border-museum-800 transition-all duration-300 hover-scale">
              <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-2">
                Guided Tours
              </h3>
              <p className="text-museum-600 dark:text-museum-400 text-sm">
                Join our expert guides for insightful tours that bring history and art to life through storytelling.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-museum-50 dark:bg-museum-900 border border-museum-100 dark:border-museum-800 transition-all duration-300 hover-scale">
              <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-2">
                Extended Hours
              </h3>
              <p className="text-museum-600 dark:text-museum-400 text-sm">
                Enjoy our extended weekend hours, allowing more time to immerse yourself in culture and art.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-museum-50 dark:bg-museum-900 border border-museum-100 dark:border-museum-800 transition-all duration-300 hover-scale">
              <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-2">
                Interactive Displays
              </h3>
              <p className="text-museum-600 dark:text-museum-400 text-sm">
                Engage with our interactive exhibits that make learning fun for visitors of all ages.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Current Exhibitions Section */}
      <section className="py-20 px-4 bg-museum-50 dark:bg-museum-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-museum-900 dark:text-white mb-4">
              Current Exhibitions
            </h2>
            <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
              Explore our current exhibitions, each carefully curated to inspire, educate, and captivate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exhibitions.map((exhibition, index) => (
              <div 
                key={exhibition.id} 
                className="group rounded-2xl overflow-hidden border border-museum-200 dark:border-museum-700 bg-white dark:bg-museum-800 transition-all duration-300 hover-scale"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={exhibition.image} 
                    alt={exhibition.title} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-2">
                    {exhibition.title}
                  </h3>
                  <p className="text-museum-500 dark:text-museum-400 text-sm mb-4">
                    {exhibition.date}
                  </p>
                  <Link to="/exhibitions">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/exhibitions">
              <Button size="lg" className="bg-accent-700 hover:bg-accent-800 text-white">
                View All Exhibitions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent-800 to-accent-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Start Your Museum Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Book your tickets now and embark on a cultural adventure. Our museum offers a seamless booking experience with our virtual assistant always ready to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tickets">
              <Button size="lg" className="bg-white text-accent-900 hover:bg-white/90 min-w-40">
                Book Tickets Now
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 hover:bg-white/10 min-w-40"
              onClick={() => document.querySelector('.fixed button')?.dispatchEvent(new MouseEvent('click'))}
            >
              Chat with Assistant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
