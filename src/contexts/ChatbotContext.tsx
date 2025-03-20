import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

// Message types
export type MessageType = 'user' | 'bot' | 'system';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  options?: { text: string; value: string }[];
}

// Ticket types
export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  isExhibition?: boolean;
}

// Intent type
type Intent = 
  | 'greeting' 
  | 'buy_tickets' 
  | 'exhibition_info' 
  | 'opening_hours' 
  | 'pricing' 
  | 'location' 
  | 'facilities' 
  | 'accessibility'
  | 'unknown';

// Context type
interface ChatbotContextType {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (message?: string) => void;
  sendOptionSelection: (value: string) => void;
  isTyping: boolean;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  ticketTypes: TicketType[];
  selectedTickets: Record<string, number>;
  setSelectedTickets: (tickets: Record<string, number>) => void;
  totalPrice: number;
  resetChat: () => void;
}

// Create context
const ChatbotContext = createContext<ChatbotContextType>({
  messages: [],
  inputValue: '',
  setInputValue: () => {},
  sendMessage: () => {},
  sendOptionSelection: () => {},
  isTyping: false,
  selectedDate: null,
  setSelectedDate: () => {},
  ticketTypes: [],
  selectedTickets: {},
  setSelectedTickets: () => {},
  totalPrice: 0,
  resetChat: () => {},
});

// Available ticket types
const availableTicketTypes: TicketType[] = [
  {
    id: 'adult',
    name: 'Adult',
    price: 20,
    description: 'Regular admission for adults (18-64 years)',
    available: true,
  },
  {
    id: 'child',
    name: 'Child',
    price: 10,
    description: 'For children (6-17 years)',
    available: true,
  },
  {
    id: 'senior',
    name: 'Senior',
    price: 15,
    description: 'For seniors (65+ years)',
    available: true,
  },
  {
    id: 'student',
    name: 'Student',
    price: 12,
    description: 'For students with valid ID',
    available: true,
  },
  
];

