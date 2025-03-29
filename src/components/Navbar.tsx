import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Moon, Sun, Globe, UserCircle, Landmark, Ticket } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Logo component
const Logo: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center p-1 rounded-lg bg-accent-700">
        <Landmark className="h-6 w-6 text-white" />
      </div>
      <div className="flex items-center">
        <span className="text-xl font-bold text-museum-900 dark:text-white ml-1">
        Ticket Buddy
        </span>
      </div>
    </div>
  );
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Force re-render when language changes
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-background"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/tickets"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  location.pathname === '/tickets'
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {t('nav.tickets')}
              </Link>
              <Link
                to="/exhibitions"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  location.pathname === '/exhibitions'
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {t('nav.exhibitions')}
              </Link>
              <Link
                to="/about"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  location.pathname === '/about'
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {t('nav.about')}
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      location.pathname === '/dashboard'
                        ? "text-primary border-b-2 border-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {t('nav.myTickets')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={cn(
                        "inline-flex items-center px-1 pt-1 text-sm font-medium",
                        location.pathname === '/admin'
                          ? "text-primary border-b-2 border-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {t('nav.adminPanel')}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent/50' : ''}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')} className={language === 'es' ? 'bg-accent/50' : ''}>
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')} className={language === 'fr' ? 'bg-accent/50' : ''}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('de')} className={language === 'de' ? 'bg-accent/50' : ''}>
                  Deutsch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('zh')} className={language === 'zh' ? 'bg-accent/50' : ''}>
                  中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ja')} className={language === 'ja' ? 'bg-accent/50' : ''}>
                  日本語
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm">
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    {t('nav.myDashboard')}
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem 
                      className="text-sm"
                      onClick={() => navigate('/admin')}
                    >
                      {t('nav.adminPanel')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-sm text-red-600"
                    onClick={() => logout()}
                  >
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button>{t('nav.signup')}</Button>
                </Link>
              </div>
            )}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-4 px-2 space-y-1 bg-background border-b border-border shadow-lg">
            <Link
              to="/tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block touch-target px-4 py-3 rounded-md text-base font-medium",
                location.pathname === '/tickets'
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {t('nav.tickets')}
            </Link>
            <Link
              to="/exhibitions"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block touch-target px-4 py-3 rounded-md text-base font-medium",
                location.pathname === '/exhibitions'
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {t('nav.exhibitions')}
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block touch-target px-4 py-3 rounded-md text-base font-medium",
                location.pathname === '/about'
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {t('nav.about')}
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block touch-target px-4 py-3 rounded-md text-base font-medium",
                    location.pathname === '/dashboard'
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {t('nav.myTickets')}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block touch-target px-4 py-3 rounded-md text-base font-medium",
                      location.pathname === '/admin'
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {t('nav.adminPanel')}
                  </Link>
                )}
              </>
            )}
            {!user && (
              <div className="flex flex-col space-y-2 mt-4 px-4">
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full justify-center">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full justify-center">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
