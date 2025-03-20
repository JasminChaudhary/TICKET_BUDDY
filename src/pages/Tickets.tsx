import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const Tickets: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { ticketTypes, selectedTickets, setSelectedTickets, selectedDate, setSelectedDate, totalPrice } = useChatbot();
  
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Set animation loaded state
    setLoaded(true);
    
    // If no date is selected, set it to today
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate, setSelectedDate]);
  
  // Update ticket quantities
  const updateTicketQuantity = (ticketId: string, amount: number) => {
    setSelectedTickets({
      ...selectedTickets,
      [ticketId]: Math.max(0, (selectedTickets[ticketId] || 0) + amount),
    });
  };
  
  // Format date for display
  const formattedDate = selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  // Check if at least one ticket is selected
  const hasTickets = Object.values(selectedTickets).some(quantity => quantity > 0);
  
  // Proceed to checkout
  const proceedToCheckout = () => {
    if (!hasTickets) {
      toast({
        title: 'No tickets selected',
        description: 'Please select at least one ticket to proceed.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: 'No date selected',
        description: 'Please select a visit date to proceed.',
        variant: 'destructive',
      });
      return;
    }
    
    navigate('/summary');
  };
  
  return (
    <div className="container max-w-5xl py-20">
      <div className="space-y-8">
        {/* Page Title */}
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
            {t('tickets.title')}
          </h1>
          <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
            Select your preferred date and ticket types to continue.
          </p>
        </div>
        
        {/* Date Selection */}
        <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic", loaded && "animate-scale-in")}>
          <CardHeader>
            <CardTitle>{t('tickets.date')}</CardTitle>
            <CardDescription>Choose the date of your visit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => setSelectedDate(date)}
                      initialFocus
                      disabled={(date) => {
                        // Disable past dates and Mondays (when museum is closed)
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 1; // 1 is Monday
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                {selectedDate && (
                  <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
                    <h3 className="font-medium text-museum-900 dark:text-white mb-2">Selected Visit Day</h3>
                    <p className="text-museum-700 dark:text-museum-300 mb-1">{formattedDate}</p>
                    <p className="text-sm text-museum-500 dark:text-museum-400">
                      Opening hours: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Ticket Selection */}
        <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic", loaded && "animate-scale-in")}>
          <CardHeader>
            <CardTitle>{t('tickets.type')}</CardTitle>
            <CardDescription>Choose the types and quantity of tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* General Admission Tickets */}
              <div>
                <h3 className="text-lg font-medium text-museum-900 dark:text-white mb-4">General Admission</h3>
                <div className="space-y-4">
                  {ticketTypes.filter(ticket => !ticket.isExhibition).map((ticket) => (
                    <div 
                      key={ticket.id}
                      className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-museum-900 dark:text-white">
                            {t(`tickets.${ticket.id}`)}
                          </h3>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4 text-museum-500 dark:text-museum-400" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">{ticket.description}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <p className="text-sm text-museum-500 dark:text-museum-400">
                          ${ticket.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                          disabled={(selectedTickets[ticket.id] || 0) === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium text-museum-900 dark:text-white">
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exhibition Tickets */}
              <div>
                <h3 className="text-lg font-medium text-museum-900 dark:text-white mb-4">Special Exhibitions</h3>
                <div className="space-y-4">
                  {ticketTypes.filter(ticket => ticket.isExhibition).map((ticket) => (
                    <div 
                      key={ticket.id}
                      className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-museum-900 dark:text-white">
                            {ticket.name}
                          </h3>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4 text-museum-500 dark:text-museum-400" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">{ticket.description}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <p className="text-sm text-museum-500 dark:text-museum-400">
                          ${ticket.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                          disabled={(selectedTickets[ticket.id] || 0) === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium text-museum-900 dark:text-white">
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Summary */}
        <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic", loaded && "animate-scale-in")}>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selected Date */}
              {selectedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-museum-700 dark:text-museum-300">Date:</span>
                  <span className="font-medium text-museum-900 dark:text-white">{format(selectedDate, 'PP')}</span>
                </div>
              )}
              
              {/* Ticket Summary */}
              {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                if (quantity === 0) return null;
                
                const ticket = ticketTypes.find(t => t.id === ticketId);
                if (!ticket) return null;
                
                return (
                  <div key={ticketId} className="flex justify-between items-center">
                    <span className="text-museum-700 dark:text-museum-300">
                      {t(`tickets.${ticketId}`)} x {quantity}:
                    </span>
                    <span className="font-medium text-museum-900 dark:text-white">
                      ${(ticket.price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              
              {/* No tickets selected message */}
              {!hasTickets && (
                <div className="text-center py-4 text-museum-500 dark:text-museum-400">
                  No tickets selected yet. Please select at least one ticket to proceed.
                </div>
              )}
              
              <Separator className="my-2" />
              
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-medium text-museum-900 dark:text-white">Total:</span>
                <span className="font-bold text-lg text-museum-900 dark:text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-accent-700 hover:bg-accent-800 text-white"
              onClick={proceedToCheckout}
              disabled={!hasTickets || !selectedDate}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('tickets.checkout')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Tickets;
