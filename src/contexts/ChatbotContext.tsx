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
  isRichContent?: boolean;
  richContent?: {
    type: 'image' | 'link' | 'map' | 'card' | 'exhibition';
    data: any;
  };
}

// Ticket types
export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  isExhibition?: boolean;
  startDate?: Date;
  endDate?: Date;
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
  | 'faq'
  | 'membership'
  | 'events'
  | 'feedback'
  | 'help'
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
  isExhibitionAvailable: (exhibitionId: string, date: Date | null) => boolean;
  conversationContext: string[];
  setConversationContext: (context: string[]) => void;
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
  isExhibitionAvailable: () => false,
  conversationContext: [],
  setConversationContext: () => {},
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
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<Record<string, any>>({});
  
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
          startDate: new Date(exhibition.startDate),
          endDate: new Date(exhibition.endDate)
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
          { text: t('chatbot.openingHours'), value: 'opening_hours' },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [t]);

  // Update welcome message when language changes
  useEffect(() => {
    if (messages.length > 0 && messages[0].type === 'bot') {
      const updatedWelcomeMessage = {
        ...messages[0],
        content: t('chatbot.welcome'),
        options: [
          { text: t('tickets.title'), value: 'buy_tickets' },
          { text: t('nav.exhibitions'), value: 'exhibition_info' },
          { text: t('chatbot.openingHours'), value: 'opening_hours' },
        ],
      };
      setMessages([updatedWelcomeMessage, ...messages.slice(1)]);
    }
  }, [language, t]);

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

  // Check if exhibition is available on the selected date
  const isExhibitionAvailable = (exhibitionId: string, date: Date | null): boolean => {
    if (!date) return false;
    
    const exhibition = ticketTypes.find(ticket => ticket.id === exhibitionId);
    if (!exhibition || !exhibition.isExhibition) return false;
    
    const visitDate = new Date(date);
    // Reset time to compare dates only
    visitDate.setHours(0, 0, 0, 0);
    
    const startDate = exhibition.startDate;
    const endDate = exhibition.endDate;
    
    if (!startDate || !endDate) return false;
    
    // Clone the dates and reset time to compare dates only
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return visitDate >= start && visitDate <= end;
  };

  // FAQ data
  const faqData = [
    {
      question: 'What are your opening hours?',
      answer: 'Our museum is open Tuesday to Sunday from 10:00 AM to 6:00 PM. We are closed on Mondays and major holidays. Last admission is at 5:00 PM.',
      keywords: ['opening', 'hours', 'time', 'schedule', 'when', 'close', 'open', 'visit']
    },
    {
      question: 'How much do tickets cost?',
      answer: 'Adult tickets are $20, Seniors (65+) are $15, Students are $12, and Children (6-17) are $10. Children under 6 are free. We also offer family passes for $50 (2 adults and up to 3 children).',
      keywords: ['ticket', 'cost', 'price', 'fee', 'admission', 'how much', 'discount']
    },
    {
      question: 'Do you offer guided tours?',
      answer: 'Yes, we offer guided tours at 11:00 AM, 1:00 PM, and 3:00 PM daily. Tours last approximately 90 minutes and are included with your admission. Audio guides are also available in multiple languages for a small fee.',
      keywords: ['tour', 'guide', 'guided', 'audio']
    },
    {
      question: 'Is the museum accessible for visitors with disabilities?',
      answer: 'Yes, our museum is fully accessible for visitors with disabilities. We offer wheelchair ramps, elevators, accessible restrooms, and assistive listening devices. Service animals are welcome.',
      keywords: ['accessible', 'accessibility', 'disability', 'wheelchair', 'handicap']
    },
    {
      question: 'What facilities do you have?',
      answer: 'Our museum features a café, gift shop, coat check, free Wi-Fi, and restrooms on every floor. All facilities are accessible for visitors with disabilities.',
      keywords: ['facilities', 'amenities', 'services', 'café', 'cafe', 'shop', 'restroom', 'wifi']
    },
    {
      question: 'Can I take photographs in the museum?',
      answer: 'Photography for personal use is permitted in most permanent collection galleries, but flash photography, tripods, and selfie sticks are not allowed. Photography is not permitted in some special exhibitions or where specifically prohibited.',
      keywords: ['photo', 'photograph', 'camera', 'picture', 'flash', 'selfie']
    },
    {
      question: 'Do you offer membership?',
      answer: 'Yes, we offer annual memberships starting at $75 for individuals. Members enjoy unlimited free admission, special exhibition discounts, invitations to exclusive events, and discounts at our café and gift shop.',
      keywords: ['member', 'membership', 'annual', 'subscription']
    },
    {
      question: 'Can I book tickets online?',
      answer: 'Yes, you can book tickets online through our website or via our chatbot assistant. Online booking is recommended to avoid queues, especially during peak times and for special exhibitions.',
      keywords: ['online', 'book', 'booking', 'reserve', 'advance']
    },
  ];

  // Search FAQ for relevant answer
  const searchFAQ = (query: string): { question: string, answer: string } | null => {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    
    // Score each FAQ by matching keywords
    const scoredFAQs = faqData.map(faq => {
      let score = 0;
      
      // Check for exact phrases
      if (lowerQuery.includes(faq.question.toLowerCase())) {
        score += 10;
      }
      
      // Check for keywords
      for (const keyword of faq.keywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 5;
        }
      }
      
      // Check for individual words
      for (const word of words) {
        if (word.length > 3) { // Ignore short words
          if (faq.question.toLowerCase().includes(word)) {
            score += 2;
          }
          
          for (const keyword of faq.keywords) {
            if (keyword.toLowerCase().includes(word)) {
              score += 1;
            }
          }
        }
      }
      
      return { faq, score };
    });
    
    // Sort by score and get the best match
    const bestMatch = scoredFAQs.sort((a, b) => b.score - a.score)[0];
    
    // Return the best match if it has a minimum score
    if (bestMatch && bestMatch.score >= 5) {
      return { 
        question: bestMatch.faq.question, 
        answer: bestMatch.faq.answer 
      };
    }
    
    return null;
  };

  // Advanced intent detection with context awareness
  const detectIntent = (message: string): Intent => {
    const lowerMessage = message.toLowerCase();
    
    // Check if this is a follow-up question based on conversation context
    if (conversationContext.includes('exhibition') && 
        /\b(when|date|time|how long|duration|until|end|running)\b/.test(lowerMessage)) {
      return 'exhibition_info';
    }
    
    if (conversationContext.includes('ticket') && 
        /\b(how many|which|type|discount|offer|bundle|deal)\b/.test(lowerMessage)) {
      return 'buy_tickets';
    }
    
    // Regular intent detection with expanded patterns
    if (/\b(hello|hi|hey|hola|bonjour|guten tag|ciao|greetings|good morning|good afternoon|good evening|howdy)\b/.test(lowerMessage)) {
      return 'greeting';
    }
    
    if (/\b(ticket|tickets|buy|purchase|book|booking|reserve|reservation|admit|admission|entry|entrance|pass|passes)\b/.test(lowerMessage)) {
      // Add 'ticket' to conversation context
      if (!conversationContext.includes('ticket')) {
        setConversationContext([...conversationContext, 'ticket']);
      }
      return 'buy_tickets';
    }
    
    if (/\b(exhibit|exhibition|gallery|display|showing|art|collection|artist|artwork|painting|sculpture|installation)\b/.test(lowerMessage)) {
      // Add 'exhibition' to conversation context
      if (!conversationContext.includes('exhibition')) {
        setConversationContext([...conversationContext, 'exhibition']);
      }
      return 'exhibition_info';
    }
    
    if (/\b(open|opening|hours|time|schedule|when|close|closing|day|days|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|weekday)\b/.test(lowerMessage)) {
      return 'opening_hours';
    }
    
    if (/\b(price|cost|fee|admission|how much|charges|pay|pricing|dollar|money|expensive|cheap|affordable|discount|offer|deal|special)\b/.test(lowerMessage)) {
      return 'pricing';
    }
    
    if (/\b(where|location|address|directions|how to get|find|map|nearby|area|district|neighborhood|transport|parking|drive|bus|train|subway|metro|taxi|uber)\b/.test(lowerMessage)) {
      return 'location';
    }
    
    if (/\b(facilities|amenities|services|cafe|restaurant|food|drink|coffee|shop|store|gift|souvenir|restroom|toilet|bathroom|wifi|internet|coat check|locker|storage)\b/.test(lowerMessage)) {
      return 'facilities';
    }
    
    if (/\b(accessible|accessibility|wheelchair|disabled|disability|special needs|service animal|hearing|visual|impairment|aid|assistance)\b/.test(lowerMessage)) {
      return 'accessibility';
    }
    
    if (/\b(faq|question|answer|explain|tell me about|information|info|learn about|curious about|wondering about)\b/.test(lowerMessage)) {
      return 'faq';
    }
    
    if (/\b(member|membership|subscribe|subscription|join|annual|monthly|pass|benefit|discount|special|vip)\b/.test(lowerMessage)) {
      return 'membership';
    }
    
    if (/\b(event|events|program|activity|workshop|lecture|talk|tour|special|happening|upcoming|calendar|schedule)\b/.test(lowerMessage)) {
      return 'events';
    }
    
    if (/\b(feedback|suggest|suggestion|improve|review|experience|opinion|thought|comment|complain|complaint|issue|problem)\b/.test(lowerMessage)) {
      return 'feedback';
    }
    
    if (/\b(help|assist|support|guide|how do i|how to|what can you do|commands|options|capabilities)\b/.test(lowerMessage)) {
      return 'help';
    }
    
    // Check FAQ as fallback
    const faqMatch = searchFAQ(message);
    if (faqMatch) {
      return 'faq';
    }
    
    return 'unknown';
  };

  // Generate bot response based on intent
  const generateResponse = (intent: Intent, userMessage: string): Message => {
    const responseId = Date.now().toString();
    
    // Check if there's a relevant FAQ match
    const faqMatch = searchFAQ(userMessage);
    
    switch (intent) {
      case 'greeting':
        // Personalized greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Hello';
        
        if (hour < 12) {
          greeting = 'Good morning';
        } else if (hour < 18) {
          greeting = 'Good afternoon';
        } else {
          greeting = 'Good evening';
        }
        
        return {
          id: responseId,
          type: 'bot',
          content: `${greeting}! ${t('chatbot.welcome')} How can I assist you today?`,
          timestamp: new Date(),
          options: [
            { text: t('tickets.title'), value: 'buy_tickets' },
            { text: t('nav.exhibitions'), value: 'exhibition_info' },
            { text: t('chatbot.openingHours'), value: 'opening_hours' },
            { text: 'Museum Facilities', value: 'facilities' },
          ],
        };
      
      case 'faq':
        // If we have a FAQ match, use it
        if (faqMatch) {
          return {
            id: responseId,
            type: 'bot',
            content: `${faqMatch.answer}\n\nIs there anything else you'd like to know?`,
            timestamp: new Date(),
            options: [
              { text: 'Book tickets', value: 'buy_tickets' },
              { text: 'Exhibition information', value: 'exhibition_info' },
            ],
          };
        }
        // Fall through to default if no match
      
      case 'buy_tickets':
        return {
          id: responseId,
          type: 'bot',
          content: 'I can help you purchase tickets! Would you like to see our ticket options or go directly to the booking page?',
          timestamp: new Date(),
          options: [
            { text: 'Show ticket options', value: 'show_ticket_options' },
            { text: 'Go to booking page', value: 'go_to_booking' },
            { text: 'Group bookings', value: 'group_booking' },
            { text: 'Special discounts', value: 'ticket_discounts' },
          ],
        };
      
      case 'exhibition_info':
        // Enhanced with rich content from actual API data
        return {
          id: responseId,
          type: 'bot',
          content: 'We have several fascinating exhibitions currently on display. Here are some highlights:',
          timestamp: new Date(),
          isRichContent: true,
          richContent: {
            type: 'exhibition',
            data: {
              exhibitions: ticketTypes
                .filter(ticket => ticket.isExhibition && ticket.available)
                .map(exhibition => ({
                  id: exhibition.id,
                  name: exhibition.name,
                  description: exhibition.description,
                  dates: exhibition.startDate && exhibition.endDate ? 
                    `${exhibition.startDate.toLocaleDateString()} - ${exhibition.endDate.toLocaleDateString()}` : 
                    'Ongoing'
                }))
            }
          },
          options: [
            { text: 'Current exhibitions', value: 'current_exhibitions' },
            { text: 'Upcoming exhibitions', value: 'upcoming_exhibitions' },
            { text: 'Book exhibition tickets', value: 'go_to_booking' },
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
        // Use actual ticket prices from ticketTypes
        const generalTickets = ticketTypes.filter(ticket => !ticket.isExhibition);
        const ticketPricing = generalTickets.map(ticket => 
          `${ticket.name}: $${ticket.price} - ${ticket.description}`
        ).join('\n• ');
        
        return {
          id: responseId,
          type: 'bot',
          content: `Our admission prices are as follows:\n\n• ${ticketPricing}\n\nWould you like to purchase tickets now?`,
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
        // If we have a FAQ match, use it even for unknown intent
        if (faqMatch) {
          return {
            id: responseId,
            type: 'bot',
            content: `${faqMatch.answer}\n\nIs there anything else you'd like to know?`,
            timestamp: new Date(),
            options: [
              { text: t('tickets.title'), value: 'buy_tickets' },
              { text: t('nav.exhibitions'), value: 'exhibition_info' },
            ],
          };
        }
        
        return {
          id: responseId,
          type: 'bot',
          content: "I'm not sure I understand. Can you please rephrase or select one of these options?",
          timestamp: new Date(),
          options: [
            { text: t('tickets.title'), value: 'buy_tickets' },
            { text: t('nav.exhibitions'), value: 'exhibition_info' },
            { text: t('chatbot.openingHours'), value: 'opening_hours' },
            { text: 'Museum Location', value: 'location' },
            { text: 'Help', value: 'help' },
          ],
        };
    }
  };

  // Enhance the handleOptionSelection with new options
  const handleOptionSelection = async (value: string) => {
    switch (value) {
      case 'buy_tickets':
        addBotMessage('Great! Let me help you with ticket booking. Would you like to book tickets for today or select another date?', [
          { text: t('chatbot.bookToday'), value: 'book_today' },
          { text: t('chatbot.selectDate'), value: 'select_date' },
        ]);
        break;
      
      case 'book_today':
        setSelectedDate(new Date());
        addBotMessage('Perfect! How many tickets would you like to book?', [
          { text: t('chatbot.goToTickets'), value: 'go_to_tickets' },
        ]);
        break;
      
      case 'select_date':
        addBotMessage('You can select a date on our tickets page. Would you like to go there now?', [
          { text: t('chatbot.goToTickets'), value: 'go_to_tickets' },
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
        // Filter upcoming exhibitions from API data
        const upcomingExhibitions = ticketTypes
          .filter(ticket => 
            ticket.isExhibition && 
            ticket.startDate && 
            new Date(ticket.startDate) > new Date()
          );
        
        if (upcomingExhibitions.length > 0) {
          const upcomingList = upcomingExhibitions
            .map(ex => `"${ex.name}" (starting ${new Date(ex.startDate!).toLocaleDateString()})`)
            .join(' and ');
          
          addBotMessage(`We have exciting upcoming exhibitions including ${upcomingList}. Would you like to be notified when these open?`, [
          { text: 'Notify me', value: 'exhibition_notify' },
            { text: 'More information', value: 'view_exhibitions' },
          ]);
        } else {
          addBotMessage('We don\'t have any upcoming exhibitions scheduled at the moment. Please check our exhibitions page later for updates.', [
            { text: 'View current exhibitions', value: 'current_exhibitions' },
          ]);
        }
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
      
      case 'group_booking':
        addBotMessage('For groups of 10 or more, we offer special rates and booking options. Large groups can receive up to 20% discount on regular admission. Would you like to make a group booking?', [
          { text: 'Request group booking', value: 'request_group' },
          { text: 'Group rates', value: 'group_rates' },
        ]);
        break;
      
      case 'ticket_discounts':
        addBotMessage('We offer several discount options:\n\n• Students: 40% off with valid ID\n• Seniors (65+): 25% off\n• Military personnel: 25% off\n• Museum members: Free admission\n• City residents: Free admission on the first Sunday of each month\n\nDiscounts cannot be combined with other offers.');
        break;
      
      case 'request_group':
        addBotMessage('To request a group booking, please contact our group sales department at groups@museum.com or call (555) 123-4567. Please provide your preferred date, time, group size, and any special requirements.');
        break;
      
      case 'group_rates':
        addBotMessage('Our group rates (10+ people) are:\n\n• Adults: $16 per person (20% off)\n• Students: $9 per person (25% off)\n• Seniors: $12 per person (20% off)\n• Children: $8 per person (20% off)\n\nOne free chaperone ticket is provided for every 10 students for school groups.');
        break;
      
      // Handle dynamic exhibition selection
      default:
        if (value.startsWith('exhibition_')) {
          const exhibitionId = value.replace('exhibition_', '');
          const exhibition = ticketTypes.find(ticket => ticket.id === exhibitionId);
          
          if (exhibition) {
            // Create a formatted date range if available
            let dateInfo = '';
            if (exhibition.startDate && exhibition.endDate) {
              dateInfo = `\n\nAvailable from ${new Date(exhibition.startDate).toLocaleDateString()} to ${new Date(exhibition.endDate).toLocaleDateString()}.`;
            }
            
            addBotMessage(`${exhibition.name}: ${exhibition.description}${dateInfo}\n\nWould you like to book tickets to see this exhibition?`, [
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

  // Handle sending a message with enhanced processing
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
    
    // Detect intent with the enhanced detector
    const intent = detectIntent(userMessage);
    
    // Learn user preferences from message
    learnUserPreferences(userMessage);
    
    // Simulate typing delay based on response length (makes it feel more human-like)
    const botResponse = generateResponse(intent, userMessage);
    const typingDelay = Math.min(
      2000, // cap at 2 seconds
      1000 + (botResponse.content.length / 10) * 100 // Base delay + length-based addition
    );
    
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };
  
  // Learn user preferences from their messages
  const learnUserPreferences = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Interest in specific exhibition types
    if (lowerMessage.includes('modern art') || lowerMessage.includes('contemporary')) {
      setUserPreferences(prev => ({...prev, artInterest: 'Contemporary'}));
    } else if (lowerMessage.includes('renaissance') || lowerMessage.includes('classical')) {
      setUserPreferences(prev => ({...prev, artInterest: 'Classical'}));
    }
    
    // Family status
    if (lowerMessage.includes('family') || lowerMessage.includes('children') || lowerMessage.includes('kids')) {
      setUserPreferences(prev => ({...prev, hasFamily: true}));
    }
    
    // Accessibility needs
    if (lowerMessage.includes('wheelchair') || lowerMessage.includes('accessible')) {
      setUserPreferences(prev => ({...prev, needsAccessibility: true}));
    }
    
    // Add any more preference learning logic
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
        { text: t('chatbot.openingHours'), value: 'opening_hours' },
      ],
    };
    setMessages([welcomeMessage]);
    
    toast({
      title: 'Chat Reset',
      description: 'The conversation has been reset.',
    });
  };

  // Handle option selection
  const sendOptionSelection = (value: string) => {
    handleOptionSelection(value);
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
        isExhibitionAvailable,
        conversationContext,
        setConversationContext,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook for using the chatbot context
export const useChatbot = () => useContext(ChatbotContext);
