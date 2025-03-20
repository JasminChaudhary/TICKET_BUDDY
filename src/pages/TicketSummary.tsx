import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbot } from '@/contexts/ChatbotContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TicketSummary: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedDate, selectedTickets, ticketTypes, totalPrice } = useChatbot();
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Animation timing
    setIsLoaded(true);
    
    // Check if ticket data exists
    if (!selectedDate || Object.values(selectedTickets).every(qty => qty === 0)) {
      toast({
        title: 'No tickets selected',
        description: 'Please select tickets before viewing the summary.',
        variant: 'destructive',
      });
      navigate('/tickets');
      return;
    }
    
    // Check if at least one age category ticket is selected
    const hasAgeCategoryTicket = ticketTypes
      .filter(ticket => !ticket.isExhibition)
      .some(ticket => (selectedTickets[ticket.id] || 0) > 0);
    
    // Check if at least one exhibition ticket is selected
    const hasExhibitionTicket = ticketTypes
      .filter(ticket => ticket.isExhibition)
      .some(ticket => (selectedTickets[ticket.id] || 0) > 0);
    
    if (!hasAgeCategoryTicket || !hasExhibitionTicket) {
      toast({
        title: 'Invalid ticket selection',
        description: 'Please select at least one general admission ticket AND one exhibition ticket.',
        variant: 'destructive',
      });
      navigate('/tickets');
    }
  }, [selectedDate, selectedTickets, ticketTypes, navigate]);
  
  // Format date for display
  const formattedDate = selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  // Total ticket count
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  
  // Check if tickets are selected
  const hasTickets = Object.values(selectedTickets).some(qty => qty > 0);
  
  // Navigate to payment page
  const proceedToPayment = () => {
    navigate('/payment');
  };
  
  // Navigate back to tickets page
  const goBackToTickets = () => {
    navigate('/tickets');
  };
  
  if (!hasTickets || !selectedDate) return null;
  
  return (
    <div className="container max-w-3xl py-20">
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
          Ticket Summary
        </h1>
        <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
          Please review your ticket selection before proceeding to payment.
        </p>
      </div>
      
      {/* Summary Card */}
      <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic overflow-hidden", isLoaded && "animate-scale-in")}>
        <div className="bg-accent-700 py-3 px-6">
          <h2 className="text-white font-medium">Order Summary</h2>
        </div>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Visit Information */}
            <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
              <h3 className="font-medium text-museum-900 dark:text-white mb-3">Visit Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Date:</span>
                  <span className="font-medium text-museum-900 dark:text-white">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Opening Hours:</span>
                  <span className="font-medium text-museum-900 dark:text-white">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Last Entry:</span>
                  <span className="font-medium text-museum-900 dark:text-white">5:00 PM</span>
                </div>
              </div>
            </div>
            
            {/* Ticket Details */}
            <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
              <h3 className="font-medium text-museum-900 dark:text-white mb-3">Ticket Details</h3>
              <div className="space-y-2">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  if (quantity === 0) return null;
                  
                  const ticket = ticketTypes.find(t => t.id === ticketId);
                  if (!ticket) return null;
                  
                  return (
                    <div key={ticketId} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-accent-700 dark:text-accent-400 mr-2" />
                        <span className="text-museum-700 dark:text-museum-300">
                          {t(`tickets.${ticketId}`)} x {quantity}:
                        </span>
                      </div>
                      <span className="font-medium text-museum-900 dark:text-white">
                        ${(ticket.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-museum-200 dark:border-museum-700 mt-3 pt-3 flex justify-between">
                  <span className="font-medium text-museum-900 dark:text-white">Total Tickets:</span>
                  <span className="font-medium text-museum-900 dark:text-white">{totalTickets}</span>
                </div>
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
              <h3 className="font-medium text-museum-900 dark:text-white mb-3">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Subtotal:</span>
                  <span className="font-medium text-museum-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Tax:</span>
                  <span className="font-medium text-museum-900 dark:text-white">$0.00</span>
                </div>
                <div className="border-t border-museum-200 dark:border-museum-700 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-museum-900 dark:text-white">Total:</span>
                  <span className="font-bold text-lg text-accent-800 dark:text-accent-400">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Important Information */}
            <div className="text-sm text-museum-600 dark:text-museum-400 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <p className="mb-2">
                <strong>Important:</strong> Please arrive at least 15 minutes before your intended entry time.
              </p>
              <p>
                You will receive a confirmation email upon successful payment. Please show this email at the entrance.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={goBackToTickets}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
          <Button 
            onClick={proceedToPayment}
            className="w-full sm:w-auto bg-accent-700 hover:bg-accent-800 text-white"
          >
            Continue to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketSummary;
