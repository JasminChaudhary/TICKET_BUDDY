
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Landmark, 
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const About: React.FC = () => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  // FAQ data
  const faqs = [
    {
      question: 'What are your opening hours?',
      answer: 'Our museum is open Tuesday to Sunday from 10:00 AM to 6:00 PM. We are closed on Mondays and major holidays. Last admission is at 5:00 PM.',
    },
    {
      question: 'How much do tickets cost?',
      answer: 'Adult tickets are $20, Seniors (65+) are $15, Students are $12, and Children (6-17) are $10. Children under 6 are free. We also offer family passes for $50 (2 adults and up to 3 children).',
    },
    {
      question: 'Do you offer guided tours?',
      answer: 'Yes, we offer guided tours at 11:00 AM, 1:00 PM, and 3:00 PM daily. Tours last approximately 90 minutes and are included with your admission. Audio guides are also available in multiple languages for a small fee.',
    },
    {
      question: 'Is the museum accessible for visitors with disabilities?',
      answer: 'Yes, our museum is fully accessible for visitors with disabilities. We offer wheelchair ramps, elevators, accessible restrooms, and assistive listening devices. Service animals are welcome.',
    },
    {
      question: 'What facilities do you have?',
      answer: 'Our museum features a café, gift shop, coat check, free Wi-Fi, and restrooms on every floor. All facilities are accessible for visitors with disabilities.',
    },
    {
      question: 'Can I take photographs in the museum?',
      answer: 'Photography for personal use is permitted in most permanent collection galleries, but flash photography, tripods, and selfie sticks are not allowed. Photography is not permitted in some special exhibitions or where specifically prohibited.',
    },
    {
      question: 'Do you offer membership?',
      answer: 'Yes, we offer annual memberships starting at $75 for individuals. Members enjoy unlimited free admission, special exhibition discounts, invitations to exclusive events, and discounts at our café and gift shop.',
    },
    {
      question: 'Can I book tickets online?',
      answer: 'Yes, you can book tickets online through our website or via our chatbot assistant. Online booking is recommended to avoid queues, especially during peak times and for special exhibitions.',
    },
  ];
  
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Museum Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
      description: 'Art historian with over 20 years of experience in museum curation and management.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Chief Curator',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048',
      description: 'Specialist in modern and contemporary art with a focus on intercultural dialogues.',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Education Director',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974',
      description: 'Develops innovative educational programs to engage visitors of all ages.',
    },
    {
      id: 4,
      name: 'David Williams',
      role: 'Technology Director',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
      description: 'Leads digital initiatives to enhance visitor experience and engagement.',
    },
  ];
  
  return (
    <div className="container max-w-6xl py-20">
      <div className="space-y-12">
        {/* Page Title */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
            About Our Museum
          </h1>
          <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
            Discover our story, mission, and the team that brings art and culture to life.
          </p>
        </div>
        
        {/* Museum Info Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-museum-100 dark:bg-museum-800">
              <TabsTrigger value="about" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                About Us
              </TabsTrigger>
              <TabsTrigger value="visit" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                Visit
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                Our Team
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* About Us */}
          <TabsContent value="about" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className={cn("space-y-6", loaded && "animate-fade-in")}>
                <div>
                  <h2 className="text-2xl font-display font-bold text-museum-900 dark:text-white mb-4">Our Story</h2>
                  <p className="text-museum-600 dark:text-museum-300 mb-4">
                    Founded in 1975, our museum has grown from a small gallery to a world-renowned cultural institution. For over four decades, we've been dedicated to collecting, preserving, and exhibiting significant works of art and cultural artifacts from around the world.
                  </p>
                  <p className="text-museum-600 dark:text-museum-300">
                    Our collection spans thousands of years, from ancient civilizations to contemporary expressions, reflecting the diversity and richness of human creativity and cultural heritage.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-display font-bold text-museum-900 dark:text-white mb-4">Our Mission</h2>
                  <p className="text-museum-600 dark:text-museum-300">
                    We are committed to making art and culture accessible to all, fostering understanding and appreciation across different cultures and time periods. Through our exhibitions, educational programs, and community outreach, we strive to inspire curiosity, creativity, and lifelong learning.
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className={cn("space-y-6", loaded && "animate-fade-in")}>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1566054757965-8c4085344c96?q=80&w=2073" 
                    alt="Museum interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 flex flex-col items-center text-center">
                    <Landmark className="h-8 w-8 text-accent-700 dark:text-accent-400 mb-3" />
                    <h3 className="font-medium text-museum-900 dark:text-white mb-1">Established</h3>
                    <p className="text-museum-600 dark:text-museum-400 text-sm">1975</p>
                  </div>
                  
                  <div className="p-5 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 flex flex-col items-center text-center">
                    <BookOpen className="h-8 w-8 text-accent-700 dark:text-accent-400 mb-3" />
                    <h3 className="font-medium text-museum-900 dark:text-white mb-1">Collection</h3>
                    <p className="text-museum-600 dark:text-museum-400 text-sm">25,000+ Items</p>
                  </div>
                  
                  <div className="p-5 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-accent-700 dark:text-accent-400 mb-3" />
                    <h3 className="font-medium text-museum-900 dark:text-white mb-1">Annual Visitors</h3>
                    <p className="text-museum-600 dark:text-museum-400 text-sm">500,000+</p>
                  </div>
                  
                  <div className="p-5 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 flex flex-col items-center text-center">
                    <Award className="h-8 w-8 text-accent-700 dark:text-accent-400 mb-3" />
                    <h3 className="font-medium text-museum-900 dark:text-white mb-1">Awards</h3>
                    <p className="text-museum-600 dark:text-museum-400 text-sm">15 National</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className={cn(
              "mt-10 p-8 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-100 dark:border-accent-800 text-center",
              loaded && "animate-fade-in"
            )}>
              <h3 className="text-xl font-display font-bold text-museum-900 dark:text-white mb-4">
                Join Us in Our Journey
              </h3>
              <p className="text-museum-600 dark:text-museum-300 mb-6 max-w-2xl mx-auto">
                Support our mission by becoming a member, volunteering, or making a donation. Your contribution helps us continue to provide exceptional art experiences and educational programs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/tickets">
                  <Button className="bg-accent-700 hover:bg-accent-800 text-white min-w-40">
                    Book a Visit
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          {/* Visit Info */}
          <TabsContent value="visit" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hours and Admission */}
              <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-accent-700 dark:text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">Opening Hours</h3>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Monday</dt>
                            <dd className="text-museum-900 dark:text-white">Closed</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Tuesday - Friday</dt>
                            <dd className="text-museum-900 dark:text-white">10:00 - 18:00</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Saturday - Sunday</dt>
                            <dd className="text-museum-900 dark:text-white">09:00 - 20:00</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Public Holidays</dt>
                            <dd className="text-museum-900 dark:text-white">10:00 - 16:00</dd>
                          </div>
                        </dl>
                        <p className="mt-3 text-xs text-museum-500 dark:text-museum-400">
                          Last admission is 1 hour before closing.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">Admission Prices</h3>
                      <dl className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Adult</dt>
                          <dd className="text-museum-900 dark:text-white">$20.00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Senior (65+)</dt>
                          <dd className="text-museum-900 dark:text-white">$15.00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Student (with ID)</dt>
                          <dd className="text-museum-900 dark:text-white">$12.00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Child (6-17)</dt>
                          <dd className="text-museum-900 dark:text-white">$10.00</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Child (under 6)</dt>
                          <dd className="text-museum-900 dark:text-white">Free</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-museum-600 dark:text-museum-400">Family Pass</dt>
                          <dd className="text-museum-900 dark:text-white">$50.00</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs text-museum-500 dark:text-museum-400">
                        Family Pass includes 2 adults and up to 3 children.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Location and Contact */}
              <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-accent-700 dark:text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">Location</h3>
                        <p className="text-museum-600 dark:text-museum-300 text-sm">
                          123 Art Avenue, Cultural District,<br />
                          City, Country, 12345
                        </p>
                        <p className="mt-3 text-sm text-museum-600 dark:text-museum-300">
                          Our museum is located in the heart of the Cultural District, easily accessible by public transportation.
                        </p>
                        <Button variant="link" className="mt-2 h-auto p-0 text-accent-700 dark:text-accent-400">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-accent-700 dark:text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">Contact</h3>
                        <dl className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">General Inquiries</dt>
                            <dd className="text-museum-900 dark:text-white">+1 (555) 123-4567</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Membership</dt>
                            <dd className="text-museum-900 dark:text-white">+1 (555) 123-4568</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Group Tours</dt>
                            <dd className="text-museum-900 dark:text-white">+1 (555) 123-4569</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-accent-700 dark:text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">Email</h3>
                        <dl className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">General</dt>
                            <dd className="text-museum-900 dark:text-white">info@artmuseo.com</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Events</dt>
                            <dd className="text-museum-900 dark:text-white">events@artmuseo.com</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-museum-600 dark:text-museum-400">Education</dt>
                            <dd className="text-museum-900 dark:text-white">education@artmuseo.com</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Facilities and Accessibility */}
              <Card className={cn("border-museum-200 dark:border-museum-700", loaded && "animate-scale-in")}>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-3">Facilities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <path d="M17 12a5 5 0 0 0-5-5m0 0a5 5 0 0 0-5 5m5-5v5m-5 0h10" />
                          <path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Café</span>
                      </div>
                      
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                          <path d="M3 6h18" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Gift Shop</span>
                      </div>
                      
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m8.5 8.5 7 7" />
                          <path d="m8.5 15.5 7-7" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Coat Check</span>
                      </div>
                      
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                          <line x1="12" y1="20" x2="12" y2="20" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Free Wi-Fi</span>
                      </div>
                      
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Audio Guides</span>
                      </div>
                      
                      <div className="p-3 bg-museum-50 dark:bg-museum-800 rounded-lg border border-museum-100 dark:border-museum-700 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mx-auto mb-2 text-accent-700 dark:text-accent-400">
                          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                          <path d="M18 14h-8" />
                          <path d="M15 18h-5" />
                          <path d="M10 6h8v4h-8V6Z" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Guided Tours</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-3">Accessibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Wheelchair accessible</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Accessible restrooms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Service animals welcome</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Assistive listening devices</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-accent-700 dark:text-accent-400">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span className="text-sm text-museum-700 dark:text-museum-300">Braille and large print materials</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Map and CTA */}
            <div className={cn("mt-6", loaded && "animate-scale-in")}>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1569959220744-ff553533f492?q=80&w=2059" 
                  alt="Museum map" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <Link to="/tickets">
                  <Button size="lg" className="bg-accent-700 hover:bg-accent-800 text-white">
                    Book Your Visit
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          {/* Team Tab */}
          <TabsContent value="team" className="space-y-8">
            <div className={cn("text-center mb-8", loaded && "animate-fade-in")}>
              <h2 className="text-2xl font-display font-bold text-museum-900 dark:text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
                Our dedicated team of professionals works tirelessly to create exceptional experiences for our visitors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className={cn(
                    "rounded-xl overflow-hidden bg-white dark:bg-museum-800 border border-museum-200 dark:border-museum-700 shadow-sm transition-all duration-300 hover-scale",
                    loaded && "animate-scale-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-lg text-museum-900 dark:text-white">{member.name}</h3>
                    <p className="text-accent-700 dark:text-accent-400 text-sm mb-2">{member.role}</p>
                    <p className="text-museum-600 dark:text-museum-400 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={cn(
              "mt-8 p-8 bg-museum-50 dark:bg-museum-800 rounded-xl border border-museum-100 dark:border-museum-700 text-center",
              loaded && "animate-fade-in"
            )}>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-4">Join Our Team</h3>
              <p className="text-museum-600 dark:text-museum-400 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate, creative individuals to join our team. Check out our current openings or submit your resume for future opportunities.
              </p>
              <Button variant="outline" className="border-accent-200 dark:border-accent-800 text-accent-700 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20">
                View Career Opportunities
              </Button>
            </div>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <div className={cn("text-center mb-8", loaded && "animate-fade-in")}>
              <h2 className="text-2xl font-display font-bold text-museum-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
                Find answers to commonly asked questions about visiting our museum.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-5 rounded-lg bg-white dark:bg-museum-800 border border-museum-200 dark:border-museum-700 shadow-sm transition-all duration-300",
                    loaded && "animate-scale-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h3 className="font-medium text-lg text-museum-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-museum-600 dark:text-museum-400 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className={cn(
              "mt-8 p-8 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-100 dark:border-accent-800 text-center",
              loaded && "animate-fade-in"
            )}>
              <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-4">Still Have Questions?</h3>
              <p className="text-museum-600 dark:text-museum-400 mb-6 max-w-2xl mx-auto">
                If you couldn't find the answer to your question, please feel free to contact us directly or chat with our virtual assistant.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="border-accent-200 dark:border-accent-800 text-accent-700 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20"
                >
                  Contact Us
                </Button>
                <Button 
                  className="bg-accent-700 hover:bg-accent-800 text-white"
                  onClick={() => document.querySelector('.fixed button')?.dispatchEvent(new MouseEvent('click'))}
                >
                  Chat with Assistant
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default About;
