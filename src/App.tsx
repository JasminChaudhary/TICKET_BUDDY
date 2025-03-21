import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tickets from "./pages/Tickets";
import Exhibitions from "./pages/Exhibitions";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TicketSummary from "./pages/TicketSummary";
import PaymentPage from "./pages/PaymentPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Create an AppWrapper to manage the language change effect
const AppWrapper = () => {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render the entire app when language changes
      setKey(prevKey => prevKey + 1);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  return <App key={key} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <ChatbotProvider>
                <PaymentProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="tickets" element={<Tickets />} />
                      <Route path="exhibitions" element={<Exhibitions />} />
                      <Route path="about" element={<About />} />
                      <Route path="summary" element={<TicketSummary />} />
                      <Route path="payment" element={<PaymentPage />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </PaymentProvider>
              </ChatbotProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default AppWrapper;