// ChatbotProvider component
export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(availableTicketTypes.filter(ticket => !ticket.isExhibition));
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch exhibitions from the API
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get('/api/exhibitions');
        const apiExhibitions = response.data.exhibitions;
        
        // Transform API exhibitions to ticket types
        const exhibitionTickets = apiExhibitions.map((exhibition: any) => ({
          id: exhibition._id,
          name: exhibition.name,
          price: exhibition.price,
          description: exhibition.description,
          available: exhibition.status === 'active',
          isExhibition: true,
        }));
        
        // Combine general admission tickets with exhibition tickets
        setTicketTypes([
          ...availableTicketTypes.filter(ticket => !ticket.isExhibition),
          ...exhibitionTickets
        ]);
      } catch (error) {
        console.error('Error fetching exhibitions for tickets:', error);
      }
    };
    
    fetchExhibitions();
  }, []);
  
  // Initialize the chat with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: t('chatbot.welcome'),
        timestamp: new Date(),
        options: [
          { text: t('tickets.title'), value: 'buy_tickets' },
          { text: t('nav.exhibitions'), value: 'exhibition_info' },
          { text: 'Opening Hours', value: 'opening_hours' },
        ],
      };
      setMessages([welcomeMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update welcome message when language changes
  useEffect(() => {
    if (messages.length > 0 && messages[0].type === 'bot') {
      const updatedWelcomeMessage = {
        ...messages[0],
        content: t('chatbot.welcome'),
        options: [
          { text: t('tickets.title'), value: 'buy_tickets' },
          { text: t('nav.exhibitions'), value: 'exhibition_info' },
          { text: 'Opening Hours', value: 'opening_hours' },
        ],
      };
      setMessages([updatedWelcomeMessage, ...messages.slice(1)]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Calculate total price when selected tickets change
  useEffect(() => {
    let total = 0;
    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      if (ticket) {
        total += ticket.price * quantity;
      }
    });
    setTotalPrice(total);
  }, [selectedTickets, ticketTypes]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect intent from user message
  const detectIntent = (message: string): Intent => {
    const lowerMessage = message.toLowerCase();
    
    if (/\b(hello|hi|hey|hola|bonjour|guten tag|ciao)\b/.test(lowerMessage)) {
      return 'greeting';
    }
    
    if (/\b(ticket|tickets|buy|purchase|book|booking|reserve|reservation)\b/.test(lowerMessage)) {
      return 'buy_tickets';
    }
    
    if (/\b(exhibit|exhibition|gallery|display|showing|art|collection)\b/.test(lowerMessage)) {
      return 'exhibition_info';
    }
    
    if (/\b(open|opening|hours|time|schedule|when|close|closing)\b/.test(lowerMessage)) {
      return 'opening_hours';
    }
    
    if (/\b(price|cost|fee|admission|how much|charges)\b/.test(lowerMessage)) {
      return 'pricing';
    }
    
    if (/\b(where|location|address|directions|how to get|find)\b/.test(lowerMessage)) {
      return 'location';
    }
    
    if (/\b(facilities|amenities|services|cafe|restaurant|shop|store|restroom|toilet|bathroom)\b/.test(lowerMessage)) {
      return 'facilities';
    }
    
    if (/\b(accessible|accessibility|wheelchair|disabled|disability|special needs)\b/.test(lowerMessage)) {
      return 'accessibility';
    }
    
    return 'unknown';
  };

  // Generate bot response based on intent
  const generateResponse = (intent: Intent, userMessage: string): Message => {
    const responseId = Date.now().toString();
    
    switch (intent) {
      case 'greeting':
        return {
          id: responseId,
          type: 'bot',
          content: `${t('chatbot.welcome')} How can I assist you today?`,
          timestamp: new Date(),
          options: [
            { text: t('tickets.title'), value: 'buy_tickets' },
            { text: t('nav.exhibitions'), value: 'exhibition_info' },
            { text: 'Opening Hours', value: 'opening_hours' },
          ],
        };
      
      case 'buy_tickets':
        return {
          id: responseId,
          type: 'bot',
          content: 'I can help you purchase tickets! Would you like to see our ticket options or go directly to the booking page?',
          timestamp: new Date(),
          options: [
            { text: 'Show ticket options', value: 'show_ticket_options' },
            { text: 'Go to booking page', value: 'go_to_booking' },
          ],
        };
      
      case 'exhibition_info':
        return {
          id: responseId,
          type: 'bot',
          content: 'We have several fascinating exhibitions currently on display. Would you like to learn more about our current exhibitions?',
          timestamp: new Date(),
          options: [
            { text: 'Current exhibitions', value: 'current_exhibitions' },
            { text: 'Upcoming exhibitions', value: 'upcoming_exhibitions' },
          ],
        };
      
      case 'opening_hours':
        return {
          id: responseId,
          type: 'bot',
          content: 'Our opening hours:\n• Monday: Closed\n• Tuesday - Friday: 10:00 - 18:00\n• Saturday - Sunday: 09:00 - 20:00\n• Public Holidays: 10:00 - 16:00\n\nPlease note that last admission is 1 hour before closing.',
          timestamp: new Date(),
        };
      
      case 'pricing':
        return {
          id: responseId,
          type: 'bot',
          content: 'Our admission prices are as follows: Adults $20, Seniors (65+) $15, Students $12, Children (6-17) $10, and Children under 6 are free. Would you like to purchase tickets now?',
          timestamp: new Date(),
          options: [
            { text: 'Purchase tickets', value: 'buy_tickets' },
            { text: 'More information', value: 'pricing_details' },
          ],
        };
      
      case 'location':
        return {
          id: responseId,
          type: 'bot',
          content: 'Our museum is located at 123 Art Avenue, Cultural District, City. We are accessible by public transportation (buses 10, 24, and 35 stop nearby) and have parking available.',
          timestamp: new Date(),
          options: [
            { text: 'Get directions', value: 'get_directions' },
            { text: 'Parking information', value: 'parking_info' },
          ],
        };
      
      case 'facilities':
        return {
          id: responseId,
          type: 'bot',
          content: 'Our museum features a café, gift shop, coat check, free Wi-Fi, and restrooms on every floor. All facilities are accessible for visitors with disabilities.',
          timestamp: new Date(),
        };
      
      case 'accessibility':
        return {
          id: responseId,
          type: 'bot',
          content: 'Our museum is fully accessible for visitors with disabilities. We offer wheelchair ramps, elevators, accessible restrooms, and assistive listening devices. Service animals are welcome.',
          timestamp: new Date(),
          options: [
            { text: 'Accessibility services', value: 'accessibility_services' },
          ],
        };
      
      default:
        return {
          id: responseId,
          type: 'bot',
          content: "I'm not sure I understand. Can you please rephrase or select one of these options?",
          timestamp: new Date(),
          options: [
            { text: t('tickets.title'), value: 'buy_tickets' },
            { text: t('nav.exhibitions'), value: 'exhibition_info' },
            { text: 'Opening Hours', value: 'opening_hours' },
            { text: 'Museum Location', value: 'location' },
          ],
        };
    }
  };

  // Handle option selection
  const handleOptionSelection = async (value: string) => {
    switch (value) {
      case 'buy_tickets':
        addBotMessage('Great! Let me help you with ticket booking. Would you like to book tickets for today or select another date?', [
          { text: 'Book for today', value: 'book_today' },
          { text: 'Select another date', value: 'select_date' },
        ]);
        break;
      
      case 'book_today':
        setSelectedDate(new Date());
        addBotMessage('Perfect! How many tickets would you like to book?', [
          { text: 'Go to tickets page', value: 'go_to_tickets' },
        ]);
        break;
      
      case 'select_date':
        addBotMessage('You can select a date on our tickets page. Would you like to go there now?', [
          { text: 'Go to tickets page', value: 'go_to_tickets' },
        ]);
        break;
      
      case 'go_to_tickets':
      case 'go_to_booking':
        addBotMessage('Taking you to our ticket booking page...');
        setTimeout(() => {
          navigate('/tickets');
        }, 1000);
        break;
      
      case 'show_ticket_options':
        const ticketInfo = ticketTypes.map(ticket => 
          `• ${ticket.name}: $${ticket.price} - ${ticket.description}`
        ).join('\n');
        
        addBotMessage(`Here are our ticket options:\n\n${ticketInfo}\n\nWould you like to proceed with booking?`, [
          { text: 'Book tickets', value: 'go_to_booking' },
        ]);
        break;
      
      case 'current_exhibitions':
        // Get active exhibitions from ticketTypes
        const currentExhibitions = ticketTypes
          .filter(ticket => ticket.isExhibition && ticket.available)
          .map(ticket => ticket.name)
          .join('", "');
        
        if (currentExhibitions) {
          addBotMessage(`Our current exhibitions include "${currentExhibitions}." Would you like more details about any of these?`, [
            ...ticketTypes
              .filter(ticket => ticket.isExhibition && ticket.available)
              .map(ticket => ({ 
                text: ticket.name, 
                value: `exhibition_${ticket.id}` 
              })),
            { text: 'View all exhibitions', value: 'view_exhibitions' },
          ]);
        } else {
          addBotMessage('We currently don\'t have any active exhibitions. Please check back later or visit our exhibitions page for upcoming shows.', [
            { text: 'View all exhibitions', value: 'view_exhibitions' },
          ]);
        }
        break;
      
      case 'upcoming_exhibitions':
        addBotMessage('We have exciting upcoming exhibitions including "Digital Art Revolution" (starting next month) and "Indigenous Cultures" (in three months). Would you like to be notified when these open?', [
          { text: 'Notify me', value: 'exhibition_notify' },
          { text: 'More information', value: 'exhibition_upcoming_info' },
        ]);
        break;
      
      case 'view_exhibitions':
        addBotMessage('Taking you to our exhibitions page...');
        setTimeout(() => {
          navigate('/exhibitions');
        }, 1000);
        break;
      
      case 'get_directions':
        addBotMessage('You can find directions to our museum using Google Maps. We\'re located at 123 Art Avenue, Cultural District, City.');
        break;
      
      case 'pricing_details':
        addBotMessage('We also offer family passes ($50 for 2 adults and up to 3 children) and annual memberships starting at $75. Members enjoy unlimited free admission, special exhibition discounts, and invitations to exclusive events.');
        break;
      
      case 'parking_info':
        addBotMessage('We have a parking garage with 200 spaces. Parking costs $5 for the first 2 hours and $2 for each additional hour. Museum members receive a 50% discount on parking fees.');
        break;
      
      case 'accessibility_services':
        addBotMessage('We offer specialized tours for visitors with visual or hearing impairments, large-print and Braille materials, and sign language interpretation with advance notice. Please contact us at accessibility@museum.com for more information or to request specific accommodations.');
        break;
      
      case 'exhibition_notify':
        addBotMessage('To receive notifications about upcoming exhibitions, please enter your email address on our "About" page or sign up for our newsletter.');
        break;
      
      case 'exhibition_upcoming_info':
        addBotMessage('Our upcoming "Digital Art Revolution" exhibition will feature cutting-edge works by renowned digital artists, interactive installations, and virtual reality experiences. "Indigenous Cultures" will showcase art, artifacts, and cultural expressions from indigenous communities around the world.');
        break;
      
      // Handle dynamic exhibition selection
      default:
        if (value.startsWith('exhibition_')) {
          const exhibitionId = value.replace('exhibition_', '');
          const exhibition = ticketTypes.find(ticket => ticket.id === exhibitionId);
          
          if (exhibition) {
            addBotMessage(`${exhibition.name}: ${exhibition.description} Would you like to book tickets to see this exhibition?`, [
              { text: 'Book tickets', value: 'go_to_booking' },
              { text: 'View all exhibitions', value: 'view_exhibitions' },
            ]);
          } else {
            addBotMessage("I couldn't find information about that exhibition. Would you like to see our available exhibitions?", [
              { text: 'View all exhibitions', value: 'view_exhibitions' },
            ]);
          }
          break;
        }
        
        addBotMessage("I'm not sure how to handle that request. Can I help you with something else?", [
          { text: t('tickets.title'), value: 'buy_tickets' },
          { text: t('nav.exhibitions'), value: 'exhibition_info' },
        ]);
    }
  };

  // Add bot message
  const addBotMessage = (content: string, options?: { text: string; value: string }[]) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      options,
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Handle sending a message
  const sendMessage = async (customMessage?: string) => {
    const userMessage = customMessage || inputValue.trim();
    
    if (!userMessage) return;
    
    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Detect intent and generate response
    const intent = detectIntent(userMessage);
    
    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(intent, userMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Handle option selection
  const sendOptionSelection = (value: string) => {
    handleOptionSelection(value);
  };

  // Reset chat
  const resetChat = () => {
    setMessages([]);
    setSelectedDate(null);
    setSelectedTickets({});
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: t('chatbot.welcome'),
      timestamp: new Date(),
      options: [
        { text: t('tickets.title'), value: 'buy_tickets' },
        { text: t('nav.exhibitions'), value: 'exhibition_info' },
        { text: 'Opening Hours', value: 'opening_hours' },
      ],
    };
    setMessages([welcomeMessage]);
    
    toast({
      title: 'Chat Reset',
      description: 'The conversation has been reset.',
    });
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        inputValue,
        setInputValue,
        sendMessage,
        sendOptionSelection,
        isTyping,
        selectedDate,
        setSelectedDate,
        ticketTypes,
        selectedTickets,
        setSelectedTickets,
        totalPrice,
        resetChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook for using the chatbot context
export const useChatbot = () => useContext(ChatbotContext);
