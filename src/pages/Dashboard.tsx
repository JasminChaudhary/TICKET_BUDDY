import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Ticket, CalendarDays, User, Info, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

// Interface for a ticket
interface TicketItem {
  ticketId: string;
  name: string;
  price: number;
  quantity: number;
  isExhibition: boolean;
}

// Interface for a booking
interface BookingItem {
  _id: string;
  userId: string;
  visitDate: string;
  tickets: TicketItem[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  useEffect(() => {
    // Load user bookings immediately without checking auth first
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // Debug authentication
        console.log('Auth state:', { user, token: token ? 'Token exists' : 'No token' });
        
        // Check if user is logged in
        if (!user || !token) {
          console.log('Auth check failed - redirecting to login');
          toast({
            title: 'Authentication required',
            description: 'Please login to view your dashboard.',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }
        
        const response = await axios.get('/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(response.data.tickets);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Failed to load bookings',
          description: 'There was an error loading your bookings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        // Set animation state
        setTimeout(() => setLoaded(true), 100);
      }
    };

    fetchBookings();
  }, [user, token, navigate]);

  // Function to group bookings by status
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const visitDate = new Date(booking.visitDate);
      return visitDate >= now && booking.status === 'confirmed';
    });
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const visitDate = new Date(booking.visitDate);
      return visitDate < now && booking.status === 'confirmed';
    });
  };

  const getCancelledBookings = () => {
    return bookings.filter(booking => booking.status === 'cancelled');
  };

  // Function to handle ticket cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      if (!token) {
        toast({
          title: 'Authentication required',
          description: 'Please login to cancel tickets.',
          variant: 'destructive',
        });
        return;
      }

      setIsCancelling(bookingId);
      
      const response = await axios.put(`/api/tickets/${bookingId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state to reflect the cancellation
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' as const } 
            : booking
        )
      );
      
      toast({
        title: 'Success',
        description: 'Your ticket has been successfully cancelled.',
      });
    } catch (error: any) {
      console.error('Error cancelling ticket:', error);
      toast({
        title: 'Failed to cancel ticket',
        description: error.response?.data?.message || 'There was an error cancelling your ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(null);
    }
  };

  return (
    <div className="container max-w-6xl py-20">
      <div className="space-y-8">
        {/* Page Title with Welcome */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
            Welcome, {user?.name}
          </h1>
          <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
            View and manage your museum tickets and bookings.
          </p>
        </div>

        {/* User Info */}
        <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic", loaded && "animate-scale-in")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-accent-700 dark:text-accent-400" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
                <h3 className="font-medium text-museum-900 dark:text-white mb-1">Name</h3>
                <p className="text-museum-700 dark:text-museum-300">{user?.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
                <h3 className="font-medium text-museum-900 dark:text-white mb-1">Email</h3>
                <p className="text-museum-700 dark:text-museum-300">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Section */}
        <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic", loaded && "animate-scale-in")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-accent-700 dark:text-accent-400" />
              Your Bookings
            </CardTitle>
            <CardDescription>View and manage your museum visit tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6 bg-museum-100 dark:bg-museum-800">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Past Visits
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-accent-700 data-[state=active]:text-white">
                  Cancelled
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Bookings */}
              <TabsContent value="upcoming">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : getUpcomingBookings().length > 0 ? (
                  <div className="space-y-4">
                    {getUpcomingBookings().map((booking) => (
                      <div 
                        key={booking._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarDays className="h-5 w-5 text-accent-700 dark:text-accent-400" />
                              <h3 className="font-medium text-museum-900 dark:text-white">
                                Visit on {format(new Date(booking.visitDate), 'EEEE, MMMM d, yyyy')}
                              </h3>
                            </div>
                            <p className="text-sm text-museum-500 dark:text-museum-400">
                              Booked on {format(new Date(booking.createdAt), 'PP')}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              Confirmed
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium text-museum-900 dark:text-white mb-2">Tickets:</h4>
                          <div className="space-y-2">
                            {booking.tickets.map((ticket, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-museum-700 dark:text-museum-300">
                                  {ticket.name} {ticket.isExhibition && '(Exhibition)'} x {ticket.quantity}
                                </span>
                                <span className="font-medium text-museum-900 dark:text-white">
                                  ${(ticket.price * ticket.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-museum-200 dark:border-museum-700">
                          <div className="font-medium">
                            <span className="text-museum-700 dark:text-museum-300 mr-2">Total:</span>
                            <span className="text-museum-900 dark:text-white">${booking.totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Info className="h-3 w-3 mr-1" /> View Details
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={isCancelling === booking._id}
                            >
                              {isCancelling === booking._id ? (
                                <>
                                  <span className="animate-spin mr-1">⏳</span> Cancelling...
                                </>
                              ) : (
                                <>Cancel Booking</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-museum-900 dark:text-white mb-2">No Upcoming Visits</h3>
                    <p className="text-museum-600 dark:text-museum-400 mb-6">
                      You don't have any upcoming visits scheduled. Book a ticket to get started!
                    </p>
                    <Button 
                      onClick={() => navigate('/tickets')}
                      className="bg-accent-700 hover:bg-accent-800 text-white"
                    >
                      Book Tickets <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Past Bookings */}
              <TabsContent value="past">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : getPastBookings().length > 0 ? (
                  <div className="space-y-4">
                    {getPastBookings().map((booking) => (
                      <div 
                        key={booking._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarDays className="h-5 w-5 text-museum-500 dark:text-museum-400" />
                              <h3 className="font-medium text-museum-900 dark:text-white">
                                Visit on {format(new Date(booking.visitDate), 'EEEE, MMMM d, yyyy')}
                              </h3>
                            </div>
                            <p className="text-sm text-museum-500 dark:text-museum-400">
                              Booked on {format(new Date(booking.createdAt), 'PP')}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 rounded-full bg-museum-200 dark:bg-museum-700 text-museum-700 dark:text-museum-300 text-xs font-medium">
                              Completed
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium text-museum-900 dark:text-white mb-2">Tickets:</h4>
                          <div className="space-y-2">
                            {booking.tickets.map((ticket, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-museum-700 dark:text-museum-300">
                                  {ticket.name} {ticket.isExhibition && '(Exhibition)'} x {ticket.quantity}
                                </span>
                                <span className="font-medium text-museum-900 dark:text-white">
                                  ${(ticket.price * ticket.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-museum-200 dark:border-museum-700">
                          <div className="font-medium">
                            <span className="text-museum-700 dark:text-museum-300 mr-2">Total:</span>
                            <span className="text-museum-900 dark:text-white">${booking.totalPrice.toFixed(2)}</span>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Info className="h-3 w-3 mr-1" /> View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-museum-900 dark:text-white mb-2">No Past Visits</h3>
                    <p className="text-museum-600 dark:text-museum-400 mb-6">
                      You don't have any past visits to the museum.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Cancelled Bookings */}
              <TabsContent value="cancelled">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : getCancelledBookings().length > 0 ? (
                  <div className="space-y-4">
                    {getCancelledBookings().map((booking) => (
                      <div 
                        key={booking._id}
                        className="p-6 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarDays className="h-5 w-5 text-museum-500 dark:text-museum-400" />
                              <h3 className="font-medium text-museum-900 dark:text-white line-through">
                                Visit on {format(new Date(booking.visitDate), 'EEEE, MMMM d, yyyy')}
                              </h3>
                            </div>
                            <p className="text-sm text-museum-500 dark:text-museum-400">
                              Booked on {format(new Date(booking.createdAt), 'PP')}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                              Cancelled
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium text-museum-900 dark:text-white mb-2">Tickets:</h4>
                          <div className="space-y-2">
                            {booking.tickets.map((ticket, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-museum-700 dark:text-museum-300">
                                  {ticket.name} {ticket.isExhibition && '(Exhibition)'} x {ticket.quantity}
                                </span>
                                <span className="font-medium text-museum-900 dark:text-white">
                                  ${(ticket.price * ticket.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-museum-200 dark:border-museum-700">
                          <div className="font-medium">
                            <span className="text-museum-700 dark:text-museum-300 mr-2">Total:</span>
                            <span className="text-museum-900 dark:text-white">${booking.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-museum-900 dark:text-white mb-2">No Cancelled Bookings</h3>
                    <p className="text-museum-600 dark:text-museum-400">
                      You don't have any cancelled bookings.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Book New Tickets CTA */}
        <div className={cn(
          "mt-8 p-8 bg-museum-50 dark:bg-museum-800 rounded-xl border border-museum-100 dark:border-museum-700 text-center",
          loaded && "animate-fade-in"
        )}>
          <h3 className="text-xl font-medium text-museum-900 dark:text-white mb-4">Ready for Your Next Visit?</h3>
          <p className="text-museum-600 dark:text-museum-400 mb-6 max-w-2xl mx-auto">
            Explore our current exhibitions and secure your tickets for your next museum adventure.
          </p>
          <Button 
            onClick={() => navigate('/tickets')} 
            className="bg-accent-700 hover:bg-accent-800 text-white"
          >
            Book New Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 