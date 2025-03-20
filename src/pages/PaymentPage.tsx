import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbot } from '@/contexts/ChatbotContext';
import { usePayment } from '@/contexts/PaymentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PaymentPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedDate, selectedTickets, ticketTypes, totalPrice } = useChatbot();
  const { paymentInfo, setPaymentInfo, paymentStatus, processPayment, paymentError } = usePayment();
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Animation timing
    setIsLoaded(true);
    
    // Check if ticket data exists
    if (!selectedDate || Object.values(selectedTickets).every(qty => qty === 0)) {
      toast({
        title: 'No tickets selected',
        description: 'Please select tickets before proceeding to payment.',
        variant: 'destructive',
      });
      navigate('/tickets');
    }
  }, [selectedDate, selectedTickets, navigate]);
  
  // Format card number with spaces for readability
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setPaymentInfo({ ...paymentInfo, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setPaymentInfo({ ...paymentInfo, [name]: formatExpiryDate(value) });
    } else {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
  };
  
  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    processPayment();
  };
  
  // Navigate back to summary
  const goBackToSummary = () => {
    navigate('/summary');
  };
  
  if (!selectedDate) return null;
  
  return (
    <div className="container max-w-3xl py-20">
      {/* Page Title */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-museum-900 dark:text-white mb-4">
          {t('payment.title')}
        </h1>
        <p className="text-museum-600 dark:text-museum-300 max-w-2xl mx-auto">
          Please enter your payment information to complete your purchase.
        </p>
      </div>
      
      {/* Payment Card */}
      <Card className={cn("border-museum-200 dark:border-museum-700 neomorphic overflow-hidden", isLoaded && "animate-scale-in")}>
        <div className="bg-accent-700 py-3 px-6">
          <h2 className="text-white font-medium">Secure Checkout</h2>
        </div>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 rounded-lg bg-museum-50 dark:bg-museum-800 border border-museum-100 dark:border-museum-700">
              <h3 className="font-medium text-museum-900 dark:text-white mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Date:</span>
                  <span className="font-medium text-museum-900 dark:text-white">{format(selectedDate, 'PP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-museum-600 dark:text-museum-400">Tickets:</span>
                  <span className="font-medium text-museum-900 dark:text-white">
                    {Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-museum-900 dark:text-white">Total:</span>
                  <span className="text-accent-800 dark:text-accent-400">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            {paymentStatus === 'success' ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-museum-900 dark:text-white">
                  {t('payment.success')}
                </h3>
                <p className="text-museum-600 dark:text-museum-400">
                  Your tickets have been booked successfully. A confirmation email with your tickets has been sent to <span className="font-medium">{paymentInfo.email}</span>.
                </p>
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-accent-700 hover:bg-accent-800 text-white"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-museum-900 dark:text-white">Card Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">{t('payment.cardNumber')}</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className="pl-10"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-museum-500 dark:text-museum-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{t('payment.expiry')}</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">{t('payment.cvc')}</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={paymentInfo.cvc}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">{t('payment.name')}</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={paymentInfo.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-museum-900 dark:text-white">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('payment.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={paymentInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-sm text-museum-500 dark:text-museum-400 italic">
                      Your tickets will be sent to this email address after purchase.
                    </p>
                  </div>
                </div>
                
                {/* Payment Error */}
                {paymentError && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {paymentError}
                  </div>
                )}
                
                {/* Secure Payment Notice */}
                <div className="flex items-center gap-2 text-sm text-museum-500 dark:text-museum-400">
                  <Lock className="h-4 w-4" />
                  <span>All payments are secure and encrypted.</span>
                </div>
                
                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={goBackToSummary}
                    disabled={paymentStatus === 'processing'}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Summary
                  </Button>
                  <Button 
                    type="submit"
                    className="w-full sm:w-auto bg-accent-700 hover:bg-accent-800 text-white"
                    disabled={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'processing' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {t('payment.pay')} (${totalPrice.toFixed(2)})
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
