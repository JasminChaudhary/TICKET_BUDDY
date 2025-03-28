import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useChatbot } from './ChatbotContext';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Payment status type
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

// Payment info interface
export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
  email: string;
}

// Context type
interface PaymentContextType {
  paymentInfo: PaymentInfo;
  setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  paymentStatus: PaymentStatus;
  processPayment: () => Promise<void>;
  resetPayment: () => void;
  paymentError: string | null;
  processRazorpayPayment: () => void;
}

// Create context
const PaymentContext = createContext<PaymentContextType>({
  paymentInfo: {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
    email: '',
  },
  setPaymentInfo: () => {},
  paymentStatus: 'idle',
  processPayment: async () => {},
  resetPayment: () => {},
  paymentError: null,
  processRazorpayPayment: () => {},
});

// PaymentProvider component
export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
    email: '',
  });
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { selectedDate, selectedTickets, ticketTypes, totalPrice } = useChatbot();
  const { token } = useAuth();

  // Process payment with Razorpay
  const processRazorpayPayment = () => {
    // Reset error state
    setPaymentError(null);
    
    // Validate email
    if (!paymentInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentInfo.email)) {
      setPaymentError('Please enter a valid email address.');
      return;
    }
    
    // Set status to processing
    setPaymentStatus('processing');
    
    // Create a new Razorpay instance
    const razorpay = new window.Razorpay({
      key: 'rzp_test_QkXkFcvEgnX67b', // Replace with your Razorpay key ID
      amount: totalPrice * 100, // Amount is in currency subunits (100 = 1 unit)
      currency: 'USD',
      name: 'Museum Tickets',
      description: 'Museum Ticket Purchase',
      image: '/logo.png',
      handler: function(response: any) {
        // Handle the success payment
        handlePaymentSuccess(response);
      },
      prefill: {
        email: paymentInfo.email,
        contact: '', // Optional
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function() {
          // Handle case when user closes the Razorpay modal
          setPaymentStatus('idle');
        }
      }
    });
    
    // Open Razorpay payment form
    razorpay.open();
  };
  
  // Handle successful payment from Razorpay
  const handlePaymentSuccess = async (response: any) => {
    try {
      if (token && selectedDate) {
        // Format tickets for the API
        const ticketsToBook = Object.entries(selectedTickets)
          .filter(([_, quantity]) => quantity > 0)
          .map(([ticketId, quantity]) => {
            const ticket = ticketTypes.find(t => t.id === ticketId);
            return {
              ticketId,
              name: ticket?.name || ticketId,
              price: ticket?.price || 0,
              quantity,
              isExhibition: ticket?.isExhibition || false
            };
          });

        // Book tickets via API with Razorpay payment ID
        await axios.post('/api/tickets', {
          visitDate: selectedDate.toISOString(),
          tickets: ticketsToBook,
          totalPrice,
          email: paymentInfo.email,
          paymentId: response.razorpay_payment_id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPaymentStatus('success');
        toast({
          title: 'Payment Successful!',
          description: 'Your tickets have been booked successfully and sent to your email.',
        });
        
        // Reset form and navigate to dashboard after a delay
        setTimeout(() => {
          resetPayment();
          navigate('/dashboard');
        }, 2000);
      } else {
        setPaymentStatus('success');
        toast({
          title: 'Payment Successful!',
          description: 'Your tickets have been booked successfully.',
        });
        
        // Reset form and navigate to home after a delay
        setTimeout(() => {
          resetPayment();
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error booking tickets:', error);
      setPaymentStatus('error');
      setPaymentError('Payment was processed but there was an issue booking your tickets.');
      
      toast({
        title: 'Booking Error',
        description: 'There was an issue booking your tickets. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  // Legacy payment processing method (keeping for backward compatibility)
  const processPayment = async () => {
    // Reset error state
    setPaymentError(null);
    
    // Validate payment info
    if (!validatePaymentInfo()) {
      setPaymentError('Please fill in all payment details correctly.');
      return;
    }
    
    // Set status to processing
    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random success (90% chance of success)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        // Payment successful - book tickets
        if (token && selectedDate) {
          try {
            // Format tickets for the API
            const ticketsToBook = Object.entries(selectedTickets)
              .filter(([_, quantity]) => quantity > 0)
              .map(([ticketId, quantity]) => {
                const ticket = ticketTypes.find(t => t.id === ticketId);
                return {
                  ticketId,
                  name: ticket?.name || ticketId,
                  price: ticket?.price || 0,
                  quantity,
                  isExhibition: ticket?.isExhibition || false
                };
              });

            // Book tickets via API
            await axios.post('/api/tickets', {
              visitDate: selectedDate.toISOString(),
              tickets: ticketsToBook,
              totalPrice,
              email: paymentInfo.email
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            setPaymentStatus('success');
            toast({
              title: 'Payment Successful!',
              description: 'Your tickets have been booked successfully and sent to your email.',
            });
            
            // Reset form and navigate to dashboard after a delay
            setTimeout(() => {
              resetPayment();
              navigate('/dashboard');
            }, 2000);
          } catch (error) {
            console.error('Error booking tickets:', error);
            setPaymentStatus('error');
            setPaymentError('Payment was processed but there was an issue booking your tickets.');
            
            toast({
              title: 'Booking Error',
              description: 'There was an issue booking your tickets. Please contact support.',
              variant: 'destructive',
            });
          }
        } else {
          setPaymentStatus('success');
          toast({
            title: 'Payment Successful!',
            description: 'Your tickets have been booked successfully.',
          });
          
          // Reset form and navigate to home after a delay
          setTimeout(() => {
            resetPayment();
            navigate('/');
          }, 2000);
        }
      } else {
        setPaymentStatus('error');
        setPaymentError('Payment processing failed. Please try again.');
        
        toast({
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setPaymentStatus('error');
      setPaymentError('An unexpected error occurred. Please try again later.');
      
      toast({
        title: 'Payment Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // Validate payment info
  const validatePaymentInfo = (): boolean => {
    const { cardNumber, cardName, expiryDate, cvc, email } = paymentInfo;
    
    // Check if all fields are filled
    if (!cardNumber || !cardName || !expiryDate || !cvc || !email) {
      return false;
    }
    
    // Basic validation
    const isCardNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDate);
    const isCvcValid = /^\d{3,4}$/.test(cvc);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    return isCardNumberValid && isExpiryValid && isCvcValid && isEmailValid;
  };

  // Reset payment
  const resetPayment = () => {
    setPaymentInfo({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvc: '',
      email: '',
    });
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentInfo,
        setPaymentInfo,
        paymentStatus,
        processPayment,
        resetPayment,
        paymentError,
        processRazorpayPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook for using the payment context
export const usePayment = () => useContext(PaymentContext);

