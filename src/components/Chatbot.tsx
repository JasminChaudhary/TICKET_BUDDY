
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatbot, Message as ChatMessage } from '@/contexts/ChatbotContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const location = useLocation();
  
  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    sendOptionSelection,
    isTyping,
    resetChat,
  } = useChatbot();
  
  // Close chatbot when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  // Toggle chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle input form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage();
    }
  };
  
  return (
    <>
      {/* Chatbot toggle button */}
      <Button
        onClick={toggleChatbot}
        className={cn(
          'fixed bottom-6 right-6 z-20 rounded-full h-14 w-14 p-0 shadow-lg transition-all duration-300',
          isOpen ? 'bg-accent-800 hover:bg-accent-900' : 'bg-accent-700 hover:bg-accent-800'
        )}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
      
      {/* Chatbot panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-20 w-[350px] max-h-[600px] rounded-2xl shadow-xl transition-all duration-500 transform',
          'bg-white dark:bg-museum-900 border border-museum-100 dark:border-museum-700 overflow-hidden',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="p-4 bg-museum-50 dark:bg-museum-800 border-b border-museum-100 dark:border-museum-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent-700 dark:text-accent-400" />
            <h2 className="font-medium text-museum-900 dark:text-white">Museum Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetChat}
            className="h-8 w-8 rounded-full hover:bg-museum-200/50 dark:hover:bg-museum-700/50"
            aria-label="Reset chat"
          >
            <RefreshCw className="h-4 w-4 text-museum-600 dark:text-museum-300" />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatbotMessage key={message.id} message={message} onOptionSelect={sendOptionSelection} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2 message-appear">
                <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-accent-700 dark:text-accent-400" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-museum-50 dark:bg-museum-800 text-museum-600 dark:text-museum-300 max-w-[240px]">
                  <p className="loading-dots">{t('general.loading')}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-museum-100 dark:border-museum-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 px-4 py-2 rounded-full bg-museum-50 dark:bg-museum-800 border border-museum-200 dark:border-museum-700 focus:ring-1 focus:ring-accent-500 dark:focus:ring-accent-400 focus:outline-none text-museum-900 dark:text-white placeholder:text-museum-400 dark:placeholder:text-museum-500"
              ref={inputRef}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full h-10 w-10 p-0 bg-accent-700 hover:bg-accent-800 disabled:bg-museum-300 dark:disabled:bg-museum-700"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

// Chatbot message component
const ChatbotMessage: React.FC<{
  message: ChatMessage;
  onOptionSelect: (value: string) => void;
}> = ({ message, onOptionSelect }) => {
  if (message.type === 'user') {
    return (
      <div className="flex items-start justify-end gap-2 message-appear">
        <div className="px-4 py-2 rounded-lg bg-accent-700 text-white max-w-[240px]">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
          <span className="text-accent-700 text-xs font-medium">You</span>
        </div>
      </div>
    );
  }
  
  if (message.type === 'bot') {
    return (
      <div className="space-y-3 message-appear">
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-accent-700 dark:text-accent-400" />
          </div>
          <div className="px-4 py-2 rounded-lg bg-museum-50 dark:bg-museum-800 text-museum-700 dark:text-museum-300 max-w-[240px]">
            <p className="text-sm whitespace-pre-line">{message.content}</p>
          </div>
        </div>
        
        {message.options && message.options.length > 0 && (
          <div className="ml-10 flex flex-wrap gap-2">
            {message.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onOptionSelect(option.value)}
                className="text-xs px-3 py-1.5 rounded-full bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors border border-accent-200 dark:border-accent-800"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export default Chatbot;
